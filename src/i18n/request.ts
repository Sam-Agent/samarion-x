/**
 * @author Sam, 2433022, Email:Sam52anan@gmail.com
 * next-intl 请求配置文件，在每次请求时加载当前语言的翻译文件
 */
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    // 这对应于在 `routing.ts` 中定义的 `locales` 选项
    let locale = await requestLocale;

    // 确保使用支持的本地化配置
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        // 根据语言动态加载翻译文件
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});
