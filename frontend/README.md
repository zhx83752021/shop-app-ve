# 零售电商 App - Vue 3 + TypeScript

基于 Figma 原型图一比一复刻的电商 App 前端项目。

## 技术栈

- Vue 3 (Composition API)
- TypeScript
- Vite
- TailwindCSS
- Vue Router
- Pinia
- Lucide Vue Next (图标库)

## 功能页面

- 首页：搜索、轮播横幅、金刚区、直播热卖、限时秒杀、商品推荐
- 发现：内容流、图片/视频帖子、互动功能
- 购物车：商品管理、优惠券、结算
- 个人中心：用户信息、订单追踪、会员积分、资产管理

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

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
frontend/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 公共组件
│   ├── views/          # 页面组件
│   ├── router/         # 路由配置
│   ├── stores/         # 状态管理
│   ├── types/          # TypeScript 类型定义
│   ├── utils/          # 工具函数
│   ├── App.vue         # 根组件
│   ├── main.ts         # 入口文件
│   └── style.css       # 全局样式
├── public/             # 公共资源
├── index.html          # HTML 模板
├── package.json        # 项目配置
├── vite.config.ts      # Vite 配置
├── tsconfig.json       # TypeScript 配置
└── tailwind.config.js  # TailwindCSS 配置
```
