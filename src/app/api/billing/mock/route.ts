/**
 * @author Sam, 2433022, Email:Sam52anan@gmail.com
 * 仅作 MVP 开发与验证使用的模拟充值接口
 * 它会直接创建流水并给用户增加余额
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { amount, method } = await req.json();
        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 执行模拟充值事务
        await prisma.$transaction([
            prisma.transaction.create({
                data: {
                    userId: user.id,
                    type: "RECHARGE",
                    amountUsd: amount,
                    paymentMethod: method,
                    status: "SUCCESS",
                    remark: "【开发模式】模拟网页充值测试"
                }
            }),
            prisma.user.update({
                where: { id: user.id },
                data: { balance: { increment: amount } }
            })
        ]);

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Mock topup error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
