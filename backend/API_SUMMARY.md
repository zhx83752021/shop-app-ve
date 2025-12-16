# API接口总览

**服务器地址**: http://localhost:3001
**API前缀**: /api

## 📋 已实现接口列表

### 1️⃣ 认证模块 (Auth)

| 方法 | 路径                | 说明       | 认证 |
| ---- | ------------------- | ---------- | ---- |
| POST | /api/auth/register  | 用户注册   | ❌   |
| POST | /api/auth/login     | 用户登录   | ❌   |
| POST | /api/auth/refresh   | 刷新Token  | ❌   |
| POST | /api/auth/send-code | 发送验证码 | ❌   |

### 2️⃣ 用户模块 (User)

| 方法   | 路径                           | 说明         | 认证 |
| ------ | ------------------------------ | ------------ | ---- |
| GET    | /api/user/profile              | 获取用户信息 | ✅   |
| PUT    | /api/user/profile              | 更新用户信息 | ✅   |
| PUT    | /api/user/password             | 修改密码     | ✅   |
| GET    | /api/user/addresses            | 获取地址列表 | ✅   |
| POST   | /api/user/addresses            | 添加地址     | ✅   |
| PUT    | /api/user/addresses/:id        | 更新地址     | ✅   |
| DELETE | /api/user/addresses/:id        | 删除地址     | ✅   |
| GET    | /api/user/favorites            | 获取收藏列表 | ✅   |
| POST   | /api/user/favorites            | 添加收藏     | ✅   |
| DELETE | /api/user/favorites/:productId | 取消收藏     | ✅   |
| GET    | /api/user/browse-history       | 获取浏览历史 | ✅   |
| DELETE | /api/user/browse-history       | 清空浏览历史 | ✅   |

### 3️⃣ 商品模块 (Products)

| 方法 | 路径                         | 说明         | 认证 |
| ---- | ---------------------------- | ------------ | ---- |
| GET  | /api/products                | 获取商品列表 | ❌   |
| GET  | /api/products/:id            | 获取商品详情 | ❌   |
| GET  | /api/products/recommend      | 获取推荐商品 | ❌   |
| GET  | /api/products/search/suggest | 搜索建议     | ❌   |
| GET  | /api/categories              | 获取分类列表 | ❌   |

### 4️⃣ 购物车模块 (Cart)

| 方法   | 路径                 | 说明             | 认证 |
| ------ | -------------------- | ---------------- | ---- |
| GET    | /api/cart            | 获取购物车       | ✅   |
| POST   | /api/cart            | 添加商品到购物车 | ✅   |
| PUT    | /api/cart/:id        | 更新商品数量     | ✅   |
| DELETE | /api/cart/:id        | 删除商品         | ✅   |
| PUT    | /api/cart/select-all | 全选/取消全选    | ✅   |
| DELETE | /api/cart            | 清空购物车       | ✅   |

### 5️⃣ 订单模块 (Orders)

| 方法 | 路径                    | 说明         | 认证 |
| ---- | ----------------------- | ------------ | ---- |
| POST | /api/orders             | 创建订单     | ✅   |
| GET  | /api/orders             | 获取订单列表 | ✅   |
| GET  | /api/orders/:id         | 获取订单详情 | ✅   |
| POST | /api/orders/:id/pay     | 支付订单     | ✅   |
| POST | /api/orders/:id/cancel  | 取消订单     | ✅   |
| POST | /api/orders/:id/confirm | 确认收货     | ✅   |
| POST | /api/orders/:id/refund  | 申请退款     | ✅   |

### 6️⃣ 管理后台 (Admin)

| 方法   | 路径                           | 说明          | 认证 |
| ------ | ------------------------------ | ------------- | ---- |
| POST   | /api/admin/login               | 管理员登录    | ❌   |
| GET    | /api/admin/dashboard           | Dashboard统计 | ✅   |
| GET    | /api/admin/products            | 商品列表      | ✅   |
| POST   | /api/admin/products            | 创建商品      | ✅   |
| PUT    | /api/admin/products/:id        | 更新商品      | ✅   |
| DELETE | /api/admin/products/:id        | 删除商品      | ✅   |
| GET    | /api/admin/orders              | 订单列表      | ✅   |
| POST   | /api/admin/orders/:id/ship     | 订单发货      | ✅   |
| GET    | /api/admin/refunds             | 退款列表      | ✅   |
| POST   | /api/admin/refunds/:id/process | 处理退款      | ✅   |
| GET    | /api/admin/users               | 用户列表      | ✅   |
| PUT    | /api/admin/users/:id/status    | 更新用户状态  | ✅   |
| GET    | /api/admin/posts               | 内容列表      | ✅   |
| PUT    | /api/admin/posts/:id/review    | 审核内容      | ✅   |

### 7️⃣ 内容模块 (Posts)

| 方法   | 路径                    | 说明          | 认证 |
| ------ | ----------------------- | ------------- | ---- |
| GET    | /api/posts              | 获取帖子列表  | ❌   |
| GET    | /api/posts/my           | 我的帖子列表  | ✅   |
| POST   | /api/posts              | 发布帖子      | ✅   |
| GET    | /api/posts/:id          | 获取帖子详情  | ❌   |
| POST   | /api/posts/:id/like     | 点赞/取消点赞 | ✅   |
| GET    | /api/posts/:id/comments | 获取评论列表  | ❌   |
| POST   | /api/posts/:id/comments | 发表评论      | ✅   |
| DELETE | /api/posts/comments/:id | 删除评论      | ✅   |

### 8️⃣ 营销模块 (Coupons & Banners)

| 方法 | 路径                   | 说明           | 认证 |
| ---- | ---------------------- | -------------- | ---- |
| GET  | /api/coupons           | 获取优惠券列表 | ❌   |
| POST | /api/coupons/:id/claim | 领取优惠券     | ✅   |
| GET  | /api/coupons/my        | 我的优惠券列表 | ✅   |
| GET  | /api/coupons/available | 获取可用优惠券 | ✅   |
| GET  | /api/banners           | 获取Banner列表 | ❌   |

### 9️⃣ 健康检查

| 方法 | 路径        | 说明     | 认证 |
| ---- | ----------- | -------- | ---- |
| GET  | /api/health | 健康检查 | ❌   |

---

## 📊 统计

- **总接口数**: 56个
- **需要认证**: 41个
- **公开接口**: 15个

---

## 🔐 认证方式

使用 JWT Token 认证：

```
Authorization: Bearer <access_token>
```

---

## 📝 测试账号

**用户账号**:

- 手机号: 13800138000
- 密码: 123456

**管理员账号**:

- 用户名: admin
- 密码: admin123

---

## 🧪 测试示例

### 1. 用户登录

```bash
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "phone": "13800138000",
  "password": "123456"
}
```

**响应**:

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "user": {
      "id": "xxx",
      "phone": "138****8000",
      "nickname": "测试用户",
      "memberLevel": "GOLD",
      "points": 1000,
      "balance": "0"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 2. 获取商品列表

```bash
GET http://localhost:3001/api/products?page=1&pageSize=10
```

**响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [...],
    "pagination": {
      "total": 3,
      "page": 1,
      "pageSize": 10,
      "totalPages": 1
    }
  }
}
```

### 3. 添加到购物车

```bash
POST http://localhost:3001/api/cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "xxx",
  "quantity": 1
}
```

### 4. 创建订单

```bash
POST http://localhost:3001/api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "addressId": "xxx",
  "cartItemIds": ["xxx", "yyy"],
  "buyerMessage": "请尽快发货"
}
```

### 5. 管理员登录

```bash
POST http://localhost:3001/api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

---

## 📌 响应格式

### 成功响应

```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

### 分页响应

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "pageSize": 20,
      "totalPages": 5
    }
  }
}
```

### 错误响应

```json
{
  "code": 400,
  "message": "错误信息",
  "error": "详细错误"
}
```

---

## 🚀 部署信息

- **开发环境**: http://localhost:3001
- **生产环境**: 待配置
- **数据库**: PostgreSQL (localhost:5432)

---

**文档版本**: v1.0
**最后更新**: 2023-12-12
