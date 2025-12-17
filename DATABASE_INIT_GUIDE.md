# 数据库初始化指南

## 问题说明
Vercel 部署后，数据库已连接但没有初始数据，导致页面显示"加载中..."。

## 解决方案

### 1. 配置环境变量
在 Vercel 项目的 **Settings** → **Environment Variables** 中添加：

```bash
SEED_SECRET_KEY=your-super-secret-key-here
```

**重要**：请将 `your-super-secret-key-here` 替换为一个强密码（建议至少32位随机字符串）。

### 2. 重新部署
添加环境变量后，需要重新部署项目：
- 在 Vercel 项目的 **Deployments** 页面
- 点击最新部署右侧的三个点
- 选择 **Redeploy**

### 3. 初始化数据库

#### 方法一：使用 API 端点（推荐）

1. **检查数据库状态**
```bash
curl https://shop.hybergy.cn/api/seed/status
```

响应示例：
```json
{
  "success": true,
  "data": {
    "products": 0,
    "categories": 0,
    "banners": 0,
    "coupons": 0,
    "users": 0,
    "isEmpty": true
  }
}
```

2. **执行数据初始化**
```bash
curl -X POST https://shop.hybergy.cn/api/seed/initialize \
  -H "Content-Type: application/json" \
  -d '{"secretKey": "your-super-secret-key-here"}'
```

**注意**：将 `your-super-secret-key-here` 替换为你在环境变量中设置的实际密钥。

成功响应：
```json
{
  "success": true,
  "message": "数据库初始化成功",
  "info": {
    "admin": { "username": "admin", "password": "admin123" },
    "user": { "phone": "13800138000", "password": "123456" }
  }
}
```

#### 方法二：使用浏览器（更简单）

1. **检查状态**
直接访问：`https://shop.hybergy.cn/api/seed/status`

2. **初始化数据**
使用 Postman、Insomnia 或任何 API 测试工具：
- URL: `https://shop.hybergy.cn/api/seed/initialize`
- Method: `POST`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "secretKey": "your-super-secret-key-here"
}
```

### 4. 验证结果

初始化完成后，刷新网站 `https://shop.hybergy.cn/home`，应该可以看到：
- ✅ 商品列表显示
- ✅ 分类显示
- ✅ Banner轮播图显示
- ✅ 推荐商品显示

### 5. 测试账号

数据库初始化后，自动创建以下测试账号：

**管理员账号**
- 用户名：`admin`
- 密码：`admin123`

**普通用户账号**
- 手机号：`13800138000`
- 密码：`123456`

## 初始化的数据内容

种子数据包括：
- ✅ 5个商品分类（时尚服饰、运动户外、美妆护肤、数码家电、食品生鲜）
- ✅ 5个示例商品（每个分类至少1个）
- ✅ 3个Banner轮播图
- ✅ 2张优惠券
- ✅ 2篇社区帖子
- ✅ 完整的商品排行榜数据（热销榜、好评榜、新品榜、收藏榜）
- ✅ 1个管理员账号
- ✅ 1个测试用户账号

## 安全说明

⚠️ **重要提示**：
1. `SEED_SECRET_KEY` 必须保密，不要泄露给他人
2. 初始化 API 只应在首次部署后使用一次
3. 生产环境建议在初始化后删除或禁用该端点
4. 测试账号的密码应该在生产环境中修改

## 故障排查

### 问题1：403 错误 - 无效的密钥
**原因**：`secretKey` 与环境变量 `SEED_SECRET_KEY` 不匹配
**解决**：
1. 检查 Vercel 环境变量是否正确设置
2. 确认请求中的 `secretKey` 与环境变量一致
3. 重新部署项目以应用新的环境变量

### 问题2：500 错误 - 数据库初始化失败
**可能原因**：
- 数据库连接问题
- 数据库权限不足
- `DATABASE_URL` 配置错误

**解决**：
1. 检查 `DATABASE_URL` 环境变量是否正确
2. 确认数据库服务正常运行
3. 查看 Vercel 的部署日志获取详细错误信息

### 问题3：重复初始化
**说明**：初始化脚本使用了 `upsert` 策略，可以安全地多次执行
- 已存在的数据不会重复创建
- 管理员和测试用户会更新而不是重复创建
- 商品、分类等数据只在不存在时才创建

## 后续操作

初始化完成后，你可以：
1. 通过管理后台添加更多商品和内容
2. 修改测试账号的密码
3. 自定义Banner和推荐内容
4. 根据实际需求调整商品分类

## 技术细节

- 种子数据脚本位置：`backend/src/utils/seedDatabase.ts`
- API 端点实现：`backend/src/routes/seed.routes.ts`
- 数据模型定义：`backend/prisma/schema.prisma`
