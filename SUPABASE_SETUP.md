# Supabase PostgreSQL 免费数据库设置指南

## 为什么选择 Supabase？

✅ **500MB 免费存储**（比 Vercel Postgres 的 256MB 更大）
✅ **无需信用卡**
✅ **2 个数据库**
✅ **无限 API 请求**
✅ **自动备份 7 天**
✅ **实时订阅功能**
✅ **内置认证系统**

---

## 🚀 快速开始（5 分钟）

### 1. 创建 Supabase 账号

1. 访问：https://supabase.com
2. 点击 "Start your project"
3. 使用 GitHub 账号登录

### 2. 创建项目

```
1. 点击 "New Project"
2. 填写信息：
   - Name: shop-app-ecommerce
   - Database Password: 生成强密码（保存好！）SpoDa7qk1Y0DIfvU
   - Region: 选择 Northeast Asia (Tokyo) - 最近的服务器
3. 点击 "Create new project"
4. 等待 1-2 分钟初始化
```

### 3. 获取数据库连接字符串

```
1. 项目创建完成后，进入 "Settings" → "Database"
2. 找到 "Connection string" 部分
3. 选择 "URI" 标签
4. 复制连接字符串，类似：
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
```

### 4. 配置本地环境

**backend/.env**

```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"
```

### 5. 运行数据库迁移

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
```

### 6. 配置 Vercel 环境变量

```
1. 进入 Vercel Dashboard → 你的项目
2. Settings → Environment Variables
3. 添加：
   Name: DATABASE_URL
   Value: postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   Environment: Production, Preview, Development
4. 保存后重新部署
```

---

## ✅ 验证连接

### 测试本地连接

```bash
cd backend
npx prisma studio
# 浏览器会打开 http://localhost:5555
# 可以看到数据库表
```

### 查看 Supabase 控制台

```
1. Supabase Dashboard
2. Table Editor
3. 可以直接查看和编辑数据
```

---

## 📊 免费套餐限制

```
存储空间: 500MB
数据传输: 2GB/月
并发连接: 60个
API请求: 无限
实时连接: 200个
Edge Functions: 500,000次调用/月
认证用户: 50,000 MAU
```

**对比 Vercel Postgres：**

- Supabase: 500MB vs Vercel: 256MB
- Supabase: 免费 vs Vercel: 需信用卡验证
- Supabase: 2GB 传输 vs Vercel: 256MB 传输

---

## 🔒 安全设置

### 1. 启用 Row Level Security (RLS)

```sql
-- 在 Supabase SQL Editor 中执行
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ... 为其他表启用 RLS
```

### 2. 配置访问策略

```sql
-- 示例：用户只能访问自己的数据
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);
```

### 3. 使用环境变量

```bash
# 不要在代码中硬编码数据库密码
# 始终使用环境变量
DATABASE_URL="postgresql://..."
```

---

## 🎯 Prisma 最佳实践

### 连接池配置

```prisma
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Vercel Serverless 优化
  relationMode = "prisma"
}
```

### 环境变量配置

```bash
# backend/.env
DATABASE_URL="postgresql://postgres:password@host:5432/postgres?pgbouncer=true&connection_limit=1"
```

---

## 📈 监控和优化

### 查看性能指标

```
1. Supabase Dashboard → Reports
2. 查看：
   - API 请求数
   - 数据库大小
   - 连接数
   - 慢查询
```

### 优化建议

1. **添加索引**

```sql
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);
```

2. **使用连接池**

```bash
DATABASE_URL="postgresql://...?pgbouncer=true"
```

3. **限制查询结果**

```typescript
// 始终分页查询
const products = await prisma.product.findMany({
  take: 20,
  skip: (page - 1) * 20,
});
```

---

## 🆘 常见问题

### Q: 连接超时？

**A**: 检查：

- IP 白名单（默认允许所有）
- 密码是否正确
- 连接字符串格式

### Q: 迁移失败？

**A**: 使用 `prisma db push` 代替 `prisma migrate`

```bash
npx prisma db push
```

### Q: Vercel 部署后连接不上？

**A**:

1. 确认环境变量已设置
2. 重新部署
3. 检查 Vercel Function 日志

### Q: 超出免费额度？

**A**:

- 监控使用情况
- 考虑升级 Pro 套餐（$25/月）
- 或迁移到其他服务

---

## 🔄 数据迁移（从 SQLite）

如果你有本地 SQLite 数据：

```bash
# 1. 导出数据
npm install -g prisma-fixtures

# 2. 修改 schema.prisma 的 provider
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# 3. 推送 schema
npx prisma db push

# 4. 手动迁移数据或使用 Prisma Studio
```

---

## 📚 参考资源

- Supabase 文档: https://supabase.com/docs
- Prisma + Supabase: https://www.prisma.io/docs/guides/database/supabase
- Vercel + Supabase: https://vercel.com/guides/using-databases-with-vercel

---

## 🎉 完成！

现在你有了：

- ✅ 500MB 免费 PostgreSQL 数据库
- ✅ 自动备份
- ✅ 全球 CDN
- ✅ 实时功能
- ✅ 无需信用卡

继续使用现有的 PostgreSQL schema，无需改动任何代码！
