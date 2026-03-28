/**
 * @author Sam, 2433022
 * 根目录 middleware 配置：拦截请求以提供正确的多语言路由
 */
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    // 只匹配非 API、非静态资源和非内部 _.next 路径
    matcher: ['/', '/(zh|en)/:path*']
};
