/**
 * @author Sam, 2433022
 * 控制台概览页面，展示用户的余额、API Key 统计和汇总信息
 */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardOverview() {
    const session = await getServerSession(authOptions);

    // 查询用户余额等信息
    const user = await prisma.user.findUnique({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        where: { id: (session?.user as any)?.id },
        select: { balance: true }
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">概览界面</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* 余额统计卡片 */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">当前余额 (USD)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${user?.balance?.toFixed(4) || "0.0000"}</div>
                        <p className="text-xs text-muted-foreground mt-1">永久有效</p>
                    </CardContent>
                </Card>

                {/* 活跃 API Key 统计（占位） */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">活跃 API Keys</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground mt-1">管理你的密钥</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
