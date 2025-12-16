# 🚀 Supabase PostgreSQL 快速开始

## 方式一：自动配置（推荐）⚡

### 1. 获取连接字符串

访问 Supabase Dashboard：

1. 打开 https://supabase.com/dashboard
2. 选择项目 `shop-app-ecommerce`
3. 左侧菜单：**Settings** → **Database**
4. 找到 **Connection string** → 选择 **URI** 标签
5. 点击复制按钮

连接字符串格式类似：

```
postgresql://postgres.xxxxxxxxxxxxx:SpoDa7qk1Y0DIfvU@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
```

### 2. 运行自动配置脚本

双击运行：

```
setup-supabase.bat
```

脚本会自动：

- ✅ 创建 `backend/.env` 配置文件
- ✅ 安装依赖
- ✅ 生成 Prisma 客户端
- ✅ 推送数据库表结构
- ✅ 显示 Vercel 配置说明

### 3. 测试本地连接

```bash
cd backend
npm run dev
```

后端启动在 `http://localhost:3000`

### 4. 查看数据库

```bash
cd backend
npx prisma studio
```

浏览器打开 `http://localhost:5555` 可视化管理数据库

---

## 方式二：手动配置 📝

### 1. 创建配置文件

复制 `backend/.env.supabase.template` 为 `backend/.env`

### 2. 编辑 `.env` 文件

```bash
# 替换为你的Supabase连接字符串
DATABASE_URL=postgresql://postgres.xxxxx:SpoDa7qk1Y0DIfvU@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
```

### 3. 安装依赖

```bash
cd backend
npm install
```

### 4. 生成 Prisma 客户端

```bash
npx prisma generate
```

### 5. 推送数据库 Schema

```bash
npx prisma db push
```

### 6. 启动开发服务器

```bash
npm run dev
```

---

## 🌐 配置 Vercel 部署

### 添加环境变量

1. 访问 https://vercel.com/dashboard
2. 选择项目 `shop-app-ve`
3. **Settings** → **Environment Variables**
4. 点击 **Add New**

添加以下变量：

| Name                   | Value                    | Environments                     |
| ---------------------- | ------------------------ | -------------------------------- |
| `DATABASE_URL`         | 你的 Supabase 连接字符串 | Production, Preview, Development |
| `JWT_SECRET`           | 随机生成的密钥           | Production                       |
| `REFRESH_TOKEN_SECRET` | 随机生成的密钥           | Production                       |

### 重新部署

```bash
git add .
git commit -m "配置Supabase数据库"
git push
```

Vercel 会自动检测并重新部署 ✅

---

## ✅ 验证配置

### 1. 本地测试 API

```bash
# 测试健康检查
curl http://localhost:3000/api

# 测试注册
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","password":"123456","code":"1234"}'
```

### 2. 查看 Supabase 数据

1. Supabase Dashboard → **Table Editor**
2. 应该能看到以下表：
   - users
   - products
   - orders
   - addresses
   - 等等...

### 3. Prisma Studio

```bash
cd backend
npx prisma studio
```

浏览器打开可以直接查看和编辑数据

---

## 🎯 下一步

### 开发建议

1. **数据初始化**

   ```bash
   cd backend
   npm run prisma:seed
   ```

2. **启动前后端**

   ```bash
   # 终端1 - 后端
   cd backend
   npm run dev

   # 终端2 - 前端
   cd frontend
   npm run dev
   ```

3. **访问应用**
   - 前端: http://localhost:5173
   - 后端: http://localhost:3000
   - 数据库: http://localhost:5555 (Prisma Studio)

### 生产部署

1. 确认 Vercel 环境变量已配置
2. 推送代码到 GitHub
3. Vercel 自动部署
4. 访问 https://shop-app-ve.vercel.app

---

## 🆘 常见问题

### Q: 连接超时？

**A**: 检查：

- Supabase 项目是否正常运行
- 连接字符串是否正确（注意密码）
- 网络是否正常

### Q: Prisma 生成失败？

**A**:

```bash
cd backend
npm install @prisma/client prisma --save
npx prisma generate
```

### Q: 数据库推送失败？

**A**: 使用详细模式查看错误

```bash
npx prisma db push --skip-generate
```

### Q: Vercel 部署后连接不上数据库？

**A**:

1. 确认环境变量 `DATABASE_URL` 已正确配置
2. 重新部署项目
3. 查看 Vercel Functions 日志

---

## 📚 参考文档

- Supabase 文档: https://supabase.com/docs
- Prisma 文档: https://www.prisma.io/docs
- 详细设置: `SUPABASE_SETUP.md`

---

## 🎉 完成！

现在你有了：

- ✅ Supabase PostgreSQL 数据库（500MB 免费）
- ✅ 本地开发环境
- ✅ Vercel 生产部署
- ✅ 数据库管理界面

开始开发你的电商应用吧！🚀
