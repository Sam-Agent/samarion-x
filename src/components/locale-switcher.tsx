/**
 * @author Sam, 2433022
 * 语言切换组件，允许用户在中英双语间无缝切换
 */
"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export function LocaleSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLocale = () => {
        const nextLocale = locale === "en" ? "zh" : "en";

        // 使用 next-intl 提供的 router 自动处理语言前缀
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <Button variant="ghost" size="sm" onClick={toggleLocale}>
            {locale === "en" ? "中" : "EN"}
        </Button>
    );
}
