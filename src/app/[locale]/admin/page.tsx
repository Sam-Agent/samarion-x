/**
 * @author Sam, 2433022, Email:Sam52anan@gmail.com
 * Admin 管理后台概览
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";

export default async function AdminOverview() {
    // 统计全局数据
    const totalUsers = await prisma.user.count();
    const totalModels = await prisma.modelSku.count();

    // 统计总充值金额 (由于暂时没有真实数据，使用 reduce 模拟或者通过聚合查询)
    const txAgg = await prisma.transaction.aggregate({
        _sum: { amountUsd: true },
        where: { type: "RECHARGE", status: "SUCCESS" }
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">管理后台大盘</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">总注册用户</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">平台总收款 (USD)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${txAgg._sum.amountUsd?.toFixed(2) || "0.00"}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">上架模型数</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalModels}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
