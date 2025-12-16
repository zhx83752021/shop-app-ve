# Vercel 部署说明

## 🔧 构建配置

### 当前构建流程

```bash
npm run vercel-build
  ↓
1. cd backend && npm install           # 安装后端依赖
2. npx prisma generate                 # 生成 Prisma 客户端
3. cd ../frontend && npm install       # 安装前端依赖
4. npm run build                       # 构建前端 (Vite)
```

### 关键配置文件

#### vercel.json

```json
{
  "buildCommand": "npm run vercel-build",
  "outputDirectory": "frontend/dist",
  "framework": "vite"
}
```

#### package.json (根目录)

```json
{
  "scripts": {
    "vercel-build": "cd backend && npm install && npx prisma generate && cd ../frontend && npm install && npm run build"
  }
}
```

---

## ✅ Vercel 环境变量（已自动配置）

通过 Vercel Supabase 集成，以下变量已自动添加：

```bash
✓ POSTGRES_URL                  # 标准连接池
✓ POSTGRES_PRISMA_URL           # Prisma 优化连接池
✓ POSTGRES_URL_NON_POOLING      # 无连接池直连
✓ SUPABASE_URL                  # Supabase API URL
✓ SUPABASE_ANON_KEY             # 客户端密钥
✓ SUPABASE_SERVICE_ROLE_KEY     # 服务端密钥
✓ SUPABASE_JWT_SECRET           # JWT 签名密钥
```

**重要**: Prisma 会自动使用 `POSTGRES_PRISMA_URL` 或 `DATABASE_URL`

---

## 🚀 部署流程

### 自动部署

```bash
git add .
git commit -m "提交信息"
git push
```

Vercel 检测到推送后会：

1. ✅ 克隆代码
2. ✅ 安装依赖
3. ✅ 运行 `npm run vercel-build`
4. ✅ 生成 Prisma 客户端
5. ✅ 构建前端
6. ✅ 部署到生产环境

预计时间：2-3 分钟

---

## 📊 数据库迁移

### Vercel 部署时的数据库处理

**选项 1: 使用 Prisma DB Push（当前方案）**

```bash
# 本地运行一次即可
cd backend
npx prisma db push
```

- ✅ 简单直接
- ✅ 适合开发阶段
- ⚠️ 不保留迁移历史

**选项 2: 使用 Prisma Migrate（生产推荐）**

```bash
# 创建迁移
cd backend
npx prisma migrate dev --name init

# Vercel 自动运行
npx prisma migrate deploy
```

- ✅ 保留迁移历史
- ✅ 可回滚
- ⚠️ 需要迁移文件

### 当前建议

**开发阶段**: 使用 `prisma db push`

- 快速迭代
- 无需管理迁移文件

**生产部署**: 确保本地已运行过 `prisma db push`

- Vercel 部署时只需 `prisma generate`
- 数据库表结构已就绪

---

## 🔍 故障排查

### 构建失败：`vue-tsc: command not found`

**原因**: frontend 依赖未正确安装

**解决**:

```json
// 确保 vercel.json 使用正确的构建命令
{
  "buildCommand": "npm run vercel-build"
}
```

### 构建失败：`Prisma Client not found`

**原因**: Prisma 客户端未生成

**解决**:

```bash
# 确保构建脚本包含
npx prisma generate
```

### 运行时错误：`Cannot connect to database`

**原因**: 环境变量未配置

**解决**:

1. 检查 Vercel Dashboard → Settings → Environment Variables
2. 确认 `POSTGRES_PRISMA_URL` 或 `DATABASE_URL` 已设置
3. 重新部署

---

## 📈 性能优化

### 1. 使用连接池

```bash
# Vercel 自动配置的 POSTGRES_PRISMA_URL 已包含
?pgbouncer=true&connection_limit=1
```

### 2. Prisma 优化

```prisma
// backend/prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  previewFeatures = ["jsonProtocol"]  // 启用 JSON 协议
}
```

### 3. 构建缓存

Vercel 自动缓存：

- ✅ node_modules
- ✅ .next/cache (如使用 Next.js)
- ✅ 构建产物

---

## 🌐 环境变量管理

### 本地开发

```bash
# backend/.env
DATABASE_URL="postgres://postgres.evnyggvxpxeiincrnbjb:WY6KMr0YTwkc9ND9@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
```

### Vercel 生产环境

```bash
# 已通过 Supabase 集成自动配置
POSTGRES_PRISMA_URL="postgres://..."
```

### 添加自定义环境变量

```bash
# Vercel Dashboard
Settings → Environment Variables → Add

例如：
Name: JWT_SECRET
Value: your-production-secret-key
Environments: Production, Preview
```

---

## 📝 部署检查清单

### 部署前

- [ ] 本地测试通过
- [ ] 数据库表结构已推送 (`prisma db push`)
- [ ] 环境变量已配置
- [ ] `.gitignore` 包含敏感文件
- [ ] `package.json` 版本已更新

### 部署时

- [ ] 检查 Vercel 构建日志
- [ ] 确认构建成功
- [ ] 验证部署预览

### 部署后

- [ ] 测试生产环境
- [ ] 检查 API 连接
- [ ] 验证数据库连接
- [ ] 查看错误日志

---

## 🆘 常见问题

### Q: 构建超时？

**A**:

- 检查依赖大小
- 考虑升级 Vercel 套餐
- 优化构建脚本

### Q: 数据库连接失败？

**A**:

- 确认环境变量正确
- 检查 Supabase 项目状态
- 验证 SSL 连接配置

### Q: API 路由 404？

**A**:

- 检查 `vercel.json` 的 rewrites 配置
- 确认 `api/` 目录存在
- 验证函数部署成功

---

## 📚 相关文档

- [Vercel 文档](https://vercel.com/docs)
- [Prisma 文档](https://www.prisma.io/docs)
- [Supabase 文档](https://supabase.com/docs)

---

## 🎯 当前配置总结

```
项目: shop-app-ve
Git: github.com/zhx83752021/shop-app-ve
部署: https://shop-app-ve.vercel.app

数据库: Vercel Supabase
服务器: db.evnyggvxpxeiincrnbjb.supabase.co
区域: US East 1

构建命令: npm run vercel-build
输出目录: frontend/dist
框架: Vite
```

---

**下次推送代码后，Vercel 会自动构建和部署！** 🚀
