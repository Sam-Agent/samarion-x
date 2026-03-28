/**
 * @author Sam, 2433022
 * Alipay 异步通知 Webhook 入口 (Boilerplate)
 */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// import AlipaySdk from "alipay-sdk";

export async function POST(req: Request) {
    try {
        // const formData = await req.formData();
        // const params = Object.fromEntries(formData.entries());

        // 1. 实例化 SDK 并验签
        /*
        const alipaySdk = new AlipaySdk({ ... });
        const isValid = alipaySdk.checkNotifySign(params);
        if (!isValid) {
            return new NextResponse("failure", { status: 400 });
        }
    
        // 2. 检查交易状态
        const tradeStatus = params.trade_status;
        if (tradeStatus === 'TRADE_SUCCESS' || tradeStatus === 'TRADE_FINISHED') {
            const outTradeNo = params.out_trade_no as string; // 我们的本地流水号
            const tradeNo = params.trade_no as string; // 支付宝流水号
    
            const tx = await prisma.transaction.update({
                where: { id: outTradeNo },
                data: { status: "SUCCESS", paymentRef: tradeNo }
            });
    
            await prisma.user.update({
                where: { id: tx.userId },
                data: { balance: { increment: tx.amountUsd } }
            });
        }
        */

        // 支付宝要求必须返回 success 的纯文本
        return new NextResponse("success", { status: 200, headers: { "Content-Type": "text/plain" } });
    } catch (error) {
        console.error("Alipay webhook error:", error);
        return new NextResponse("failure", { status: 500 });
    }
}
