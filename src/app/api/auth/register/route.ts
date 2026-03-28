/**
 * @author Sam, 2433022
 * 用户注册 API 路由
 */
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "邮箱和密码是必填项" }, { status: 400 });
        }

        // 检查邮箱是否已存在
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "该邮箱已被注册" }, { status: 409 });
        }

        // 对密码进行哈希处理
        const passwordHash = await bcrypt.hash(password, 12);

        // 新用户默认赠送金额（由于这里没查 SystemSetting 的 register_bonus_usd，直接硬编码默认 0.5 作为演示，实际应读库）
        const initialBalance = 0.5;

        // 创建用户并同时记录系统赠送充值流水
        /*
         * 这里使用事务原子操作，确保用户信息和资金流水同时创建成功
         */
        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email,
                    passwordHash,
                    name: name || email.split("@")[0],
                    balance: initialBalance,
                }
            });

            await tx.transaction.create({
                data: {
                    userId: newUser.id,
                    type: "RECHARGE",
                    amountUsd: initialBalance,
                    paymentMethod: "system",
                    remark: "注册赠送",
                    status: "SUCCESS"
                }
            });

            return newUser;
        });

        return NextResponse.json({
            message: "注册成功",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                balance: user.balance
            }
        }, { status: 201 });

    } catch (error) {
        console.error("注册操作失败:", error);
        return NextResponse.json({ error: "服务器内部错误，注册失败" }, { status: 500 });
    }
}
