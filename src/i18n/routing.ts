/**
 * @author Sam, 2433022
 * next-intl 路由配置文件，定义支持的语言及默认语言
 */
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // 支持的语言列表：英文、中文
    locales: ['en', 'zh'],

    // 默认语言为英文
    defaultLocale: 'en'
});

// 对路由封装轻量级的导航 API，比如 Link, redirect, useRouter 等
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
