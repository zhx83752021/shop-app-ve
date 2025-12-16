-- ============================================
-- 完整数据库初始化脚本（21个表）
-- 严格按照 Prisma Schema 创建
-- 在 Supabase SQL Editor 中执行
-- ============================================

-- ============================================
-- 第一步：删除所有表和枚举类型
-- ============================================
DROP TABLE IF EXISTS "follows" CASCADE;
DROP TABLE IF EXISTS "browse_history" CASCADE;
DROP TABLE IF EXISTS "favorites" CASCADE;
DROP TABLE IF EXISTS "rankings" CASCADE;
DROP TABLE IF EXISTS "post_products" CASCADE;
DROP TABLE IF EXISTS "post_likes" CASCADE;
DROP TABLE IF EXISTS "comments" CASCADE;
DROP TABLE IF EXISTS "posts" CASCADE;
DROP TABLE IF EXISTS "user_coupons" CASCADE;
DROP TABLE IF EXISTS "coupons" CASCADE;
DROP TABLE IF EXISTS "banners" CASCADE;
DROP TABLE IF EXISTS "refunds" CASCADE;
DROP TABLE IF EXISTS "order_items" CASCADE;
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TABLE IF EXISTS "cart_items" CASCADE;
DROP TABLE IF EXISTS "skus" CASCADE;
DROP TABLE IF EXISTS "products" CASCADE;
DROP TABLE IF EXISTS "categories" CASCADE;
DROP TABLE IF EXISTS "addresses" CASCADE;
DROP TABLE IF EXISTS "admins" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

DROP TYPE IF EXISTS "Gender" CASCADE;
DROP TYPE IF EXISTS "MemberLevel" CASCADE;
DROP TYPE IF EXISTS "UserStatus" CASCADE;
DROP TYPE IF EXISTS "AdminRole" CASCADE;
DROP TYPE IF EXISTS "Status" CASCADE;
DROP TYPE IF EXISTS "OrderStatus" CASCADE;
DROP TYPE IF EXISTS "PaymentMethod" CASCADE;
DROP TYPE IF EXISTS "RefundType" CASCADE;
DROP TYPE IF EXISTS "RefundStatus" CASCADE;
DROP TYPE IF EXISTS "PostType" CASCADE;
DROP TYPE IF EXISTS "PostStatus" CASCADE;
DROP TYPE IF EXISTS "CouponType" CASCADE;
DROP TYPE IF EXISTS "UserCouponStatus" CASCADE;
DROP TYPE IF EXISTS "BannerPosition" CASCADE;
DROP TYPE IF EXISTS "RankingType" CASCADE;
DROP TYPE IF EXISTS "TrendType" CASCADE;

-- ============================================
-- 第二步：创建所有枚举类型
-- ============================================
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');
CREATE TYPE "MemberLevel" AS ENUM ('NORMAL', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND');
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BANNED');
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'OPERATOR');
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING_PAYMENT', 'PENDING_SHIP', 'SHIPPED', 'COMPLETED', 'CLOSED', 'REFUNDING');
CREATE TYPE "PaymentMethod" AS ENUM ('WECHAT', 'ALIPAY', 'BALANCE');
CREATE TYPE "RefundType" AS ENUM ('REFUND_ONLY', 'RETURN_REFUND');
CREATE TYPE "RefundStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');
CREATE TYPE "PostType" AS ENUM ('IMAGE', 'VIDEO');
CREATE TYPE "PostStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "CouponType" AS ENUM ('DISCOUNT', 'PERCENTAGE');
CREATE TYPE "UserCouponStatus" AS ENUM ('UNUSED', 'USED', 'EXPIRED');
CREATE TYPE "BannerPosition" AS ENUM ('HOME', 'DISCOVER', 'PROFILE');
CREATE TYPE "RankingType" AS ENUM ('HOT', 'RATING', 'NEW', 'FAVORITE');
CREATE TYPE "TrendType" AS ENUM ('UP', 'DOWN', 'UNCHANGED');

-- ============================================
-- 第三步：创建所有表（21个表）
-- ============================================

-- 1. 用户表
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

-- 2. 收货地址表
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

-- 3. 管理员表
CREATE TABLE "admins" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "username" VARCHAR(50) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "nickname" VARCHAR(50) NOT NULL,
  "avatar" VARCHAR(500),
  "role" "AdminRole" DEFAULT 'OPERATOR',
  "status" "UserStatus" DEFAULT 'ACTIVE',
  "lastLoginAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "admins_username_idx" ON "admins"("username");

-- 4. 商品分类表
CREATE TABLE "categories" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "name" VARCHAR(50) NOT NULL,
  "icon" VARCHAR(100),
  "parentId" TEXT,
  "sort" INTEGER DEFAULT 0,
  "status" "Status" DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("parentId") REFERENCES "categories"("id")
);
CREATE INDEX "categories_parentId_idx" ON "categories"("parentId");
CREATE INDEX "categories_status_idx" ON "categories"("status");

-- 5. 商品表
CREATE TABLE "products" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "categoryId" TEXT NOT NULL,
  "title" VARCHAR(200) NOT NULL,
  "description" TEXT,
  "mainImage" VARCHAR(500) NOT NULL,
  "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "video" VARCHAR(500),
  "detail" TEXT,
  "price" DECIMAL(10,2) NOT NULL,
  "originalPrice" DECIMAL(10,2) NOT NULL,
  "stock" INTEGER DEFAULT 0,
  "sales" INTEGER DEFAULT 0,
  "views" INTEGER DEFAULT 0,
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "params" JSONB,
  "status" "Status" DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("categoryId") REFERENCES "categories"("id")
);
CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");
CREATE INDEX "products_status_idx" ON "products"("status");
CREATE INDEX "products_price_idx" ON "products"("price");
CREATE INDEX "products_sales_idx" ON "products"("sales");
CREATE INDEX "products_title_idx" ON "products"("title");

-- 6. SKU表
CREATE TABLE "skus" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "productId" TEXT NOT NULL,
  "specs" JSONB NOT NULL,
  "price" DECIMAL(10,2) NOT NULL,
  "stock" INTEGER DEFAULT 0,
  "image" VARCHAR(500),
  "sku" VARCHAR(100) UNIQUE NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE
);
CREATE INDEX "skus_productId_idx" ON "skus"("productId");
CREATE INDEX "skus_sku_idx" ON "skus"("sku");

-- 7. 订单表
CREATE TABLE "orders" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "orderNo" VARCHAR(32) UNIQUE NOT NULL,
  "userId" TEXT NOT NULL,
  "addressId" TEXT NOT NULL,
  "status" "OrderStatus" DEFAULT 'PENDING_PAYMENT',
  "totalAmount" DECIMAL(10,2) NOT NULL,
  "discountAmount" DECIMAL(10,2) DEFAULT 0,
  "shippingFee" DECIMAL(10,2) DEFAULT 0,
  "actualAmount" DECIMAL(10,2) NOT NULL,
  "buyerMessage" VARCHAR(500),
  "paymentMethod" "PaymentMethod",
  "paymentTime" TIMESTAMP(3),
  "shippingMethod" VARCHAR(50),
  "shippingNo" VARCHAR(100),
  "shippingTime" TIMESTAMP(3),
  "confirmTime" TIMESTAMP(3),
  "closeTime" TIMESTAMP(3),
  "closeReason" VARCHAR(200),
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "users"("id"),
  FOREIGN KEY ("addressId") REFERENCES "addresses"("id")
);
CREATE INDEX "orders_userId_idx" ON "orders"("userId");
CREATE INDEX "orders_orderNo_idx" ON "orders"("orderNo");
CREATE INDEX "orders_status_idx" ON "orders"("status");
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");

-- 8. 订单项表
CREATE TABLE "order_items" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "orderId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "skuId" TEXT,
  "productTitle" VARCHAR(200) NOT NULL,
  "productImage" VARCHAR(500) NOT NULL,
  "skuSpecs" JSONB,
  "price" DECIMAL(10,2) NOT NULL,
  "quantity" INTEGER NOT NULL,
  "totalAmount" DECIMAL(10,2) NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE,
  FOREIGN KEY ("productId") REFERENCES "products"("id"),
  FOREIGN KEY ("skuId") REFERENCES "skus"("id")
);
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- 9. 退款表
CREATE TABLE "refunds" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "refundNo" VARCHAR(32) UNIQUE NOT NULL,
  "orderId" TEXT UNIQUE NOT NULL,
  "userId" TEXT NOT NULL,
  "refundAmount" DECIMAL(10,2) NOT NULL,
  "refundReason" VARCHAR(500) NOT NULL,
  "refundType" "RefundType" NOT NULL,
  "status" "RefundStatus" DEFAULT 'PENDING',
  "rejectReason" VARCHAR(500),
  "processTime" TIMESTAMP(3),
  "completedTime" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("orderId") REFERENCES "orders"("id"),
  FOREIGN KEY ("userId") REFERENCES "users"("id")
);
CREATE INDEX "refunds_userId_idx" ON "refunds"("userId");
CREATE INDEX "refunds_refundNo_idx" ON "refunds"("refundNo");

-- 10. 购物车表
CREATE TABLE "cart_items" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "quantity" INTEGER DEFAULT 1,
  "selected" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE,
  UNIQUE("userId", "productId")
);
CREATE INDEX "cart_items_userId_idx" ON "cart_items"("userId");

-- 11. 帖子表
CREATE TABLE "posts" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL,
  "type" "PostType" NOT NULL,
  "title" VARCHAR(200) NOT NULL,
  "content" TEXT NOT NULL,
  "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "video" VARCHAR(500),
  "viewCount" INTEGER DEFAULT 0,
  "likeCount" INTEGER DEFAULT 0,
  "commentCount" INTEGER DEFAULT 0,
  "status" "PostStatus" DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "users"("id")
);
CREATE INDEX "posts_userId_idx" ON "posts"("userId");
CREATE INDEX "posts_status_idx" ON "posts"("status");
CREATE INDEX "posts_createdAt_idx" ON "posts"("createdAt");
CREATE INDEX "posts_title_idx" ON "posts"("title");

-- 12. 评论表
CREATE TABLE "comments" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "postId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "content" VARCHAR(500) NOT NULL,
  "parentId" TEXT,
  "replyToUserId" TEXT,
  "likeCount" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES "users"("id"),
  FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE CASCADE,
  FOREIGN KEY ("replyToUserId") REFERENCES "users"("id")
);
CREATE INDEX "comments_postId_idx" ON "comments"("postId");
CREATE INDEX "comments_userId_idx" ON "comments"("userId");
CREATE INDEX "comments_parentId_idx" ON "comments"("parentId");

-- 13. 帖子点赞表
CREATE TABLE "post_likes" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "postId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  UNIQUE("postId", "userId")
);
CREATE INDEX "post_likes_postId_idx" ON "post_likes"("postId");
CREATE INDEX "post_likes_userId_idx" ON "post_likes"("userId");

-- 14. 帖子商品关联表
CREATE TABLE "post_products" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "postId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE,
  FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE,
  UNIQUE("postId", "productId")
);
CREATE INDEX "post_products_postId_idx" ON "post_products"("postId");

-- 15. 优惠券表
CREATE TABLE "coupons" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "name" VARCHAR(100) NOT NULL,
  "type" "CouponType" NOT NULL,
  "discountAmount" DECIMAL(10,2) NOT NULL,
  "minAmount" DECIMAL(10,2) DEFAULT 0,
  "totalCount" INTEGER NOT NULL,
  "receivedCount" INTEGER DEFAULT 0,
  "startTime" TIMESTAMP(3) NOT NULL,
  "endTime" TIMESTAMP(3) NOT NULL,
  "status" "Status" DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "coupons_status_idx" ON "coupons"("status");

-- 16. 用户优惠券表
CREATE TABLE "user_coupons" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL,
  "couponId" TEXT NOT NULL,
  "status" "UserCouponStatus" DEFAULT 'UNUSED',
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  FOREIGN KEY ("couponId") REFERENCES "coupons"("id")
);
CREATE INDEX "user_coupons_userId_idx" ON "user_coupons"("userId");
CREATE INDEX "user_coupons_couponId_idx" ON "user_coupons"("couponId");

-- 17. 轮播图表
CREATE TABLE "banners" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "title" VARCHAR(100) NOT NULL,
  "image" VARCHAR(500) NOT NULL,
  "link" VARCHAR(500),
  "position" "BannerPosition" NOT NULL,
  "sort" INTEGER DEFAULT 0,
  "status" "Status" DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "banners_position_idx" ON "banners"("position");
CREATE INDEX "banners_status_idx" ON "banners"("status");

-- 18. 排行榜表
CREATE TABLE "rankings" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "productId" TEXT NOT NULL,
  "type" "RankingType" NOT NULL,
  "rank" INTEGER NOT NULL,
  "score" DOUBLE PRECISION NOT NULL,
  "trend" "TrendType" DEFAULT 'UNCHANGED',
  "lastUpdated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE,
  UNIQUE("productId", "type")
);
CREATE INDEX "rankings_type_rank_idx" ON "rankings"("type", "rank");

-- 19. 收藏表
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

-- 20. 浏览历史表
CREATE TABLE "browse_history" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE
);
CREATE INDEX "browse_history_userId_idx" ON "browse_history"("userId");
CREATE INDEX "browse_history_createdAt_idx" ON "browse_history"("createdAt");

-- 21. 关注关系表
CREATE TABLE "follows" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "followerId" TEXT NOT NULL,
  "followingId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE,
  FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE CASCADE,
  UNIQUE("followerId", "followingId")
);
CREATE INDEX "follows_followerId_idx" ON "follows"("followerId");
CREATE INDEX "follows_followingId_idx" ON "follows"("followingId");

-- ============================================
-- 第四步：插入初始数据
-- ============================================

-- 插入分类
INSERT INTO "categories" (name, icon, sort, status)
VALUES
  ('时尚服饰', '👗', 1, 'ACTIVE'),
  ('运动户外', '⚽', 2, 'ACTIVE'),
  ('美妆护肤', '💄', 3, 'ACTIVE'),
  ('数码家电', '📱', 4, 'ACTIVE'),
  ('食品生鲜', '🍎', 5, 'ACTIVE');

-- 插入轮播图
INSERT INTO "banners" (title, image, link, position, sort, status)
VALUES
  ('春季新品大促', 'https://picsum.photos/800/400?random=1', '/products', 'HOME', 1, 'ACTIVE'),
  ('限时秒杀', 'https://picsum.photos/800/400?random=2', '/flash-sale', 'HOME', 2, 'ACTIVE'),
  ('会员专享', 'https://picsum.photos/800/400?random=3', '/vip', 'HOME', 3, 'ACTIVE');

-- 插入商品
DO $$
DECLARE
  cat1 TEXT;
  cat2 TEXT;
  cat3 TEXT;
  cat4 TEXT;
  cat5 TEXT;
BEGIN
  SELECT id INTO cat1 FROM "categories" WHERE name = '时尚服饰' LIMIT 1;
  SELECT id INTO cat2 FROM "categories" WHERE name = '运动户外' LIMIT 1;
  SELECT id INTO cat3 FROM "categories" WHERE name = '美妆护肤' LIMIT 1;
  SELECT id INTO cat4 FROM "categories" WHERE name = '数码家电' LIMIT 1;
  SELECT id INTO cat5 FROM "categories" WHERE name = '食品生鲜' LIMIT 1;

  INSERT INTO "products" ("categoryId", title, description, "mainImage", images, price, "originalPrice", stock, sales, tags, params, status)
  VALUES
    -- 时尚服饰
    (cat1, '时尚运动鞋 透气舒适跑步鞋', '轻便透气，舒适缓震，适合各种运动场景',
     'https://picsum.photos/400/400?random=10',
     ARRAY['https://picsum.photos/400/400?random=10','https://picsum.photos/400/400?random=11']::text[],
     599.00, 899.00, 1000, 23000, ARRAY['秒杀','热卖']::text[],
     '{"品牌":"Nike","产地":"中国","材质":"网布+橡胶"}'::jsonb, 'ACTIVE'),
    (cat1, '春季新款连衣裙', '优雅气质，百搭时尚',
     'https://picsum.photos/400/400?random=12',
     ARRAY['https://picsum.photos/400/400?random=12']::text[],
     299.00, 599.00, 500, 5600, ARRAY['新品','推荐']::text[],
     '{"品牌":"ZARA","面料":"棉麻"}'::jsonb, 'ACTIVE'),
    -- 运动户外
    (cat2, '专业跑步鞋', '轻便透气，减震舒适',
     'https://picsum.photos/400/400?random=13',
     ARRAY['https://picsum.photos/400/400?random=13']::text[],
     399.00, 799.00, 800, 12000, ARRAY['热卖']::text[],
     '{"品牌":"Adidas"}'::jsonb, 'ACTIVE'),
    (cat2, '运动健身套装', '速干面料，运动必备',
     'https://picsum.photos/400/400?random=14',
     ARRAY['https://picsum.photos/400/400?random=14']::text[],
     259.00, 499.00, 600, 8900, ARRAY['推荐']::text[],
     '{"品牌":"Under Armour"}'::jsonb, 'ACTIVE'),
    -- 美妆护肤
    (cat3, '水润保湿精华液', '深层补水保湿，提亮肤色',
     'https://picsum.photos/400/400?random=15',
     ARRAY['https://picsum.photos/400/400?random=15']::text[],
     299.00, 499.00, 500, 15000, ARRAY['新品','热卖']::text[],
     '{"品牌":"SK-II","规格":"50ml"}'::jsonb, 'ACTIVE'),
    (cat3, '补水保湿面膜', '深层滋养，水润透亮',
     'https://picsum.photos/400/400?random=16',
     ARRAY['https://picsum.photos/400/400?random=16']::text[],
     89.00, 168.00, 1000, 25000, ARRAY['热卖']::text[],
     '{"品牌":"兰芝"}'::jsonb, 'ACTIVE'),
    -- 数码家电
    (cat4, '无线蓝牙耳机', '主动降噪，长续航',
     'https://picsum.photos/400/400?random=17',
     ARRAY['https://picsum.photos/400/400?random=17']::text[],
     199.00, 399.00, 800, 30000, ARRAY['限时优惠']::text[],
     '{"品牌":"Apple"}'::jsonb, 'ACTIVE'),
    (cat4, '智能手环', '运动监测，健康管家',
     'https://picsum.photos/400/400?random=18',
     ARRAY['https://picsum.photos/400/400?random=18']::text[],
     199.00, 399.00, 1000, 18000, ARRAY['新品']::text[],
     '{"品牌":"小米"}'::jsonb, 'ACTIVE'),
    -- 食品生鲜
    (cat5, '进口坚果礼盒', '营养健康，每日坚果',
     'https://picsum.photos/400/400?random=19',
     ARRAY['https://picsum.photos/400/400?random=19']::text[],
     79.00, 158.00, 2000, 35000, ARRAY['热卖']::text[],
     '{"产地":"进口"}'::jsonb, 'ACTIVE'),
    (cat5, '精品咖啡豆', '醇香浓郁，手工烘焙',
     'https://picsum.photos/400/400?random=20',
     ARRAY['https://picsum.photos/400/400?random=20']::text[],
     128.00, 258.00, 800, 12000, ARRAY['推荐']::text[],
     '{"产地":"哥伦比亚"}'::jsonb, 'ACTIVE'),
    -- 额外商品
    (cat1, '休闲T恤套装', '舒适透气，日常百搭',
     'https://picsum.photos/400/400?random=21',
     ARRAY['https://picsum.photos/400/400?random=21']::text[],
     159.00, 299.00, 800, 11000, ARRAY['推荐']::text[],
     '{"品牌":"Uniqlo"}'::jsonb, 'ACTIVE'),
    (cat4, '智能音箱', 'AI语音助手',
     'https://picsum.photos/400/400?random=22',
     ARRAY['https://picsum.photos/400/400?random=22']::text[],
     299.00, 599.00, 600, 9000, ARRAY['新品']::text[],
     '{"品牌":"小米"}'::jsonb, 'ACTIVE');
END $$;

-- 插入优惠券
INSERT INTO "coupons" (name, type, "discountAmount", "minAmount", "totalCount", "receivedCount", "startTime", "endTime", status)
VALUES
  ('新人专享券', 'DISCOUNT', 20.00, 100.00, 10000, 0, NOW(), NOW() + INTERVAL '30 days', 'ACTIVE'),
  ('满减优惠券', 'DISCOUNT', 50.00, 300.00, 5000, 0, NOW(), NOW() + INTERVAL '15 days', 'ACTIVE');

-- ============================================
-- 验证创建的表
-- ============================================
SELECT
  schemaname as "Schema",
  tablename as "Table Name"
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 统计数据
SELECT
  '分类' as "数据类型", COUNT(*)::text as "数量" FROM "categories"
UNION ALL
SELECT '轮播图', COUNT(*)::text FROM "banners"
UNION ALL
SELECT '商品', COUNT(*)::text FROM "products"
UNION ALL
SELECT '优惠券', COUNT(*)::text FROM "coupons";
