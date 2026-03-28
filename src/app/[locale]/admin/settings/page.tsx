/**
 * @author Sam, 2433022, Email:Sam52anan@gmail.com
 * Admin 系统与支付设置页面
 */
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function AdminSettingsPage() {
    // 获取所有设置
    const settings = await prisma.systemSetting.findMany();

    // 转换成字典方便读取
    const configMap: Record<string, string> = {};
    for (const s of settings) {
        configMap[s.key] = s.value;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">系统全局配置</h1>
            <p className="text-muted-foreground text-sm">这些配置保存在数据库层面，修改后即时生效而无需重新构建部署。</p>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="border rounded-md bg-white dark:bg-zinc-950 p-6 space-y-4 shadow-sm">
                    <h2 className="text-xl font-bold border-b pb-2">基础设置</h2>
                    <div className="space-y-2">
                        <Label>站点名称 (Site Name)</Label>
                        <Input defaultValue={configMap["site_name"] || "Samrion.vip"} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label>系统默认汇率 (USD to CNY)</Label>
                        <Input defaultValue={configMap["usd_to_cny_rate"] || "7.25"} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label>注册赠送金额 (USD)</Label>
                        <Input defaultValue={configMap["register_bonus_usd"] || "0.50"} disabled />
                    </div>
                    <Button variant="outline" disabled>保存基础设置 (由于未接入 Form Action 暂不可用)</Button>
                </div>

                <div className="border rounded-md bg-white dark:bg-zinc-950 p-6 space-y-4 shadow-sm">
                    <h2 className="text-xl font-bold border-b pb-2">上游供应商 API Key 托管</h2>
                    <p className="text-xs text-muted-foreground">配置此处的 Key 将用于代理请求拦截。由于安全需要，实际输入框内容将加密存入数据库。</p>
                    <div className="space-y-2">
                        <Label>OpenAI 官方 API Key</Label>
                        <Input type="password" placeholder="sk-..." defaultValue={configMap["upstream_openai_key"] || ""} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label>Anthropic API Key</Label>
                        <Input type="password" placeholder="sk-ant-..." defaultValue={configMap["upstream_anthropic_key"] || ""} disabled />
                    </div>
                    <Button variant="outline" disabled>更新凭据 (待实现 Action)</Button>
                </div>
            </div>
        </div>
    );
}
