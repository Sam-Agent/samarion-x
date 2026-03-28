/**
 * @author Sam, 2433022
 * 用户控制台：API Key 管理页面
 */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Plus, Trash2, Copy } from "lucide-react";

interface ApiKey {
    id: string;
    name: string;
    key: string;
    createdAt: string;
    lastUsed: string | null;
    isActive: boolean;
}

export default function ApiKeysPage() {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 创建新建 Key 的弹窗控制与输入状态
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    // 获取 API Keys 列表
    const fetchKeys = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/keys");
            const data = await res.json();
            if (res.ok) {
                setKeys(data.keys || []);
            }
        } catch (error) {
            console.error("加载 API Key 失败:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchKeys();
    }, []);

    // 复制 Key 到剪贴板
    const handleCopy = (keyText: string) => {
        navigator.clipboard.writeText(keyText);
        alert("API Key 已复制到剪贴板");
    };

    // 创建 API Key
    const handleCreate = async () => {
        if (!newKeyName.trim()) return;
        setIsCreating(true);
        try {
            const res = await fetch("/api/keys", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newKeyName })
            });
            if (res.ok) {
                setIsDialogOpen(false);
                setNewKeyName("");
                fetchKeys();
            } else {
                const errorData = await res.json();
                alert(`创建失败: ${errorData.error}`);
            }
        } catch (error) {
            console.error("创建失败:", error);
        } finally {
            setIsCreating(false);
        }
    };

    // 删除 API Key
    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`确认要删除 API Key "${name}" 吗？此操作不可恢复。`)) return;
        try {
            const res = await fetch(`/api/keys?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchKeys();
            } else {
                alert("删除失败请稍后再试");
            }
        } catch (error) {
            console.error("删除失败:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        在这里创建和管理用于调用大模型的 API 密钥。不要将 Key 提交到公开的代码仓库。
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2">
                        <Plus className="h-4 w-4" />新建 API Key
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>新建 API Key</DialogTitle>
                            <DialogDescription>
                                为您的新密钥起一个便于记忆的名字。
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Input
                                value={newKeyName}
                                onChange={(e) => setNewKeyName(e.target.value)}
                                placeholder="例如：开发测试环境 Key"
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>取消</Button>
                            <Button onClick={handleCreate} disabled={isCreating || !newKeyName.trim()}>
                                {isCreating ? "创建中..." : "确认创建"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>名称</TableHead>
                            <TableHead>Secret Key</TableHead>
                            <TableHead>创建时间</TableHead>
                            <TableHead>最后调用时间</TableHead>
                            <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">加载中...</TableCell>
                            </TableRow>
                        ) : keys.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                    尚未创建 API Key，点击右上角按钮新建一个。
                                </TableCell>
                            </TableRow>
                        ) : (
                            keys.map((akey) => (
                                <TableRow key={akey.id}>
                                    <TableCell className="font-medium">{akey.name}</TableCell>
                                    <TableCell className="font-mono text-sm max-w-[200px] truncate">
                                        {/* 仅显示前后几位以提高安全性，提供复制按钮以获取全量 */}
                                        {akey.key.substring(0, 15)}...{akey.key.substring(akey.key.length - 4)}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 ml-2"
                                            onClick={() => handleCopy(akey.key)}
                                            title="复制完整的 Key"
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </TableCell>
                                    <TableCell>{new Date(akey.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {akey.lastUsed ? new Date(akey.lastUsed).toLocaleString() : "从未使用"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(akey.id, akey.name)}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            title="删除此 Key"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
