/**
 * @author Sam, 2433022, Email:Sam52anan@gmail.com
 * 用户控制台布局组件，包含左侧边栏和主内容区
 */
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Link } from "@/i18n/routing";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 服务端获取会话，如果未登录则强制跳转登录页
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin"); // 跳转至默认登录，然后会被重定向到自定登录
    }

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)]">
            {/* 左侧边栏导航 */}
            <aside className="w-64 border-r bg-muted/30 hidden md:block">
                <nav className="flex flex-col gap-2 p-4">
                    <Link href="/dashboard" className="px-3 py-2 rounded-md hover:bg-muted font-medium transition-colors">
                        概览 (Overview)
                    </Link>
                    <Link href="/dashboard/keys" className="px-3 py-2 rounded-md hover:bg-muted font-medium transition-colors text-muted-foreground">
                        API Keys
                    </Link>
                    <Link href="/dashboard/usage" className="px-3 py-2 rounded-md hover:bg-muted font-medium transition-colors text-muted-foreground">
                        用量统计 (Usage)
                    </Link>
                    <Link href="/dashboard/billing" className="px-3 py-2 rounded-md hover:bg-muted font-medium transition-colors text-muted-foreground">
                        充值与账单 (Billing)
                    </Link>
                </nav>
            </aside>

            {/* 右侧主内容区 */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
