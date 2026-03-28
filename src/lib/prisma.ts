/**
 * @author Sam, 2433022, Email:Sam52anan@gmail.com
 * 初始化并导出 Prisma 单例客户端，防止在开发环境中热重载导致过多的并发数据库连接
 */

import { PrismaClient } from "@prisma/client";

// 根据运行环境声明全局 prisma 变量类型
declare global {
    var prisma: PrismaClient | undefined;
}

// 实例化选项：在开发环境可开启查询日志
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prismaOptions: any = process.env.NODE_ENV === "development" ? {
    log: ['query', 'info', 'warn', 'error'],
} : {};

// 在全局对象中缓存 Prisma 实例
export const prisma = globalThis.prisma || new PrismaClient(prismaOptions);

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = prisma;
}

export default prisma;
