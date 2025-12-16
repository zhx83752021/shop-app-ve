-- ============================================
-- Supabase 数据库建表 SQL
-- 从 Prisma Schema 生成
-- ============================================

-- 创建枚举类型
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');
CREATE TYPE "MemberLevel" AS ENUM ('NORMAL', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND');
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BANNED');
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'OPERATOR');
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'ON_SALE', 'OFF_SALE', 'SOLD_OUT');
CREATE TYPE "CategoryStatus" AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE "BannerStatus" AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING_PAYMENT', 'PENDING_SHIPMENT', 'SHIPPED', 'COMPLETED', 'CANCELLED', 'REFUNDING', 'REFUNDED');
CREATE TYPE "PaymentMethod" AS ENUM ('WECHAT', 'ALIPAY', 'BALANCE');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
CREATE TYPE "CouponType" AS ENUM ('FULL_DISCOUNT', 'DISCOUNT_RATE');
CREATE TYPE "CouponStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED');
CREATE TYPE "UserCouponStatus" AS ENUM ('UNUSED', 'USED', 'EXPIRED');
CREATE TYPE "RefundStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');

-- ============================================
-- 用户相关表
-- ============================================

-- 用户表
CREATE TABLE "users" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "phone" VARCHAR(11) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "nickname" VARCHAR(50) DEFAULT '新用户',
  "avatar" VARCHAR(500),
  "email" VARCHAR(100) UNIQUE,
  "gender" "Gender" DEFAULT 'UNKNOWN',
  "birthday" TIMESTAMP(3),
  "memberLevel" "MemberLevel" DEFAULT 'NORMAL',
  "points" INTEGER DEFAULT 0,
  "growthValue" INTEGER DEFAULT 0,
  "balance" DECIMAL(10,2) DEFAULT 0,
  "status" "UserStatus" DEFAULT 'ACTIVE',
  "lastLoginAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "users_phone_idx" ON "users"("phone");
CREATE INDEX "users_memberLevel_idx" ON "users"("memberLevel");

-- 收货地址表
CREATE TABLE "addresses" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL,
  "receiverName" VARCHAR(50) NOT NULL,
  "phone" VARCHAR(11) NOT NULL,
  "province" VARCHAR(50) NOT NULL,
  "city" VARCHAR(50) NOT NULL,
  "district" VARCHAR(50) NOT NULL,
  "detail" VARCHAR(200) NOT NULL,
  "isDefault" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX "addresses_userId_idx" ON "addresses"("userId");

-- ============================================
-- 管理员表
-- ============================================

CREATE TABLE "admins" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "username" VARCHAR(50) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "nickname" VARCHAR(50) NOT NULL,
  "avatar" VARCHAR(500),
  "role" "AdminRole" DEFAULT 'ADMIN',
  "status" "UserStatus" DEFAULT 'ACTIVE',
  "lastLoginAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 商品相关表
-- ============================================

-- 商品分类表
CREATE TABLE "categories" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "name" VARCHAR(50) NOT NULL,
  "icon" VARCHAR(100),
  "image" VARCHAR(500),
  "parentId" TEXT,
  "sort" INTEGER DEFAULT 0,
  "status" "CategoryStatus" DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL
);

CREATE INDEX "categories_parentId_idx" ON "categories"("parentId");

-- 商品表
CREATE TABLE "products" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "name" VARCHAR(200) NOT NULL,
  "subtitle" VARCHAR(500),
  "description" TEXT,
  "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "video" VARCHAR(500),
  "price" DECIMAL(10,2) NOT NULL,
  "originalPrice" DECIMAL(10,2),
  "costPrice" DECIMAL(10,2),
  "stock" INTEGER DEFAULT 0,
  "sales" INTEGER DEFAULT 0,
  "views" INTEGER DEFAULT 0,
  "rating" DECIMAL(3,2) DEFAULT 5.00,
  "categoryId" TEXT NOT NULL,
  "brandId" TEXT,
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "specs" JSONB,
  "skus" JSONB,
  "status" "ProductStatus" DEFAULT 'DRAFT',
  "isFeatured" BOOLEAN DEFAULT false,
  "isHot" BOOLEAN DEFAULT false,
  "isNew" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("categoryId") REFERENCES "categories"("id")
);

CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");
CREATE INDEX "products_status_idx" ON "products"("status");

-- ============================================
-- 订单相关表
-- ============================================

-- 订单表
CREATE TABLE "orders" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "orderNo" VARCHAR(50) UNIQUE NOT NULL,
  "userId" TEXT NOT NULL,
  "addressId" TEXT,
  "totalAmount" DECIMAL(10,2) NOT NULL,
  "discountAmount" DECIMAL(10,2) DEFAULT 0,
  "shippingFee" DECIMAL(10,2) DEFAULT 0,
  "actualAmount" DECIMAL(10,2) NOT NULL,
  "paymentMethod" "PaymentMethod",
  "paymentStatus" "PaymentStatus" DEFAULT 'PENDING',
  "status" "OrderStatus" DEFAULT 'PENDING_PAYMENT',
  "remark" TEXT,
  "paidAt" TIMESTAMP(3),
  "shippedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "cancelledAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "users"("id"),
  FOREIGN KEY ("addressId") REFERENCES "addresses"("id")
);

CREATE INDEX "orders_userId_idx" ON "orders"("userId");
CREATE INDEX "orders_orderNo_idx" ON "orders"("orderNo");
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- 订单商品表
CREATE TABLE "order_items" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "orderId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "skuId" TEXT,
  "productName" VARCHAR(200) NOT NULL,
  "productImage" VARCHAR(500),
  "price" DECIMAL(10,2) NOT NULL,
  "quantity" INTEGER NOT NULL,
  "totalAmount" DECIMAL(10,2) NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE,
  FOREIGN KEY ("productId") REFERENCES "products"("id")
);

CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- ============================================
-- 购物车表
-- ============================================

CREATE TABLE "cart_items" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "skuId" TEXT,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE
);

CREATE INDEX "cart_items_userId_idx" ON "cart_items"("userId");

-- ============================================
-- 优惠券相关表
-- ============================================

-- 优惠券表
CREATE TABLE "coupons" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "name" VARCHAR(100) NOT NULL,
  "type" "CouponType" NOT NULL,
  "discountAmount" DECIMAL(10,2),
  "discountRate" DECIMAL(3,2),
  "minAmount" DECIMAL(10,2) DEFAULT 0,
  "totalCount" INTEGER NOT NULL,
  "receivedCount" INTEGER DEFAULT 0,
  "startTime" TIMESTAMP(3) NOT NULL,
  "endTime" TIMESTAMP(3) NOT NULL,
  "status" "CouponStatus" DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- 用户优惠券表
CREATE TABLE "user_coupons" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL,
  "couponId" TEXT NOT NULL,
  "orderId" TEXT,
  "status" "UserCouponStatus" DEFAULT 'UNUSED',
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  FOREIGN KEY ("couponId") REFERENCES "coupons"("id"),
  FOREIGN KEY ("orderId") REFERENCES "orders"("id")
);

CREATE INDEX "user_coupons_userId_idx" ON "user_coupons"("userId");

-- ============================================
-- 其他表
-- ============================================

-- 轮播图表
CREATE TABLE "banners" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "title" VARCHAR(100),
  "image" VARCHAR(500) NOT NULL,
  "link" VARCHAR(500),
  "sort" INTEGER DEFAULT 0,
  "status" "BannerStatus" DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- 收藏表
CREATE TABLE "favorites" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE,
  UNIQUE("userId", "productId")
);

CREATE INDEX "favorites_userId_idx" ON "favorites"("userId");

-- 浏览历史表
CREATE TABLE "browse_histories" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE
);

CREATE INDEX "browse_histories_userId_idx" ON "browse_histories"("userId");

-- 退款表
CREATE TABLE "refunds" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "orderId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "amount" DECIMAL(10,2) NOT NULL,
  "status" "RefundStatus" DEFAULT 'PENDING',
  "processedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("orderId") REFERENCES "orders"("id"),
  FOREIGN KEY ("userId") REFERENCES "users"("id")
);

-- 评论、帖子等社区功能表 (简化版)
CREATE TABLE "posts" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "likesCount" INTEGER DEFAULT 0,
  "commentsCount" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE "comments" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "postId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "likesCount" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE "post_likes" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "postId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  UNIQUE("postId", "userId")
);

CREATE TABLE "follows" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "followerId" TEXT NOT NULL,
  "followingId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE,
  FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE CASCADE,
  UNIQUE("followerId", "followingId")
);

-- 查看创建的表
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
