# 🚀 Vercel 快速部署指南

## 项目地址

**部署地址**: https://shop-app-ve.vercel.app
**GitHub**: https://github.com/zhx83752021/shop-app-ve

---

## ✅ 已完成配置

### 1. 前后端同项目部署

- ✅ 前端静态文件部署
- ✅ 后端 API Serverless Functions
- ✅ 自动路由配置（前端用 `/`，API 用 `/api`）

### 2. 核心文件

```
shop-app-ve/
├── api/
│   ├── index.ts          # Serverless API 入口
│   └── tsconfig.json     # API TypeScript 配置
├── frontend/             # 前端项目
│   ├── .env.production   # API地址: /api（相对路径）
│   └── ...
├── backend/              # 后端代码（供参考）
├── vercel.json          # Vercel 配置
└── package.json         # 根目录依赖
```

### 3. API 路由示例

已配置的基础 API：

- `GET /api` - 健康检查
- `POST /api/auth/login` - 登录
- `POST /api/auth/register` - 注册
- `GET /api/products` - 商品列表

---

## 🎯 立即部署步骤

### 方式一：通过 Vercel Dashboard

1. **登录 Vercel**

   - 访问: https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**

   ```
   New Project → Import Git Repository
   → 选择: zhx83752021/shop-app-ve
   → Import
   ```

3. **配置设置**（保持默认即可）

   ```
   Framework: Vite
   Root Directory: (留空)
   Build Command: npm run vercel-build
   Output Directory: frontend/dist
   Install Command: npm install
   ```

4. **环境变量**（可选）

   ```bash
   # 基础配置已包含，无需额外设置
   # 如需数据库，添加：
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret-key
   ```

5. **点击 Deploy** 🎉

---

## 🔄 自动部署

### 推送代码自动部署

```bash
git add .
git commit -m "更新内容"
git push origin main
```

推送后 Vercel 会自动：

1. 检测到代码变更
2. 触发新的构建
3. 自动部署到生产环境
4. 约 2-3 分钟完成

---

## 📋 项目功能

### 前端功能

- ✅ 用户认证（登录/注册）
- ✅ 商品浏览
- ✅ 购物车
- ✅ 订单管理
- ✅ 个人中心
- ✅ 地址管理（三级联动）
- ✅ 实名认证
- ✅ 社区发现
- ✅ 响应式设计

### API 功能

- ✅ RESTful API
- ✅ JWT 认证
- ✅ 错误处理
- ✅ CORS 配置
- ✅ 请求日志

---

## 🔧 本地开发

### 前端开发

```bash
cd frontend
npm install
npm run dev
# 访问: http://localhost:5173
```

### 测试 API（使用示例数据）

```bash
# 登录
curl -X POST http://localhost:5173/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","password":"123456"}'

# 获取商品
curl http://localhost:5173/api/products
```

---

## 📊 部署后验证

### 1. 访问前端

```
https://shop-app-ve.vercel.app
```

### 2. 测试 API

```bash
# 健康检查
curl https://shop-app-ve.vercel.app/api

# 登录测试
curl -X POST https://shop-app-ve.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","password":"123456"}'
```

### 3. 查看日志

- Vercel Dashboard → 你的项目
- Functions → Logs
- 查看 API 请求日志

---

## ⚠️ 注意事项

### 1. 当前 API 状态

- ✅ 使用示例数据（Mock Data）
- ✅ 可正常登录、注册（返回示例 token）
- ⚠️ 无真实数据库连接
- ⚠️ 数据不会持久化

### 2. 添加数据库支持

如需真实数据库，可选：

**Vercel Postgres（推荐）**

```bash
1. Vercel Dashboard → Storage → Create Database
2. 选择 Postgres
3. 自动配置 DATABASE_URL
4. 取消注释 api/index.ts 中的路由导入
```

**Supabase（免费）**

```bash
1. 访问 supabase.com
2. 创建项目
3. 获取 DATABASE_URL
4. 在 Vercel 中配置环境变量
```

### 3. 完整后端集成

如需使用完整后端功能：

```typescript
// api/index.ts 中取消注释：
import routes from "../backend/src/routes";
app.use("/api", routes);
```

---

## 🎨 自定义域名

### 添加域名

1. Vercel Dashboard → Settings → Domains
2. 添加你的域名
3. 按提示配置 DNS:
   ```
   类型: CNAME
   名称: www (或其他子域名)
   值: cname.vercel-dns.com
   ```

---

## 💡 常见问题

### Q: API 请求失败？

**A**: 检查浏览器控制台，确认：

- 请求地址是 `/api/xxx`
- 无 CORS 错误
- 查看 Vercel Functions 日志

### Q: 构建失败？

**A**: 检查：

- Node 版本（需要 ≥20.x）
- `package.json` 中的依赖
- 构建日志中的错误信息

### Q: 更新没有生效？

**A**:

- 清除浏览器缓存（Ctrl+Shift+R）
- 确认 Git 推送成功
- 查看 Vercel Deployments 确认部署状态

---

## 📞 支持

- 📖 详细文档: `VERCEL_DEPLOYMENT.md`
- 🐛 问题反馈: https://github.com/zhx83752021/shop-app-ve/issues
- 💬 项目维护: zhx83752021

---

## 🎉 部署成功！

现在你可以访问:
**https://shop-app-ve.vercel.app**

开始使用你的电商应用吧！
