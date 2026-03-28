/**
 * @author Sam, 2433022
 * 用量统计与图表分析页
 */
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

// 示例模拟数据，后端完成后通过 /api/usage 获取
const mockData = [
    { name: "03-22", tokens: 12000, cost: 0.15 },
    { name: "03-23", tokens: 35000, cost: 0.45 },
    { name: "03-24", tokens: 28000, cost: 0.35 },
    { name: "03-25", tokens: 55000, cost: 0.75 },
    { name: "03-26", tokens: 19000, cost: 0.25 },
    { name: "03-27", tokens: 82000, cost: 1.15 },
    { name: "03-28", tokens: 41000, cost: 0.55 },
];

export default function UsagePage() {
    const [data] = useState(mockData);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">用量统计</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    查看您最近 7 天内的 API 接口调用 Token 消耗量与估算费用。
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">今日 Token 消耗</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">41,000</div>
                        <p className="text-xs text-muted-foreground mt-1">+12% 同比昨日</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">今日预计扣除</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$0.55</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">总请求次数</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,248</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Token 消耗趋势</CardTitle>
                    <CardDescription>
                        您可以将鼠标悬浮在柱形图上查看详细用量。
                    </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={data}>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip />
                            <Bar dataKey="tokens" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
