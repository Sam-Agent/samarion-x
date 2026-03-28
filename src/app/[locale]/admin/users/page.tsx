/**
 * @author Sam, 2433022, Email:Sam52anan@gmail.com
 * Admin 用户管理页面
 */
import prisma from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, email: true, name: true, role: true, balance: true, createdAt: true, _count: { select: { apiKeys: true, transactions: true } } }
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">用户管理</h1>

            <div className="border rounded-md bg-white dark:bg-zinc-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>用户 ID / 邮箱</TableHead>
                            <TableHead>角色</TableHead>
                            <TableHead>账户余额 (USD)</TableHead>
                            <TableHead>API Keys</TableHead>
                            <TableHead>注册时间</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">暂无用户</TableCell></TableRow>
                        ) : (
                            users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="font-medium">{user.email}</div>
                                        <div className="text-xs text-muted-foreground">{user.id}</div>
                                    </TableCell>
                                    <TableCell>{user.role === "ADMIN" ? "管理员" : "普通用户"}</TableCell>
                                    <TableCell className="font-mono">${Number(user.balance).toFixed(4)}</TableCell>
                                    <TableCell>{user._count.apiKeys}</TableCell>
                                    <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
