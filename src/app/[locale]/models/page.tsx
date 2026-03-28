/**
 * @author Sam, 2433022
 * 模型列表展示页
 */
import { useTranslations } from "next-intl";

export default function ModelsPage() {
    const t = useTranslations("Navigation");

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-6">{t("models")}</h1>
            <p className="text-muted-foreground mb-8">
                我们的平台目前支持以下主流大模型，您可以使用统一的 API 格式调用它们。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 这里将来从数据库获取 Model Sku 渲染 */}
                <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition">
                    <h2 className="text-xl font-bold mb-2">GPT-4 Omni</h2>
                    <p className="text-sm text-muted-foreground mb-4">gpt-4o</p>
                    <ul className="space-y-2 text-sm">
                        <li>输入: $5.00 / 1M tokens</li>
                        <li>输出: $15.00 / 1M tokens</li>
                        <li>视觉: 支持</li>
                    </ul>
                </div>
                <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition">
                    <h2 className="text-xl font-bold mb-2">Claude 3.5 Sonnet</h2>
                    <p className="text-sm text-muted-foreground mb-4">claude-3-5-sonnet-20240620</p>
                    <ul className="space-y-2 text-sm">
                        <li>输入: $3.00 / 1M tokens</li>
                        <li>输出: $15.00 / 1M tokens</li>
                        <li>视觉: 支持</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
