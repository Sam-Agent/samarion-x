/**
 * @author Sam, 2433022, Email:Sam52anan@gmail.com
 * 平台首页（营销落地页）
 */
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function HomePage() {
    // 加载首页的翻译
    const t = useTranslations('Index');

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
            <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-primary mb-6">
                {t('title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-[600px]">
                {t('subtitle')}
            </p>

            <div className="flex gap-4">
                <Link
                    href="/auth/register"
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                    {t('getStarted')}
                </Link>
                <Link
                    href="/docs"
                    className="px-8 py-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md font-medium transition-colors"
                >
                    {t('docs')}
                </Link>
            </div>
        </div>
    );
}
