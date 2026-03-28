/**
 * @author Sam, 2433022
 * NextAuth.js 全局配置文件，定义 JWT 策略与 Credentials 提供商
 */
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
    // 使用 JWT 进行会话管理
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30天
    },
    // 提供商列表
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "邮箱", type: "email", placeholder: "your@email.com" },
                password: { label: "密码", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("请输入邮箱和密码");
                }
                // 在数据库中查找用户
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user) {
                    throw new Error("用户不存在");
                }

                // 验证密码哈希
                const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!isPasswordValid) {
                    throw new Error("密码错误");
                }

                // 返回不包含密码的用户对象
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role, // 自定义字段需要类型扩展
                };
            }
        })
    ],
    callbacks: {
        // 丰富 JWT 的附加字段
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                token.role = (user as any).role;
            }
            return token;
        },
        // 将 JWT 的附加字段透传至 Session
        async session({ session, token }) {
            if (token && session.user) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).id = token.id;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).role = token.role;
            }
            return session;
        }
    },
    pages: {
        signIn: "/auth/login",
        // 注册等自定义页面可通过前端路由处理
    },
    secret: process.env.NEXTAUTH_SECRET,
};
