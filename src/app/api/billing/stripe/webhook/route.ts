/**
 * @author Sam, 2433022
 * Stripe Webhook 入口 (Boilerplate)
 */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const sig = req.headers.get("stripe-signature");

        if (!sig) {
            return NextResponse.json({ error: "Missing signature" }, { status: 400 });
        }

        // 1. 验证签名 (解除下方注释使用真实 SDK)
        /*
        let event;
        try {
          event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
        } catch (err: any) {
          return NextResponse.json({ error: \`Webhook Error: \${err.message}\` }, { status: 400 });
        }
    
        // 2. 处理支付成功事件
        if (event.type === 'checkout.session.completed') {
          const session = event.data.object as Stripe.Checkout.Session;
          const transactionId = session.client_reference_id; // 创建 session 时透传的我们的本地流水号
    
          if (transactionId) {
            const tx = await prisma.transaction.update({
              where: { id: transactionId },
              data: { status: "SUCCESS", paymentRef: session.payment_intent as string }
            });
    
            // 给用户充值
            await prisma.user.update({
              where: { id: tx.userId },
              data: { balance: { increment: tx.amountUsd } }
            });
          }
        }
        */

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Stripe webhook error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
