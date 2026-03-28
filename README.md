# Samrion.vip

> **AI 模型中转代理聚合平台 (AI Model Relay Station)**  
> 🌍 *Bilingual Support / 中英双语支持*
>
> 👤 **Author:** @Sam  
> 📧 **Email:** Sam52anan@gmail.com

---

## 项目简介 (Introduction)

Samrion.vip 是一个功能全面、专为开发者和企业提供的 **AI 大模型 API 中转聚合平台**。本系统允许运营人员在后台动态配置多家上游大模型供应商（如 OpenAI, Anthropic, DeepSeek, Google 等），同时为 C 端终端客户提供**单一、兼容 OpenAI `/v1` 接口标准的统一下发网关**。

系统内置了企业级特性，旨在实现从客户获取、鉴权、分发调用到支付扣费的**全生命周期闭环**。

### 核心特性 (Key Features)

- **多供应商兼容 & 安全路由**：后台加密托管官方上游 API Keys，实现客户端调用和真实付款流解耦，客户端永远只用管理一套 `sk-samrion-xxx` 凭证。
- **100% OpenAI 接口标准兼容**：无缝对接任何依赖 OpenAI API `v1/chat/completions` 及 `v1/models` 标准生态的下游客户端应用（如 NextChat, LobeChat, Dify 等）。
- **极精确的 Token 级动态计费中间件**：支持流式传输过程中的异步精准记账，针对不同的 Model SKU 和提供商自定义 `Input/Output` 收费倒挂率。
- **用户自给自足控制台 (Dashboard)**：支持用户在线查看统计走势瀑布流。
- **双通道聚合支付预埋**：默认集成 Stripe (信用卡生态) 与 Alipay (国内支付宝企业环境) Webhook。
- **动态管理系统 (Admin Panel)**：全平台关键设置通过 Prisma KV Schema 实现动态读取（如汇率、站点标识、限速、免费额度等），**修改即生效，零硬编码**。

---

## 技术架构体系 (Tech Stack)

| 核心层                     | 技术组件                                  |
| -------------------------- | ----------------------------------------- |
| **基础框架 (Framework)**   | Next.js 14 (App Router) + TypeScript      |
| **UI \& 响应式 (Styling)** | Tailwind CSS + Shadcn/UI (Radix Primitives) |
| **对象关系映射 (ORM)**     | Prisma v5                                 |
| **多语言本地化 (i18n)**    | next-intl                                 |
| **图表可视化 (Charts)**    | Recharts                                  |
| **安全与会话 (Auth)**      | NextAuth.js (JWT + bcrypt 强校验)           |

---

## 部署执行 (Quick Start)

本地开发环境启动指南：

\`\`\`bash
# 1. 安装项目依赖
npm install

# 2. 覆盖同步 Prisma 数据库引擎表结构
npx prisma db push

# 3. 启动开发版守护网关
npm run dev
# [服务默认监听在: http://localhost:3333]
\`\`\`

---

*Copyright &copy; 2026, Designed & Built by [Sam](mailto:Sam52anan@gmail.com)*
