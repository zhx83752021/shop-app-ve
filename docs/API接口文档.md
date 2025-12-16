# API 接口文档

## 目录

1. [接口规范](#1-接口规范)
2. [认证授权](#2-认证授权)
3. [用户模块](#3-用户模块)
4. [商品模块](#4-商品模块)
5. [订单模块](#5-订单模块)
6. [购物车模块](#6-购物车模块)
7. [内容模块](#7-内容模块)
8. [营销模块](#8-营销模块)

---

## 1. 接口规范

### 1.1 基础 URL

```
开发环境: http://localhost:3000/api
生产环境: https://your-domain.vercel.app/api
```

### 1.2 统一响应格式

**成功响应**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    // 业务数据
  }
}
```

**错误响应**:

```json
{
  "code": 400,
  "message": "错误描述",
  "error": "详细错误信息"
}
```

### 1.3 状态码规范

| 状态码 | 说明              |
| ------ | ----------------- |
| 200    | 请求成功          |
| 201    | 创建成功          |
| 400    | 请求参数错误      |
| 401    | 未认证/Token 失效 |
| 403    | 无权限            |
| 404    | 资源不存在        |
| 500    | 服务器错误        |

### 1.4 分页参数

**请求参数**:

```
page: 页码(默认1)
pageSize: 每页数量(默认20)
```

**响应格式**:

```json
{
  "code": 200,
  "data": {
    "items": [],
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

---

## 2. 认证授权

### 2.1 用户注册

**接口**: `POST /api/auth/register`

**请求参数**:

```json
{
  "phone": "13800138000",
  "password": "password123",
  "code": "123456" // 短信验证码
}
```

**响应**:

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "user": {
      "id": "user_123",
      "phone": "13800138000",
      "nickname": "新用户"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 2.2 用户登录

**接口**: `POST /api/auth/login`

**请求参数**:

```json
{
  "phone": "13800138000",
  "password": "password123"
}
```

**响应**:

```json
{
  "code": 200,
  "data": {
    "user": {
      "id": "user_123",
      "phone": "138****8000",
      "nickname": "用户昵称",
      "avatar": "https://...",
      "memberLevel": "GOLD"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 2.3 刷新 Token

**接口**: `POST /api/auth/refresh`

**请求参数**:

```json
{
  "refreshToken": "eyJhbGc..."
}
```

**响应**:

```json
{
  "code": 200,
  "data": {
    "accessToken": "eyJhbGc..."
  }
}
```

### 2.4 发送验证码

**接口**: `POST /api/auth/send-code`

**请求参数**:

```json
{
  "phone": "13800138000",
  "type": "register" // register | login | reset_password
}
```

---

## 3. 用户模块

### 3.1 获取用户信息

**接口**: `GET /api/user/profile`

**请求头**: `Authorization: Bearer {token}`

**响应**:

```json
{
  "code": 200,
  "data": {
    "id": "user_123",
    "phone": "138****8000",
    "nickname": "用户昵称",
    "avatar": "https://...",
    "email": "user@example.com",
    "gender": "MALE",
    "birthday": "1990-01-01",
    "memberLevel": "GOLD",
    "points": 3680,
    "growthValue": 8520,
    "balance": "1280.00",
    "createdAt": "2023-01-01T00:00:00Z"
  }
}
```

### 3.2 更新用户信息

**接口**: `PUT /api/user/profile`

**请求参数**:

```json
{
  "nickname": "新昵称",
  "avatar": "https://...",
  "gender": "MALE",
  "birthday": "1990-01-01"
}
```

### 3.3 修改密码

**接口**: `PUT /api/user/password`

**请求参数**:

```json
{
  "oldPassword": "old123",
  "newPassword": "new123"
}
```

### 3.4 地址管理

**获取地址列表**: `GET /api/user/addresses`

**添加地址**: `POST /api/user/addresses`

```json
{
  "receiverName": "张三",
  "phone": "13800138000",
  "province": "北京市",
  "city": "北京市",
  "district": "朝阳区",
  "detail": "XX街道XX号",
  "isDefault": false
}
```

**更新地址**: `PUT /api/user/addresses/:id`

**删除地址**: `DELETE /api/user/addresses/:id`

**设置默认地址**: `PUT /api/user/addresses/:id/default`

---

## 4. 商品模块

### 4.1 商品列表

**接口**: `GET /api/products`

**查询参数**:

```
categoryId: 分类ID
keyword: 搜索关键词
minPrice: 最低价格
maxPrice: 最高价格
sortBy: 排序(sales|price|createdAt)
sortOrder: 排序方式(asc|desc)
page: 页码
pageSize: 每页数量
```

**响应**:

```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "prod_123",
        "title": "时尚运动鞋",
        "price": "599.00",
        "originalPrice": "899.00",
        "mainImage": "https://...",
        "sales": 23000,
        "tags": ["秒杀", "热卖"],
        "category": {
          "id": "cat_1",
          "name": "运动鞋"
        }
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
```

### 4.2 商品详情

**接口**: `GET /api/products/:id`

**响应**:

```json
{
  "code": 200,
  "data": {
    "id": "prod_123",
    "title": "时尚运动鞋",
    "description": "商品描述",
    "price": "599.00",
    "originalPrice": "899.00",
    "stock": 1000,
    "sales": 23000,
    "mainImage": "https://...",
    "images": ["https://...", "https://..."],
    "video": "https://...",
    "detail": "详情HTML",
    "params": {
      "品牌": "Nike",
      "产地": "中国"
    },
    "tags": ["秒杀"],
    "category": {
      "id": "cat_1",
      "name": "运动鞋"
    },
    "skus": [
      {
        "id": "sku_1",
        "specs": { "color": "白色", "size": "42" },
        "price": "599.00",
        "stock": 100,
        "image": "https://..."
      }
    ]
  }
}
```

### 4.3 分类列表

**接口**: `GET /api/categories`

**响应**:

```json
{
  "code": 200,
  "data": [
    {
      "id": "cat_1",
      "name": "时尚服饰",
      "icon": "👗",
      "children": [
        {
          "id": "cat_11",
          "name": "女装",
          "icon": "👚"
        }
      ]
    }
  ]
}
```

### 4.4 搜索建议

**接口**: `GET /api/products/search/suggest`

**查询参数**: `keyword=运动鞋`

**响应**:

```json
{
  "code": 200,
  "data": {
    "keywords": ["运动鞋", "运动鞋男", "运动鞋女"],
    "products": [
      {
        "id": "prod_123",
        "title": "时尚运动鞋",
        "image": "https://..."
      }
    ]
  }
}
```

---

## 5. 订单模块

### 5.1 创建订单

**接口**: `POST /api/orders`

**请求参数**:

```json
{
  "items": [
    {
      "productId": "prod_123",
      "skuId": "sku_1",
      "quantity": 2
    }
  ],
  "addressId": "addr_1",
  "couponId": "coupon_1",
  "buyerMessage": "请尽快发货",
  "paymentMethod": "WECHAT"
}
```

**响应**:

```json
{
  "code": 200,
  "data": {
    "orderId": "order_123",
    "orderNo": "20231211001",
    "actualAmount": "1208.00",
    "paymentUrl": "https://..." // 支付链接
  }
}
```

### 5.2 订单列表

**接口**: `GET /api/orders`

**查询参数**:

```
status: 订单状态
page: 页码
pageSize: 每页数量
```

**响应**:

```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "order_123",
        "orderNo": "20231211001",
        "status": "PENDING_SHIP",
        "totalAmount": "1298.00",
        "actualAmount": "1208.00",
        "items": [
          {
            "productTitle": "时尚运动鞋",
            "productImage": "https://...",
            "price": "599.00",
            "quantity": 2
          }
        ],
        "createdAt": "2023-12-11T14:30:00Z"
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 20
  }
}
```

### 5.3 订单详情

**接口**: `GET /api/orders/:id`

**响应**:

```json
{
  "code": 200,
  "data": {
    "id": "order_123",
    "orderNo": "20231211001",
    "status": "SHIPPED",
    "totalAmount": "1298.00",
    "discountAmount": "100.00",
    "shippingFee": "10.00",
    "actualAmount": "1208.00",
    "receiverName": "张三",
    "receiverPhone": "138****8000",
    "receiverAddress": "北京市朝阳区XX街道XX号",
    "paymentMethod": "WECHAT",
    "paymentTime": "2023-12-11T14:35:00Z",
    "shippingMethod": "顺丰快递",
    "shippingNo": "SF1234567890",
    "shippingTime": "2023-12-11T16:00:00Z",
    "items": [
      {
        "productTitle": "时尚运动鞋",
        "productImage": "https://...",
        "skuSpecs": { "color": "白色", "size": "42" },
        "price": "599.00",
        "quantity": 2,
        "totalAmount": "1198.00"
      }
    ],
    "createdAt": "2023-12-11T14:30:00Z"
  }
}
```

### 5.4 取消订单

**接口**: `PUT /api/orders/:id/cancel`

**请求参数**:

```json
{
  "reason": "不想要了"
}
```

### 5.5 确认收货

**接口**: `PUT /api/orders/:id/confirm`

### 5.6 申请退款

**接口**: `POST /api/orders/:id/refund`

**请求参数**:

```json
{
  "refundAmount": "1208.00",
  "refundReason": "商品质量问题",
  "refundType": "RETURN_REFUND"
}
```

---

## 6. 购物车模块

### 6.1 获取购物车

**接口**: `GET /api/cart`

**响应**:

```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "cart_1",
        "product": {
          "id": "prod_123",
          "title": "时尚运动鞋",
          "price": "599.00",
          "originalPrice": "899.00",
          "mainImage": "https://...",
          "stock": 1000
        },
        "quantity": 1,
        "selected": true
      }
    ],
    "totalAmount": "599.00",
    "selectedCount": 1
  }
}
```

### 6.2 添加到购物车

**接口**: `POST /api/cart`

**请求参数**:

```json
{
  "productId": "prod_123",
  "quantity": 1
}
```

### 6.3 更新数量

**接口**: `PUT /api/cart/:id`

**请求参数**:

```json
{
  "quantity": 2
}
```

### 6.4 删除商品

**接口**: `DELETE /api/cart/:id`

### 6.5 全选/取消全选

**接口**: `PUT /api/cart/select-all`

**请求参数**:

```json
{
  "selected": true
}
```

---

## 7. 内容模块

### 7.1 帖子列表

**接口**: `GET /api/posts`

**查询参数**:

```
type: IMAGE|VIDEO
category: 分类
page: 页码
pageSize: 每页数量
```

**响应**:

```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "post_123",
        "type": "IMAGE",
        "title": "春季穿搭分享",
        "content": "内容摘要...",
        "images": ["https://..."],
        "user": {
          "id": "user_123",
          "nickname": "时尚达人",
          "avatar": "https://..."
        },
        "likeCount": 23000,
        "commentCount": 356,
        "hasProduct": true,
        "createdAt": "2023-12-11T10:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
```

### 7.2 帖子详情

**接口**: `GET /api/posts/:id`

**响应**:

```json
{
  "code": 200,
  "data": {
    "id": "post_123",
    "type": "IMAGE",
    "title": "春季穿搭分享",
    "content": "完整内容...",
    "images": ["https://..."],
    "video": null,
    "user": {
      "id": "user_123",
      "nickname": "时尚达人",
      "avatar": "https://..."
    },
    "viewCount": 50000,
    "likeCount": 23000,
    "commentCount": 356,
    "products": [
      {
        "id": "prod_123",
        "title": "商品名称",
        "price": "299.00",
        "image": "https://..."
      }
    ],
    "createdAt": "2023-12-11T10:00:00Z"
  }
}
```

### 7.3 评论列表

**接口**: `GET /api/posts/:id/comments`

**响应**:

```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "comment_1",
        "user": {
          "nickname": "用户A",
          "avatar": "https://..."
        },
        "content": "很不错",
        "likeCount": 10,
        "createdAt": "2023-12-11T11:00:00Z"
      }
    ],
    "total": 50
  }
}
```

### 7.4 发表评论

**接口**: `POST /api/posts/:id/comments`

**请求参数**:

```json
{
  "content": "评论内容"
}
```

### 7.5 点赞/取消点赞

**接口**: `POST /api/posts/:id/like`

---

## 8. 营销模块

### 8.1 优惠券列表

**接口**: `GET /api/coupons`

**响应**:

```json
{
  "code": 200,
  "data": [
    {
      "id": "coupon_1",
      "name": "新人专享券",
      "type": "DISCOUNT",
      "discountAmount": "20.00",
      "minAmount": "100.00",
      "startTime": "2023-12-01T00:00:00Z",
      "endTime": "2023-12-31T23:59:59Z",
      "received": false
    }
  ]
}
```

### 8.2 领取优惠券

**接口**: `POST /api/coupons/:id/receive`

### 8.3 我的优惠券

**接口**: `GET /api/user/coupons`

**查询参数**: `status=UNUSED|USED|EXPIRED`

### 8.4 轮播图列表

**接口**: `GET /api/banners`

**查询参数**: `position=HOME|DISCOVER|PROFILE`

**响应**:

```json
{
  "code": 200,
  "data": [
    {
      "id": "banner_1",
      "title": "春季新品",
      "image": "https://...",
      "link": "/products/123"
    }
  ]
}
```

### 8.5 秒杀活动

**接口**: `GET /api/flash-sales/current`

**响应**:

```json
{
  "code": 200,
  "data": {
    "startTime": "2023-12-11T20:00:00Z",
    "endTime": "2023-12-11T22:00:00Z",
    "products": [
      {
        "id": "prod_123",
        "title": "秒杀商品",
        "price": "99.00",
        "originalPrice": "299.00",
        "stock": 100,
        "soldCount": 50
      }
    ]
  }
}
```

---

## 9. 管理端接口

### 9.1 管理员登录

**接口**: `POST /api/admin/auth/login`

**请求参数**:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

### 9.2 数据统计

**接口**: `GET /api/admin/dashboard/stats`

**响应**:

```json
{
  "code": 200,
  "data": {
    "todayGMV": "1280000.00",
    "todayOrders": 3245,
    "todayUsers": 1256,
    "conversionRate": 8.5,
    "trends": {
      "gmv": [100000, 120000, ...],
      "orders": [200, 250, ...]
    }
  }
}
```

### 9.3 商品管理

**商品列表**: `GET /api/admin/products`
**创建商品**: `POST /api/admin/products`
**更新商品**: `PUT /api/admin/products/:id`
**删除商品**: `DELETE /api/admin/products/:id`
**上下架**: `PUT /api/admin/products/:id/status`

### 9.4 订单管理

**订单列表**: `GET /api/admin/orders`
**订单详情**: `GET /api/admin/orders/:id`
**发货**: `PUT /api/admin/orders/:id/ship`
**退款处理**: `PUT /api/admin/refunds/:id/process`

### 9.5 用户管理

**用户列表**: `GET /api/admin/users`
**用户详情**: `GET /api/admin/users/:id`
**禁用用户**: `PUT /api/admin/users/:id/disable`

---

## 10. 错误码对照表

| 错误码 | 说明           |
| ------ | -------------- |
| 10001  | 参数验证失败   |
| 10002  | 手机号已注册   |
| 10003  | 验证码错误     |
| 10004  | 用户不存在     |
| 10005  | 密码错误       |
| 10006  | Token 无效     |
| 10007  | Token 已过期   |
| 20001  | 商品不存在     |
| 20002  | 库存不足       |
| 20003  | 商品已下架     |
| 30001  | 订单不存在     |
| 30002  | 订单状态错误   |
| 30003  | 支付失败       |
| 40001  | 优惠券已领完   |
| 40002  | 优惠券已过期   |
| 40003  | 不满足使用条件 |

---

## 11. Postman 集合

建议导出 Postman Collection 供团队使用,包含:

- 环境变量配置
- 预置请求示例
- 自动化测试脚本
- Mock Server 配置
