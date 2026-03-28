# Samrion.vip

> AI 模型 API 中转聚合平台 · Bilingual AI Model Relay Platform

**Samrion.vip** 是一个面向开发者与企业的 AI 大模型 API 中转聚合平台，支持中英双语，兼容 OpenAI SDK。

## 功能特性 / Features

- 🚀 **统一 API** — 一个 Key，访问 OpenAI / Anthropic / Google / DeepSeek 等数十个模型
- 💳 **在线充值** — Stripe/Link（信用卡）+ 支付宝
- 📊 **用量统计** — 实时 Token 用量与费用看板
- 🔧 **后台管理** — 模型 SKU 上下架、供应商渠道配置、调度策略、用户管理
- 🌐 **中英双语** — 全站中/英文自由切换
- ⚡ **智能调度** — 多渠道轮询、加权、故障转移、最低延迟策略

## 快速接入 / Quick Start

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-samrion-your-key",
    base_url="https://api.samrion.vip/v1"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

```bash
# cURL
curl https://api.samrion.vip/v1/chat/completions \
  -H "Authorization: Bearer sk-samrion-your-key" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4o","messages":[{"role":"user","content":"Hello"}]}'
```

## 技术栈 / Tech Stack

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 样式 | Tailwind CSS + shadcn/ui |
| 数据库 | PostgreSQL + Prisma ORM |
| 认证 | NextAuth.js (JWT) |
| 支付 | Stripe + 支付宝 |
| 国际化 | next-intl |
| 部署 | Vercel / 自托管 |

## 项目结构 / Project Structure

```
├── app/
│   ├── [locale]/          # 前台（多语言）
│   │   ├── page.tsx       # 首页
│   │   ├── models/        # 模型列表
│   │   ├── pricing/       # 价格
│   │   ├── docs/          # API 文档
│   │   ├── auth/          # 注册/登录
│   │   └── dashboard/     # 用户控制台
│   ├── admin/             # 后台管理
│   │   ├── models/        # SKU 管理
│   │   ├── providers/     # 供应商管理
│   │   ├── routing/       # 调度策略
│   │   ├── users/         # 用户管理
│   │   └── settings/      # 系统设置
│   └── api/
│       ├── v1/            # OpenAI 兼容 API
│       │   ├── models/
│       │   └── chat/completions/
│       └── billing/       # Stripe / 支付宝 Webhook
├── prisma/schema.prisma   # 数据库 Schema
├── lib/
│   ├── billing.ts         # 计费逻辑
│   ├── router.ts          # 调度引擎
│   └── proxy.ts           # 上游代理
└── messages/
    ├── en.json            # 英文语言包
    └── zh.json            # 中文语言包
```

## 本地开发 / Local Development

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env.local

# 3. 初始化数据库
npx prisma migrate dev

# 4. 启动开发服务器
npm run dev
# 访问 http://localhost:3000
```

## 环境变量 / Environment Variables

复制 `.env.example` 并填写以下配置：

```env
# 数据库
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# 加密密钥（用于 Channel API Key 加密）
ENCRYPTION_KEY="32-byte-hex-key"

# Stripe（在后台 UI 配置，此处为备用）
# STRIPE_SECRET_KEY=
# STRIPE_WEBHOOK_SECRET=
```

> ⚠️ 上游供应商 API Keys 和 Stripe/支付宝密钥均在 `/admin/settings` 后台 UI 中配置，不需要写入 `.env`。

## 文档 / Documentation

- 📋 [PRD 产品需求文档](./docs/PRD_Samrion_vip.md)
- 🔌 [API 文档](https://samrion.vip/docs)

## License

MIT
