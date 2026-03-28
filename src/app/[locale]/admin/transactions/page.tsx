/**
 * @author Sam, 2433022
 * Admin 充值与交易流水页面
 */
import prisma from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminTransactionsPage() {
    const transactions = await prisma.transaction.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: { select: { email: true } } },
        take: 100 // 默认仅展示最近的100条以防数据量过大
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">充值交易流水</h1>

            <div className="border rounded-md bg-white dark:bg-zinc-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>流水号</TableHead>
                            <TableHead>关联用户</TableHead>
                            <TableHead>交易类型</TableHead>
                            <TableHead>涉及金额 (USD)</TableHead>
                            <TableHead>渠道</TableHead>
                            <TableHead>状态</TableHead>
                            <TableHead>时间</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.length === 0 ? (
                            <TableRow><TableCell colSpan={7} className="text-center py-6 text-muted-foreground">暂无流水记录</TableCell></TableRow>
                        ) : (
                            transactions.map(tx => (
                                <TableRow key={tx.id}>
                                    <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                                    <TableCell>{tx.user?.email || "已注销用户"}</TableCell>
                                    <TableCell>{tx.type}</TableCell>
                                    <TableCell className="font-mono">${Number(tx.amountUsd).toFixed(4)}</TableCell>
                                    <TableCell>{tx.paymentMethod || "-"}</TableCell>
                                    <TableCell>
                                        {tx.status === "SUCCESS" ? <span className="text-green-600 font-medium">成功</span> : <span className="text-yellow-500 font-medium">{tx.status}</span>}
                                    </TableCell>
                                    <TableCell className="text-sm">{tx.createdAt.toLocaleString()}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
