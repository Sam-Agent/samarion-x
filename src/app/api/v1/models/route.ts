/**
 * @author Sam, 2433022
 * 兼容 OpenAI /v1/models 的接口
 * 返回平台所有 ACTIVE 状态的模型列表
 */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const activeModels = await prisma.modelSku.findMany({
            where: { status: "ACTIVE" },
            orderBy: { sortOrder: "asc" }
        });

        const openaiFormattedModels = activeModels.map((m: { id: string, createdAt: Date }) => ({
            id: m.id,
            object: "model",
            created: Math.floor(m.createdAt.getTime() / 1000),
            owned_by: "samrion",
            permission: [],
            root: m.id,
            parent: null,
        }));

        return NextResponse.json({
            object: "list",
            data: openaiFormattedModels
        });
    } catch (error) {
        console.error("Failed to fetch models:", error);
        return NextResponse.json({ error: { message: "Internal server error" } }, { status: 500 });
    }
}
