/**
 * @author Sam, 2433022
 * 多语言根布局组件，包装整个应用以提供国际化支持
 */
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { AuthProvider } from '@/components/auth-provider';
import { Navbar } from '@/components/navbar';
import '../globals.css'; // 引入全局样式，包含 Tailwind

// 定义布局组件的属性类型
interface RootLayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
    children,
    params
}: RootLayoutProps) {
    const { locale } = await params;
    // 校验请求的语言是否在支持列表内
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // 向客户端提供所有的翻译消息
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <head>
                <title>Samrion.vip</title>
            </head>
            <body className="antialiased min-h-screen bg-background text-foreground flex flex-col">
                <AuthProvider>
                    <NextIntlClientProvider messages={messages}>
                        <Navbar />
                        <main className="flex-1">
                            {children}
                        </main>
                        {/* 这里可以放置全局 Footer */}
                    </NextIntlClientProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
