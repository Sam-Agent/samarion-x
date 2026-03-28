/**
 * @author Sam, 2433022, Email:Sam52anan@gmail.com
 * API 接入文档页
 */
import { useTranslations } from "next-intl";

export default function DocsPage() {
    const t = useTranslations("Navigation");

    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">{t("docs")}</h1>

            <div className="prose dark:prose-invert max-w-none">
                <p>Samrion.vip 提供与 OpenAI 官方完全兼容的 API 接口格式，实现零成本迁移应用。</p>

                <h3 className="text-xl font-bold mt-8 mb-4">基本配置</h3>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>
                        BASE_URL: https://api.samrion.vip/v1<br />
                        API_KEY: sk-samrion-xxxxxxxxxxxxxxxx
                    </code>
                </div>

                <h3 className="text-xl font-bold mt-8 mb-4">Python 示例</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code className="text-sm">
                        {`from openai import OpenAI

client = OpenAI(
    api_key="你的 API Key",
    base_url="https://api.samrion.vip/v1"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "你好！"}],
)
print(response.choices[0].message.content)`}
                    </code>
                </pre>
            </div>
        </div>
    );
}
