/**
 * @author Sam, 2433022
 * API Key 管理接口
 * 提供 API Key 的生成、列举、和删除操作
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";

// 获取当前用户的所有 API Key
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "未授权" }, { status: 401 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (session.user as any).id;
        const apiKeys = await prisma.apiKey.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ keys: apiKeys });
    } catch (error) {
        console.error("获取 API Keys 失败:", error);
        return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
    }
}

// 创建新的 API Key
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "未授权" }, { status: 401 });
        }

        const { name } = await req.json();
        if (!name || name.trim() === "") {
            return NextResponse.json({ error: "API Key 的名称不能为空" }, { status: 400 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (session.user as any).id;

        // 生成以 sk-samrion- 打头的随机密钥
        const rawKey = crypto.randomBytes(24).toString("hex");
        const keyString = `sk-samrion-${rawKey}`;

        const newApiKey = await prisma.apiKey.create({
            data: {
                key: keyString,
                name: name.trim(),
                userId: userId,
            }
        });

        return NextResponse.json({
            message: "API Key 创建成功",
            apiKey: newApiKey
        }, { status: 201 });
    } catch (error) {
        console.error("创建 API Key 失败:", error);
        return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
    }
}

// 删除或废弃 API Key
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "未授权" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const keyId = searchParams.get("id");

        if (!keyId) {
            return NextResponse.json({ error: "必须提供要删除的 API Key ID" }, { status: 400 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (session.user as any).id;

        // 确认该 Key 属于当前用户再进行删除，使用逻辑删除更安全
        const targetKey = await prisma.apiKey.findFirst({
            where: { id: keyId, userId }
        });

        if (!targetKey) {
            return NextResponse.json({ error: "找不到指定的 API Key 或者无权限删除" }, { status: 404 });
        }

        await prisma.apiKey.delete({
            where: { id: keyId }
        });

        return NextResponse.json({ message: "API Key 删除成功" });
    } catch (error) {
        console.error("删除 API Key 失败:", error);
        return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
    }
}
