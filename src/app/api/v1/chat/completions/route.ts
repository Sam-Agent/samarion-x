/**
 * @author Sam, 2433022
 * OpenAI 兼容的中转代理接口与计费中间件
 * 支持标准且完全兼容的 v1/chat/completions 路由
 */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const maxDuration = 60; // 允许运行的时长

export async function POST(req: Request) {
    try {
        // 1. 鉴权：获取并验证 API Key
        const authHeader = req.headers.get("authorization") || "";
        if (!authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: { message: "Miss API Key" } }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const apiKey = await prisma.apiKey.findUnique({
            where: { key: token },
            include: { user: true }
        });

        if (!apiKey || !apiKey.isActive) {
            return NextResponse.json({ error: { message: "Invalid API Key" } }, { status: 401 });
        }

        if (apiKey.user.balance <= 0) {
            return NextResponse.json({ error: { message: "Insufficient balance" } }, { status: 402 });
        }

        // 2. 解析请求体
        const bodyText = await req.text();
        let body;
        try {
            body = JSON.parse(bodyText);
        } catch {
            return NextResponse.json({ error: { message: "Invalid JSON" } }, { status: 400 });
        }

        const requestedModelId = body.model;
        if (!requestedModelId) {
            return NextResponse.json({ error: { message: "Missing model" } }, { status: 400 });
        }

        // 3. 校验模型权限与状态
        const sku = await prisma.modelSku.findUnique({
            where: { id: requestedModelId, status: "ACTIVE" }
        });

        if (!sku) {
            return NextResponse.json({
                error: { message: `Model ${requestedModelId} not found` }
            }, { status: 404 });
        }

        // 更新 Key 最近使用时间 (异步)
        prisma.apiKey.update({ where: { id: apiKey.id }, data: { lastUsed: new Date() } }).catch();

        // 4. 获取上游渠道与凭证 (这里取全局设置作为 MVP)
        const providerKeySetting = await prisma.systemSetting.findUnique({
            where: { key: `upstream_${sku.providerType}_key` }
        });

        const upstreamKey = providerKeySetting?.value;
        if (!upstreamKey) {
            return NextResponse.json({ error: { message: "Upstream key not configured" } }, { status: 500 });
        }

        // 如果流式请求，向请求体注入 include_usage 方便后续获取真实 token
        if (body.stream) {
            // 部分模型如果不兼容 stream_options 会报错，这里如果是 OpenAI 类型的可添加
            if (sku.providerType === "openai" || sku.providerType === "deepseek") {
                body.stream_options = { include_usage: true };
            }
        }

        // 替换请求中的模型Id为真实的下游模型Id
        body.model = sku.upstreamModel || sku.id;

        // 根据 providerType 构建 BaseURL
        let upstreamBase = "https://api.openai.com/v1";
        if (sku.providerType === "anthropic") upstreamBase = "https://api.anthropic.com/v1";
        if (sku.providerType === "deepseek") upstreamBase = "https://api.deepseek.com/v1";

        // 发起代理请求
        const fetchRes = await fetch(`${upstreamBase}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${upstreamKey}`
            },
            body: JSON.stringify(body)
        });

        if (!fetchRes.ok) {
            const errorText = await fetchRes.text();
            return new NextResponse(errorText, { status: fetchRes.status, headers: { "Content-Type": "application/json" } });
        }

        // 5. 计费拦截与响应重组
        if (!body.stream) {
            // 非流式，直接读取并计费
            const data = await fetchRes.json();
            const usage = data.usage;
            if (usage) {
                await processBilling(apiKey.userId, apiKey.id, sku, usage.prompt_tokens, usage.completion_tokens);
            }
            return NextResponse.json(data);
        } else {
            // 流式，由于计费相对复杂且不阻断用户使用，MVP 此处透传。
            // 在生产环境中需拦截 stream iterator 并检查最后一个带有 usage 字段的 chunk。
            return new NextResponse(fetchRes.body, {
                headers: { "Content-Type": "text/event-stream" }
            });
        }
    } catch (error) {
        console.error("Proxy error:", error);
        return NextResponse.json({ error: { message: "Internal server proxy error" } }, { status: 500 });
    }
}

// 封装的扣费逻辑
async function processBilling(userId: string, apiKeyId: string, sku: { id: string, inputPricePerM: number, outputPricePerM: number }, promptTokens: number, completionTokens: number) {
    try {
        const costUsd = (promptTokens * sku.inputPricePerM + completionTokens * sku.outputPricePerM) / 1000000;

        await prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: { balance: { decrement: costUsd } }
            }),
            prisma.usageLog.create({
                data: {
                    userId,
                    apiKeyId,
                    modelId: sku.id,
                    promptTokens,
                    completionTokens,
                    totalTokens: promptTokens + completionTokens,
                    costUsd
                }
            })
        ]);
    } catch (err) {
        console.error("计费事务失败:", err);
    }
}
