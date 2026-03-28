/**
 * @author Sam, 2433022, Email:Sam52anan@gmail.com
 * 全局认证状态提供者，用于在整个应用中共享 NextAuth 的 Session 内容
 */
"use client";

import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}
