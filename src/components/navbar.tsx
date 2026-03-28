/**
 * @author Sam, 2433022
 * 顶部导航栏组件，包含 Logo、主导航链接、语言切换以及用户头像/登录按钮
 */
"use client";

import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
    const { data: session } = useSession();
    const t = useTranslations("Navigation");
    const router = useRouter();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between px-4 sm:px-8">
                {/* 左侧 Logo 和主导航 */}
                <div className="flex items-center gap-6 md:gap-10">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="inline-block font-bold text-lg text-primary">Samrion.vip</span>
                    </Link>
                    <nav className="hidden md:flex gap-6">
                        <Link
                            href="/models"
                            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {t("models")}
                        </Link>
                        <Link
                            href="/pricing"
                            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {t("pricing")}
                        </Link>
                        <Link
                            href="/docs"
                            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {t("docs")}
                        </Link>
                    </nav>
                </div>

                {/* 右侧 功能区 */}
                <div className="flex items-center gap-2">
                    <LocaleSwitcher />

                    {session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-none relative h-8 w-8 rounded-full border-0 bg-transparent flex items-center justify-center p-0">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {session.user?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push("/dashboard")} className="cursor-pointer w-full">
                                    {t("dashboard")}
                                </DropdownMenuItem>
                                {/* 仅针对 ADMIN 角色显示后台管理入口 */}
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {(session.user as any)?.role === "ADMIN" && (
                                    <DropdownMenuItem onClick={() => router.push("/admin")} className="cursor-pointer w-full text-blue-600">
                                        后台管理 (Admin)
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                >
                                    退出登录
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" className="hidden sm:flex text-sm" onClick={() => router.push("/auth/login")}>
                                {t("login")}
                            </Button>
                            <Button className="text-sm" onClick={() => router.push("/auth/register")}>
                                {t("register")}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
