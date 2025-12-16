# 自动化测试说明

## 测试框架

使用 Playwright 进行端到端(E2E)自动化测试。

## 测试文件

- `e2e/user-flow.spec.ts` - 完整的用户流程测试

## 快速开始

### 1. 确保服务运行

**后端服务** (端口 3001):

```bash
cd e:\app3\backend
npm run dev
```

**数据库** (端口 5432):
确保 PostgreSQL 正在运行

### 2. 安装依赖

```bash
cd e:\app3\frontend
npm install
```

### 3. 安装 Playwright 浏览器

```bash
npx playwright install chromium
```

### 4. 运行测试

**命令行模式**:

```bash
npm run test:e2e
```

**UI 模式** (推荐，可以看到测试过程):

```bash
npm run test:e2e:ui
```

**查看报告**:

```bash
npm run test:e2e:report
```

## 一键运行

直接双击运行 `e:\app3\运行测试.bat` 即可自动完成所有步骤！

## 测试内容

### 1. 用户注册

- 手机号验证
- 验证码发送
- 密码设置
- 注册成功

### 2. 用户登录

- 登录验证
- Token 存储

### 3. 首页测试

- Banner 展示
- 金刚区功能
- 商品列表
- 商品跳转

### 4. 商品详情

- 详情展示
- 加入购物车
- 商品收藏

### 5. 发现页

- 帖子列表
- 点赞功能

### 6. 购物车

- 商品列表
- 数量调整

### 7. 个人中心

- 用户信息
- 订单列表

### 8. 功能页面

- 秒杀页
- 优惠券
- 排行榜

### 9. API 测试

- 接口健康检查

### 10. 性能测试

- 页面加载时间

## 测试结果

测试结果保存在：

- `test-results/html/` - HTML 报告
- `test-results/results.json` - JSON 数据
- 失败截图和录像也会保存在此目录

## 调试技巧

### 1. 运行单个测试

```bash
npx playwright test --grep "用户登录"
```

### 2. 调试模式

```bash
npx playwright test --debug
```

### 3. 查看追踪

```bash
npx playwright show-trace test-results/.../trace.zip
```

## 常见问题

### Q: 测试失败怎么办？

A:

1. 检查后端和数据库是否运行
2. 查看失败截图了解具体错误
3. 查看测试日志

### Q: 如何修改测试用例？

A: 编辑 `tests/e2e/user-flow.spec.ts` 文件

### Q: 如何添加新的测试？

A: 在 `test.describe` 块中添加新的 `test()` 函数

## 配置

测试配置在 `playwright.config.ts` 文件中：

- 超时时间
- 重试次数
- 报告格式
- 浏览器类型
