/**
 * @author Sam, 2433022, Email:Sam52anan@gmail.com
 * Admin 管理后台布局组件
 */
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Link } from "@/i18n/routing";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    // 仅限 ADMIN 角色访问，否则重定向到普通控制台
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || (session.user as any)?.role !== "ADMIN") {
        redirect("/dashboard");
    }

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)] bg-zinc-50 dark:bg-zinc-950">
            {/* 后台侧边栏 */}
            <aside className="w-64 border-r bg-white dark:bg-zinc-900 hidden md:block">
                <div className="p-6">
                    <h2 className="text-lg font-bold tracking-tight text-blue-600 dark:text-blue-500">
                        Samrion Admin
                    </h2>
                    <p className="text-xs text-muted-foreground">超级管理员中枢</p>
                </div>
                <nav className="flex flex-col gap-1 px-4">
                    <Link href="/admin" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        数据大盘
                    </Link>
                    <Link href="/admin/users" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-muted-foreground">
                        用户管理
                    </Link>
                    <Link href="/admin/models" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-muted-foreground">
                        模型配置 (SKU)
                    </Link>
                    <Link href="/admin/transactions" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-muted-foreground">
                        充值流水
                    </Link>
                    <Link href="/admin/settings" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-muted-foreground">
                        系统与支付设置
                    </Link>
                </nav>
            </aside>

            {/* 后台主内容区 */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                <div className="mx-auto max-w-6xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
