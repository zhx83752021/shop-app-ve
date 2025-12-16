# 零售电商App - 后端API服务

基于 Node.js + Express + TypeScript + Prisma + PostgreSQL 构建的电商后端服务

## 技术栈

- **运行时**: Node.js 20+
- **框架**: Express 4
- **语言**: TypeScript 5
- **ORM**: Prisma 5
- **数据库**: PostgreSQL 15
- **认证**: JWT
- **验证**: Joi
- **日志**: Winston
- **安全**: Helmet, CORS, Rate Limit

## 项目结构

```
backend/
├── prisma/                 # Prisma配置
│   ├── schema.prisma      # 数据模型
│   ├── migrations/        # 迁移文件
│   └── seed.ts           # 种子数据
├── src/
│   ├── config/           # 配置文件
│   │   ├── index.ts      # 主配置
│   │   └── database.ts   # 数据库配置
│   ├── controllers/      # 控制器
│   │   └── auth.controller.ts
│   ├── services/         # 业务逻辑
│   │   └── auth.service.ts
│   ├── middlewares/      # 中间件
│   │   ├── auth.ts       # 认证中间件
│   │   ├── errorHandler.ts
│   │   └── validator.ts
│   ├── routes/           # 路由
│   │   ├── index.ts
│   │   └── auth.routes.ts
│   ├── validators/       # 验证规则
│   │   └── auth.validator.ts
│   ├── utils/            # 工具函数
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   ├── response.ts
│   │   └── logger.ts
│   └── app.ts            # 应用入口
├── .env.example          # 环境变量示例
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，填入数据库连接等配置
```

### 3. 数据库迁移

```bash
# 生成Prisma Client
npm run prisma:generate

# 运行数据库迁移
npm run prisma:migrate

# 填充种子数据
npm run prisma:seed
```

### 4. 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3000 启动

## 可用脚本

```bash
npm run dev              # 启动开发服务器 (热重载)
npm run build            # 构建生产版本
npm start                # 启动生产服务器
npm run prisma:generate  # 生成Prisma Client
npm run prisma:migrate   # 运行数据库迁移
npm run prisma:studio    # 打开Prisma Studio (数据库GUI)
npm run prisma:seed      # 填充种子数据
npm run lint             # 运行ESLint
npm run format           # 格式化代码
npm test                 # 运行测试
```

## API文档

### 认证接口

#### 用户注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "phone": "13800138000",
  "password": "123456",
  "code": "123456"
}
```

#### 用户登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "phone": "13800138000",
  "password": "123456"
}
```

响应:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "user": {
      "id": "user_123",
      "phone": "138****8000",
      "nickname": "测试用户",
      "avatar": null,
      "memberLevel": "GOLD",
      "points": 1000,
      "balance": "0.00"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### 刷新Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

#### 发送验证码
```http
POST /api/auth/send-code
Content-Type: application/json

{
  "phone": "13800138000",
  "type": "register"
}
```

#### 健康检查
```http
GET /api/health
```

## 数据库设计

### 核心表

- **users** - 用户表
- **addresses** - 收货地址
- **admins** - 管理员
- **categories** - 商品分类
- **products** - 商品
- **skus** - SKU
- **orders** - 订单
- **order_items** - 订单项
- **refunds** - 退款
- **cart_items** - 购物车
- **posts** - 帖子
- **comments** - 评论
- **post_likes** - 点赞
- **coupons** - 优惠券
- **user_coupons** - 用户优惠券
- **banners** - 轮播图
- **favorites** - 收藏
- **browse_history** - 浏览历史

详见 `prisma/schema.prisma`

## 测试账号

**管理员账号**:
- 用户名: `admin`
- 密码: `admin123`

**测试用户**:
- 手机号: `13800138000`
- 密码: `123456`

## 环境变量

```bash
# 应用配置
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# 数据库
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce

# JWT密钥
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=2h
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=30d

# Redis (可选)
REDIS_URL=redis://localhost:6379

# 短信服务 (可选)
SMS_ACCESS_KEY=
SMS_SECRET_KEY=
SMS_SIGN_NAME=
SMS_TEMPLATE_CODE=

# 支付配置 (可选)
WECHAT_APP_ID=
WECHAT_APP_SECRET=
ALIPAY_APP_ID=
ALIPAY_PRIVATE_KEY=

# 监控 (可选)
SENTRY_DSN=
```

## 开发状态

### ✅ 已完成

- [x] 项目基础架构搭建
- [x] 数据库设计 (Prisma Schema)
- [x] 认证系统 (注册/登录/JWT)
- [x] 中间件 (认证/错误处理/验证)
- [x] 工具函数 (JWT/密码/响应/日志)
- [x] 种子数据

### 🔄 进行中

- [ ] 用户模块API
- [ ] 商品模块API
- [ ] 订单模块API
- [ ] 购物车模块API
- [ ] 内容模块API
- [ ] 营销模块API
- [ ] 管理端API

### 📝 待开发

- [ ] 支付集成
- [ ] 短信服务
- [ ] 文件上传
- [ ] 缓存策略
- [ ] 单元测试
- [ ] API文档生成

## 部署

### 本地部署

```bash
npm run build
npm start
```

### Vercel部署

1. 安装Vercel CLI

```bash
npm install -g vercel
```

2. 登录Vercel

```bash
vercel login
```

3. 部署

```bash
vercel --prod
```

### Docker部署

```bash
docker build -t ecommerce-backend .
docker run -p 3000:3000 -d ecommerce-backend
```

## 开发规范

### 代码风格

- 使用 ESLint + Prettier
- 遵循 Airbnb JavaScript Style Guide
- TypeScript 严格模式

### 提交规范

```
feat: 新功能
fix: Bug修复
docs: 文档更新
style: 代码格式
refactor: 重构
perf: 性能优化
test: 测试
chore: 构建/工具
```

### API设计规范

- RESTful风格
- 统一响应格式
- 合理的HTTP状态码
- 清晰的错误提示

## 性能优化

- 数据库查询优化 (索引、分页)
- 缓存策略 (Redis)
- 连接池管理
- 请求频率限制
- Gzip压缩

## 安全措施

- JWT Token认证
- 密码bcrypt加密
- SQL注入防护 (Prisma ORM)
- XSS防护
- CSRF防护
- Helmet安全头
- 请求频率限制

## 监控与日志

- Winston日志记录
- 错误追踪 (Sentry)
- 性能监控
- 健康检查端点

## 故障排查

### 数据库连接失败

检查 `DATABASE_URL` 是否正确配置

### Prisma相关错误

```bash
# 重新生成Prisma Client
npm run prisma:generate

# 重置数据库
npx prisma migrate reset
```

### 端口占用

修改 `.env` 中的 `PORT` 配置

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

- 技术支持: [待定]
- Issue: [GitHub Issues]

---

**当前版本**: v1.0.0
**最后更新**: 2023-12-12
