/**
 * @author Sam, 2433022, Email:Sam52anan@gmail.com
 * 充值与套餐资费说明页
 */
import { useTranslations } from "next-intl";

export default function PricingPage() {
    const t = useTranslations("Navigation");

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-6">{t("pricing")}</h1>
            <p className="text-muted-foreground mb-8">
                按需付费，绝无隐性消费。您的余额永久有效。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 这里将来从数据库 PricingPlan 获取渲染 */}
                <div className="border rounded-lg p-8 shadow-sm text-center">
                    <h2 className="text-2xl font-bold mb-2">基础充值</h2>
                    <p className="text-4xl font-extrabold my-6">$10</p>
                    <p className="text-sm text-muted-foreground mb-6">适合尝鲜体验，支持主流模型调用。</p>
                    <button className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium">进入控制台充值</button>
                </div>

                <div className="border-2 border-primary rounded-lg p-8 shadow-md relative text-center">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 text-xs rounded-full font-bold">
                        最受欢迎
                    </div>
                    <h2 className="text-2xl font-bold mb-2">进阶充值</h2>
                    <p className="text-4xl font-extrabold my-6">$50</p>
                    <p className="text-sm text-green-600 font-medium mb-6">赠送 $2 额度</p>
                    <button className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium">进入控制台充值</button>
                </div>
            </div>
        </div>
    );
}
