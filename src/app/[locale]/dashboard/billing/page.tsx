/**
 * @author Sam, 2433022
 * 充值与账单界面（支持支付宝与 Stripe/Link 充值接口调试界面）
 */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BillingPage() {
    const [customAmount, setCustomAmount] = useState<string>("10");
    const [loadingMethod, setLoadingMethod] = useState<string | null>(null);

    const handleRecharge = async (method: "stripe" | "alipay") => {
        const amount = parseFloat(customAmount);
        if (isNaN(amount) || amount <= 0) {
            alert("请输入有效的充值金额");
            return;
        }

        setLoadingMethod(method);

        try {
            // 这里我们调用的是专门针对 MVP 本地验证的一个包含实际流水操作逻辑的 "充值直达" API。
            // 真实生产环境需要接入 Stripe Create Checkout Session 或是 Alipay SDK 返回付款重定向链接
            const res = await fetch("/api/billing/mock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, method })
            });
            const data = await res.json();

            if (res.ok && data.ok) {
                alert(`已在开发环境完成 ${method} 渠道的模拟充值：$${amount}\n您的余额已更新！`);
                window.location.reload();
            } else {
                alert(data.error || "充值失败，请稍后再试");
            }
        } catch (error) {
            console.error(error);
            alert("网络错误");
        } finally {
            setLoadingMethod(null);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">充值与账单</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    本平台采用按量计费 (Pay-as-you-go)，保证绝不偷偷扣费。每次请求从您的余额中精准实时扣除。
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>在线充值</CardTitle>
                        <CardDescription>选择您期望充值的金额与支付方式</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                            <Button variant="outline" onClick={() => setCustomAmount("10")}>$10</Button>
                            <Button variant="outline" onClick={() => setCustomAmount("50")}>$50</Button>
                            <Button variant="outline" onClick={() => setCustomAmount("100")}>$100</Button>
                        </div>

                        <div className="space-y-2 pt-4 border-t">
                            <Label htmlFor="custom">自定义充值金额 (USD)</Label>
                            <Input
                                id="custom"
                                type="number"
                                min="1"
                                step="0.01"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleRecharge("alipay")}
                            disabled={loadingMethod !== null}
                        >
                            {loadingMethod === "alipay" ? "跳转中..." : "支付宝充值"}
                        </Button>
                        <Button
                            className="w-full bg-[#635BFF] hover:bg-[#4E44E7]"
                            onClick={() => handleRecharge("stripe")}
                            disabled={loadingMethod !== null}
                        >
                            {loadingMethod === "stripe" ? "跳转中..." : "Stripe / 信用卡"}
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>历史账单记录</CardTitle>
                        <CardDescription>最近的资金流水</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* 后续从数据库读取 Transaction 数据填充此处 */}
                        <div className="text-sm text-center text-muted-foreground py-10">
                            数据列表空，或正等待 API 接入
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
