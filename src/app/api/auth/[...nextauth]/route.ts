/**
 * @author Sam, 2433022, Email:Sam52anan@gmail.com
 * NextAuth 的 API 路由入口 (App Router 模式)
 */
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// 初始化认证处理程序
const handler = NextAuth(authOptions);

// 导出适用于 GET 和 POST 请求的处理器
export { handler as GET, handler as POST };
