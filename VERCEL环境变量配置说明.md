# ⚠️ 关键问题：Vercel 环境变量未配置

## 🔴 当前错误原因

从构建日志看到的错误表明：**Vercel 上没有配置数据库连接环境变量**

这导致：

- ✗ Prisma Client 无法连接数据库
- ✗ 所有 API 请求返回 500 错误
- ✗ 页面数据为空

---

## ✅ 解决方案（必须立即执行）

### 步骤 1：配置 Vercel 环境变量

1. **打开 Vercel Dashboard**

   ```
   https://vercel.com/dashboard
   ```

2. **进入项目设置**

   - 点击项目 `shop-app-ve`
   - 点击顶部的 **Settings** 标签
   - 左侧菜单选择 **Environment Variables**

3. **添加数据库连接变量**

   **第一个变量**：

   - **Name**: `DATABASE_URL`
   - **Value**:
     ```
     postgresql://postgres:SpoDa7qk1Y0DIfvU@db.xidbrgszgwrvqrpckjkw.supabase.co:5432/postgres
     ```
   - **Environments**:
     - ☑ Production
     - ☑ Preview
     - ☑ Development
   - 点击 **Save**

   **第二个变量**（可选但推荐）：

   - **Name**: `NODE_ENV`
   - **Value**: `production`
   - **Environments**: ☑ Production
   - 点击 **Save**

4. **触发重新部署**
   - 点击顶部的 **Deployments** 标签
   - 找到最新的部署记录
   - 点击右侧的 **⋯** (三个点)
   - 选择 **Redeploy**
   - 取消勾选 "Use existing Build Cache"（重要！）
   - 点击 **Redeploy** 确认

---

### 步骤 2：在 Supabase 创建数据库表

1. **打开 Supabase SQL Editor**

   ```
   https://supabase.com/dashboard
   ```

   - 选择你的项目
   - 左侧点击 **SQL Editor**
   - 点击 **New query**

2. **执行建表脚本**

   - 打开项目中的 `完整建表脚本.sql` 文件
   - 全选（Ctrl + A）并复制（Ctrl + C）
   - 粘贴到 Supabase SQL 编辑器
   - 点击右下角的 **RUN** 按钮
   - 等待执行完成（约 10-15 秒）

3. **验证结果**
   - 左侧点击 **Table Editor**
   - 应该看到 21 个表
   - 点击 `products` 表，应该有 12 条数据
   - 点击 `banners` 表，应该有 3 条数据

---

### 步骤 3：等待部署完成并测试

1. **监控部署状态**

   - 在 Vercel Dashboard 的 Deployments 页面
   - 等待状态从 "Building" 变为 "Ready"
   - 通常需要 3-5 分钟

2. **测试 API**

   部署完成后，在浏览器中访问：

   ```
   https://shop.hybergy.cn/api
   ```

   应该看到：

   ```json
   {
     "status": "success",
     "message": "API is running",
     "timestamp": "2024-12-16...",
     "database": "Connected"  ← 这里应该是 "Connected"
   }
   ```

3. **测试前端**

   访问：

   ```
   https://shop.hybergy.cn/home
   ```

   按 `Ctrl + Shift + R` 强制刷新

   应该看到：

   - ✅ 3 张轮播图正常显示
   - ✅ 12 个商品正常显示
   - ✅ 所有数据加载成功

---

## 🔍 如何确认环境变量已生效

### 方法 1：查看部署日志

1. Vercel Dashboard → Deployments
2. 点击最新的部署
3. 查看 **Build Logs**
4. 搜索 "Prisma"
5. 应该看到 "✓ Generated Prisma Client" 成功信息

### 方法 2：测试 API 端点

浏览器访问：

```
https://shop.hybergy.cn/api/products?page=1&pageSize=10
```

应该返回商品数据，而不是 500 错误。

---

## ⚠️ 常见问题

### Q1: 环境变量添加后还是报错？

**A**: 必须重新部署才能生效！

- 添加环境变量后
- 点击 Deployments → 最新部署 → ⋯ → Redeploy
- **取消勾选** "Use existing Build Cache"

### Q2: Supabase 执行 SQL 报错？

**A**: 可能是表已存在

- 脚本开头有 `DROP TABLE IF EXISTS`
- 会自动删除旧表重新创建
- 如果还是报错，手动删除所有表后再执行

### Q3: 部署成功但数据还是为空？

**A**: 检查以下几点

1. Supabase 表是否创建成功（Table Editor 中查看）
2. 表中是否有数据（点击表查看行数）
3. Vercel 环境变量 DATABASE_URL 是否正确
4. 浏览器是否清除了缓存

---

## 📞 需要帮助？

如果按照以上步骤操作后仍有问题，请提供：

1. Vercel 环境变量配置截图
2. Vercel 最新部署的构建日志
3. Supabase Table Editor 截图（显示表列表）
4. 浏览器访问 https://shop.hybergy.cn/api 的响应

这样我可以更准确地定位问题。

---

## ✅ 快速检查清单

执行完毕后，确认以下项目：

- [ ] Vercel 中已添加 `DATABASE_URL` 环境变量
- [ ] 已重新部署（不使用缓存）
- [ ] Supabase 中有 21 个表
- [ ] `products` 表有 12 条数据
- [ ] `banners` 表有 3 条数据
- [ ] 访问 /api 返回 `"database": "Connected"`
- [ ] 访问 /home 显示数据

**现在立即执行步骤 1 和步骤 2！**
