# 电商管理后台

基于 Vue 3 + Element Plus + TypeScript 开发的电商管理后台系统。

## 技术栈

- Vue 3 - 渐进式 JavaScript 框架
- TypeScript - JavaScript 的超集
- Element Plus - 基于 Vue 3 的组件库
- Vue Router - 路由管理
- Axios - HTTP 客户端
- Vite - 下一代前端构建工具

## 功能模块

### 1. 数据概览 (Dashboard)

- 今日订单统计
- 总用户数统计
- 待发货订单统计
- 今日销售额统计
- 最近订单列表
- 待处理事项

### 2. 商品管理 (Products)

- 商品列表展示
- 新增商品
- 编辑商品
- 删除商品
- 上架/下架管理
- 分页查询

### 3. 订单管理 (Orders)

- 订单列表展示
- 订单状态筛选
- 订单发货
- 查看订单详情
- 分页查询

### 4. 用户管理 (Users)

- 用户列表展示
- 用户状态管理
- 启用/禁用用户

### 5. 退款管理 (Refunds)

- 退款申请列表
- 审批通过
- 拒绝退款

### 6. 内容审核 (Posts)

- 待审核内容列表
- 内容审核通过
- 内容审核拒绝

## 开发指南

### 安装依赖

```bash
npm install --legacy-peer-deps
```

### 启动开发服务器

```bash
npm run dev
```

管理后台将运行在 http://localhost:3002

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
admin/
├── src/
│   ├── api/                # API 接口
│   │   ├── http.ts        # HTTP 客户端配置
│   │   └── admin.ts       # 管理后台 API
│   ├── layouts/           # 布局组件
│   │   └── MainLayout.vue # 主布局
│   ├── views/             # 页面组件
│   │   ├── Login.vue      # 登录页
│   │   ├── Dashboard.vue  # 数据概览
│   │   ├── Products.vue   # 商品管理
│   │   ├── Orders.vue     # 订单管理
│   │   ├── Users.vue      # 用户管理
│   │   ├── Refunds.vue    # 退款管理
│   │   └── Posts.vue      # 内容审核
│   ├── router/            # 路由配置
│   │   └── index.ts       # 路由定义
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
├── public/                # 静态资源
├── index.html             # HTML 模板
├── vite.config.ts         # Vite 配置
├── tsconfig.json          # TypeScript 配置
└── package.json           # 项目配置

```

## API 配置

后端 API 地址配置在 `vite.config.ts` 中：

```typescript
server: {
  port: 3002,
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true
    }
  }
}
```

## 测试账号

**管理员账号**:

- 用户名: admin
- 密码: admin123

## 注意事项

1. 确保后端 API 服务运行在 http://localhost:3001
2. 登录后 Token 会自动保存在 localStorage
3. 所有请求会自动添加 Authorization 请求头
4. 401 错误会自动跳转到登录页

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 开发规范

- 使用 TypeScript 类型系统
- 遵循 Vue 3 Composition API 风格
- 使用 Element Plus 组件库
- 统一的错误处理和提示
- 路由守卫保护需要登录的页面

## License

MIT
