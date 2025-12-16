# Vercel 环境变量完整配置

## ✅ 必须添加的环境变量

在 Vercel Dashboard → Settings → Environment Variables 中添加以下变量：

### 1. DATABASE_URL（必需）

```
Name: DATABASE_URL
Value: postgresql://postgres:SpoDa7qk1Y0DIfvU@db.xidbrgszgwrvqrpckjkw.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
Environments: ✓ Production ✓ Preview ✓ Development
```

**注意**：URL 中添加了 `?pgbouncer=true&connection_limit=1` 参数，这对 Serverless 环境很重要。

### 2. DIRECT_URL（可选但推荐）

```
Name: DIRECT_URL
Value: postgresql://postgres:SpoDa7qk1Y0DIfvU@db.xidbrgszgwrvqrpckjkw.supabase.co:5432/postgres
Environments: ✓ Production ✓ Preview ✓ Development
```

### 3. JWT_SECRET（推荐）

```
Name: JWT_SECRET
Value: your-super-secret-jwt-key-change-this-in-production-12345678
Environments: ✓ Production ✓ Preview ✓ Development
```

### 4. NODE_ENV（可选）

```
Name: NODE_ENV
Value: production
Environments: ✓ Production only
```

---

## 📋 配置步骤

### 步骤 1：添加环境变量

1. 访问：https://vercel.com/dashboard
2. 点击项目 `shop-app-ve`
3. 点击顶部 **Settings** 标签
4. 左侧选择 **Environment Variables**
5. 对每个变量：
   - 点击 **Add New**
   - 填写 Name 和 Value
   - 勾选对应的 Environments
   - 点击 **Save**

### 步骤 2：重新部署

**重要**：添加环境变量后必须重新部署！

1. 点击顶部 **Deployments** 标签
2. 找到最新的部署
3. 点击右侧的 **⋯** (三个点)
4. 选择 **Redeploy**
5. **取消勾选** "Use existing Build Cache" ← 重要！
6. 点击 **Redeploy** 确认

---

## 🗄️ Supabase 数据库配置

### 确认数据库表已创建

1. 访问：https://supabase.com/dashboard
2. 选择你的项目
3. 左侧点击 **Table Editor**
4. 检查是否有以下 21 个表：
   - admins
   - addresses
   - banners ← 重要
   - cart_items
   - categories ← 重要
   - comments
   - coupons
   - favorites
   - flash_sales
   - orders
   - order_items
   - posts
   - products ← 重要
   - rankings
   - reviews
   - skus
   - system_configs
   - user_coupons
   - user_posts
   - users
   - video_records

### 如果表不存在，执行建表脚本

1. 左侧点击 **SQL Editor**
2. 点击 **New query**
3. 打开项目中的 `完整建表脚本.sql`
4. 全选（Ctrl+A）并复制（Ctrl+C）
5. 粘贴到 Supabase SQL Editor
6. 点击右下角绿色的 **RUN** 按钮
7. 等待执行完成（约 10-15 秒）
8. 回到 **Table Editor** 验证表已创建

---

## ✅ 验证配置是否成功

### 测试 1：API 健康检查

```
https://shop.hybergy.cn/api
```

**期望响应**：

```json
{
  "status": "success",
  "message": "API is running",
  "timestamp": "2025-12-16...",
  "database": "Connected"
}
```

### 测试 2：获取 Banner 数据

```
https://shop.hybergy.cn/api/banners
```

**期望响应**：

```json
{
  "code": 200,
  "data": [
    {
      "id": "...",
      "title": "春季新品大促",
      "image": "https://picsum.photos/800/400?random=1",
      "link": "/products",
      "sort": 1
    },
    ...
  ],
  "message": "获取成功"
}
```

### 测试 3：获取商品列表

```
https://shop.hybergy.cn/api/products?page=1&pageSize=10
```

**期望响应**：

```json
{
  "code": 200,
  "data": {
    "items": [...],
    "total": 12,
    "page": 1,
    "pageSize": 10
  }
}
```

### 测试 4：访问前端

```
https://shop.hybergy.cn/home
```

**期望结果**：

- ✅ 看到 3 张轮播图
- ✅ 看到 12 个商品
- ✅ 数据正常加载

---

## 🔧 常见问题

### Q1: 添加环境变量后还是报错？

**A**: 必须重新部署！添加环境变量后不会自动生效。

### Q2: 重新部署还是报错？

**A**: 确保取消勾选了 "Use existing Build Cache"，让 Vercel 完全重新构建。

### Q3: API 显示 "Connected" 但其他接口还是 500 错误？

**A**: 检查 Supabase 中的表是否已创建。使用 Table Editor 查看表列表。

### Q4: Supabase 执行 SQL 报错？

**A**: 脚本会自动删除旧表，如果还是报错，手动删除所有表后重新执行。

---

## 📞 需要帮助？

如果完成以上步骤后还有问题，提供以下信息：

1. Vercel 环境变量配置截图
2. Vercel 最新部署的构建日志（Build Logs）
3. Supabase Table Editor 截图（显示表列表）
4. 浏览器访问 /api 的响应
5. 浏览器 F12 控制台的错误信息
