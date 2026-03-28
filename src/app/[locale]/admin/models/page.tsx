/**
 * @author Sam, 2433022, Email:Sam52anan@gmail.com
 * Admin 模型 SKU 管理页面
 */
import prisma from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminModelsPage() {
    const models = await prisma.modelSku.findMany({
        orderBy: { sortOrder: "asc" }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">模型配置 (SKU)</h1>
                <Button className="flex items-center gap-2"><Plus className="w-4 h-4" /> 添加模型</Button>
            </div>

            <div className="border rounded-md bg-white dark:bg-zinc-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>模型 ID</TableHead>
                            <TableHead>显示名称 (中文)</TableHead>
                            <TableHead>供应商</TableHead>
                            <TableHead>输入价 / 输出价 (/1M)</TableHead>
                            <TableHead>状态</TableHead>
                            <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {models.length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-6 text-muted-foreground">尚未配置任何模型，请添加您的第一个商品 SKU。</TableCell></TableRow>
                        ) : (
                            models.map(model => (
                                <TableRow key={model.id}>
                                    <TableCell className="font-mono">{model.id}</TableCell>
                                    <TableCell className="font-medium">{model.displayNameZh}</TableCell>
                                    <TableCell>{model.providerType}</TableCell>
                                    <TableCell>${Number(model.inputPricePerM).toFixed(2)} / ${Number(model.outputPricePerM).toFixed(2)}</TableCell>
                                    <TableCell>
                                        {model.status === "ACTIVE" ? <span className="text-green-600">上架中</span> : <span className="text-red-500">{model.status}</span>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm">编辑</Button>
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
