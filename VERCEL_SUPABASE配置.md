# 🚀 Vercel Supabase 集成配置

## ✅ 已完成（Vercel 自动配置）

恭喜！你通过 Vercel Dashboard 创建了 Supabase 数据库，所有生产环境变量已自动配置。

### 你的数据库信息

```
数据库名: ecommerce
服务器: db.evnyggvxpxeiincrnbjb.supabase.co
区域: US East 1 (美国东部)
密码: WY6KMr0YTwkc9ND9
状态: ✅ 运行中
```

### Vercel 集成的优势 🎯

| 功能     | Vercel 集成      | 手动创建    |
| -------- | ---------------- | ----------- |
| 环境变量 | ✅ 自动同步      | ❌ 手动添加 |
| 生产配置 | ✅ 自动完成      | ❌ 需手动   |
| 区域选择 | ✅ 优化延迟      | ⚠️ 需选择   |
| 管理界面 | ✅ 集成在 Vercel | ⚠️ 独立平台 |

---

## 🔧 本地开发配置

### 快速配置（一键完成）⚡

**双击运行**：

```
配置Vercel-Supabase.bat
```

这会自动：

1. ✅ 更新 `backend\.env`
2. ✅ 生成 Prisma 客户端
3. ✅ 推送数据库表结构
4. ✅ 配置 Supabase SDK

---

### 手动配置步骤

#### 1. 更新 backend/.env

```bash
# Vercel Supabase PostgreSQL
DATABASE_URL="postgres://postgres.evnyggvxpxeiincrnbjb:WY6KMr0YTwkc9ND9@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"

# Supabase 配置
SUPABASE_URL="https://evnyggvxpxeiincrnbjb.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2bnlnZ3Z4cHhlaWluY3JuYmpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NTU2OTgsImV4cCI6MjA4MTQzMTY5OH0.umDesRN5pGVC979nW4vJ9SM5aiJQ8c0_HA23rJLlWHM"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2bnlnZ3Z4cHhlaWluY3JuYmpiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTg1NTY5OCwiZXhwIjoyMDgxNDMxNjk4fQ.DwJNKhjyadkKsnvYh489Es0NiPrX3T0L9SJn9Wc5KxY"
```

#### 2. 生成 Prisma 客户端

```bash
cd backend
npx prisma generate
```

#### 3. 推送数据库表结构

```bash
npx prisma db push
```

---

## 📊 连接 URL 说明

Vercel Supabase 提供了 3 种连接方式：

### 1. POSTGRES_PRISMA_URL（推荐用于 Prisma）✅

```
postgres://postgres.evnyggvxpxeiincrnbjb:WY6KMr0YTwkc9ND9@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

- ✅ 使用 PgBouncer 连接池
- ✅ 适合 Serverless
- ✅ 优化的并发连接

### 2. POSTGRES_URL（标准连接池）

```
postgres://postgres.evnyggvxpxeiincrnbjb:WY6KMr0YTwkc9ND9@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
```

- ✅ 连接池
- ⚠️ 不包含 PgBouncer 参数

### 3. POSTGRES_URL_NON_POOLING（直连）

```
postgres://postgres.evnyggvxpxeiincrnbjb:WY6KMr0YTwkc9ND9@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
```

- ⚠️ 无连接池
- ⚠️ 适合迁移等一次性任务

**建议**: 使用 `POSTGRES_PRISMA_URL`，性能最佳！

---

## 🌐 Vercel 环境变量（已自动配置）✅

以下变量已在 Vercel 生产环境自动配置，**无需手动添加**：

```bash
✓ POSTGRES_URL
✓ POSTGRES_PRISMA_URL
✓ POSTGRES_URL_NON_POOLING
✓ POSTGRES_HOST
✓ POSTGRES_DATABASE
✓ POSTGRES_USER
✓ POSTGRES_PASSWORD
✓ SUPABASE_URL
✓ SUPABASE_ANON_KEY
✓ SUPABASE_SERVICE_ROLE_KEY
✓ SUPABASE_JWT_SECRET
```

查看：Vercel Dashboard → 你的项目 → Settings → Environment Variables

---

## 🎯 测试连接

### 1. 查看数据库表（Prisma Studio）

```bash
cd backend
npx prisma studio
```

浏览器访问：http://localhost:5555

### 2. 访问 Supabase Dashboard

**方式一**：通过 Vercel

```
Vercel Dashboard → Storage → ecommerce → Manage
```

**方式二**：直接访问

```
https://evnyggvxpxeiincrnbjb.supabase.co
```

### 3. 测试 API 连接

```bash
cd backend
npm run dev
```

访问：http://localhost:3000/api

---

## 🚀 启动开发

### 完整开发环境

```bash
# 终端 1 - 后端
cd backend
npm run dev
# 运行在 http://localhost:3000

# 终端 2 - 前端
cd frontend
npm run dev
# 运行在 http://localhost:5173

# 终端 3 - 数据库管理（可选）
cd backend
npx prisma studio
# 运行在 http://localhost:5555
```

### 访问地址

- 🎨 前端：http://localhost:5173
- 🔧 后端 API：http://localhost:3000
- 🗄️ 数据库：http://localhost:5555

---

## 📦 部署到 Vercel

### 环境变量已自动配置 ✅

由于使用 Vercel 集成，所有环境变量已自动同步到：

- ✅ Production
- ✅ Preview
- ✅ Development

### 推送代码即可部署

```bash
git add .
git commit -m "配置Vercel Supabase数据库"
git push
```

Vercel 会自动：

1. 检测代码变更
2. 构建应用
3. 连接数据库
4. 部署上线

约 2-3 分钟完成 🎉

---

## 🔒 安全最佳实践

### 密钥说明

| 密钥               | 用途        | 位置           |
| ------------------ | ----------- | -------------- |
| `ANON_KEY`         | ✅ 前端使用 | 客户端安全     |
| `SERVICE_ROLE_KEY` | ⚠️ 后端使用 | **仅服务器端** |
| `JWT_SECRET`       | ⚠️ 签名验证 | **仅服务器端** |

**重要**：

- ✅ `ANON_KEY` 可以暴露在前端
- ❌ `SERVICE_ROLE_KEY` 绝不能暴露
- ❌ `JWT_SECRET` 必须保密

### Row Level Security (RLS)

建议在 Supabase 启用 RLS：

```sql
-- 在 Supabase SQL Editor 执行
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
```

---

## 📊 数据库监控

### Vercel Dashboard

```
Vercel Dashboard → Storage → ecommerce
```

查看：

- 📈 连接数
- 💾 存储使用
- ⚡ 查询性能
- 📊 使用统计

### Supabase Dashboard

```
https://evnyggvxpxeiincrnbjb.supabase.co
```

功能：

- 📝 Table Editor
- 🔍 SQL Editor
- 📊 Database Reports
- 🔒 API Settings

---

## 🆘 常见问题

### Q: 连接超时？

**A**: 数据库在美国东部，从中国访问可能较慢

- 使用 VPN
- 检查网络连接
- 尝试非高峰时段

### Q: SSL 连接失败？

**A**: 确保连接字符串包含 `?sslmode=require`

### Q: Prisma 推送失败？

**A**: 使用带连接池的 URL

```bash
DATABASE_URL="postgres://...?pgbouncer=true&sslmode=require"
```

### Q: 如何重置数据库？

**A**:

```bash
cd backend
npx prisma db push --force-reset
```

---

## 🎉 优势总结

### Vercel + Supabase 集成

1. ✅ **零配置部署** - 环境变量自动同步
2. ✅ **全球 CDN** - Vercel Edge Network
3. ✅ **实时数据库** - Supabase 实时订阅
4. ✅ **免费额度** - 两个平台都有慷慨的免费层
5. ✅ **开发体验** - 一个平台管理所有

### 免费额度

**Vercel (Hobby)**:

- 100GB 带宽/月
- 无限部署
- 自动 HTTPS

**Supabase (Free)**:

- 500MB 数据库
- 2GB 数据传输
- 50,000 MAU

---

## 📚 下一步

1. ✅ 配置本地开发环境
2. ✅ 推送数据库表结构
3. ✅ 测试 API 连接
4. ✅ 启动前后端开发
5. ✅ 推送代码部署

---

**快速开始**: 运行 `配置Vercel-Supabase.bat` 🚀

**生产地址**: https://shop-app-ve.vercel.app

**数据库**: https://evnyggvxpxeiincrnbjb.supabase.co
