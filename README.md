# 零售电商应用 (Shop App)

一个功能完善的移动端优先的零售电商应用，包含前端和后端完整实现。

## 技术栈

### 前端

- Vue 3 + TypeScript
- Element Plus UI
- Vue Router
- Axios
- Vite
- TailwindCSS

### 后端

- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite / PostgreSQL
- JWT 认证

## 主要功能

### 用户端

- ✅ 用户注册、登录、个人中心
- ✅ 实名认证功能
- ✅ 商品浏览、搜索、详情
- ✅ 购物车管理
- ✅ 订单管理
- ✅ 地址管理（三级联动）
- ✅ 优惠券中心
- ✅ 榜单推荐
- ✅ 品牌闪购
- ✅ 社区发现、评论互动
- ✅ 直播好物
- ✅ 会员专属
- ✅ 收藏功能

### 系统功能

- ✅ 图片懒加载
- ✅ 虚拟滚动
- ✅ 响应式设计
- ✅ 移动端适配
- ✅ 性能监控

## 项目结构

````
shop-app/
├── frontend/          # 前端Vue3项目
│   ├── src/
│   │   ├── api/       # API接口
│   │   ├── components/# 公共组件
│   │   ├── views/     # 页面组件
│   │   ├── router/    # 路由配置
│   │   ├── data/      # 数据文件
│   │   └── utils/     # 工具函数
│   └── package.json
├── backend/           # 后端Node.js项目
│   ├── src/
│   │   ├── routes/    # 路由
│   │   ├── controllers/# 控制器
│   │   ├── services/  # 业务逻辑
│   │   ├── middleware/# 中间件
│   │   └── utils/     # 工具函数
│   ├── prisma/        # 数据库模型
│   └── package.json
├── admin/             # 管理脚本
└── docs/              # 文档

## 本地开发

### 前端启动

\```bash
cd frontend
npm install
npm run dev
\```

访问: http://localhost:5173

### 后端启动

\```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
\```

API地址: http://localhost:3000

## Vercel部署

### 前端部署

1. 登录 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入 GitHub 仓库: `zhx83752021/shop-app-ve`
4. 配置项目:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 点击 "Deploy"

### 环境变量配置

在 Vercel 项目设置中添加环境变量：

\```
VITE_API_BASE_URL=https://your-backend-api.vercel.app
\```

### 后端部署（可选）

如需部署后端到Vercel：

1. 创建新的Vercel项目
2. Root Directory: `backend`
3. 添加环境变量（参考 `.env.example`）

**注意**: Vercel适合部署无状态的Serverless API。如需完整后端功能，建议使用其他服务如Railway、Render等。

## 快速部署按钮

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zhx83752021/shop-app-ve)

## 数据库配置

### 开发环境（SQLite）
已配置使用SQLite，无需额外设置。

### 生产环境（PostgreSQL）
1. 在Vercel中添加PostgreSQL数据库
2. 配置 `DATABASE_URL` 环境变量
3. 运行迁移：`npx prisma migrate deploy`

## 测试

### E2E测试

\```bash
cd frontend
npm run test:e2e
\```

### API测试

\```bash
cd backend
npm test
\```

## 许可证

MIT License

## 作者

zhx83752021

## 更新日志

### v1.0.0 (2024-12-16)
- ✨ 初始版本发布
- 🎨 完整的电商功能实现
- 📱 移动端优先设计
- 🔐 实名认证功能
- 📍 地址管理三级联动
- 💬 社区互动功能
````
