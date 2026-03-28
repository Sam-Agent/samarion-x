/**
 * @author Sam, 2433022
 * Next.js 配置文件
 * 包含 next-intl 插件集成
 */
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    // 这里可以添加其他全局 Next.js 配置
};

export default withNextIntl(nextConfig);
