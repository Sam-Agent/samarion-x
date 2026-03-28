/**
 * @author Sam, 2433022
 * 用户登录页面组件
 */
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

export default function LoginPage() {
    const t = useTranslations("Navigation");
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // 处理登录表单提交
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // 调用 NextAuth 的 signIn 方法（credentials 策略）
            const result = await signIn("credentials", {
                redirect: false, // 禁用自动跳转以便处理错误
                email,
                password,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                // 登录成功，跳转回控制台
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err) {
            setError("网络错误，请稍后重试");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">欢迎回来</CardTitle>
                    <CardDescription>
                        请输入您的邮箱和密码登录
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">邮箱地址</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2 flex flex-col">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password">密码</Label>
                                <Link href="#" className="text-xs text-muted-foreground hover:underline">
                                    忘记密码?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="******"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md border border-red-200">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "登录中..." : t('login')}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center text-sm text-muted-foreground">
                    <p>
                        还没有账号？{" "}
                        <Link href="/auth/register" className="text-primary hover:underline font-medium">
                            免费{t('register')}
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
