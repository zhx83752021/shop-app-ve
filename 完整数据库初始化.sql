-- ============================================
-- 完整数据库初始化脚本
-- 包含：建表 + 插入数据
-- 在 Supabase SQL Editor 中执行
-- ============================================

-- ============================================
-- 第一步：删除旧表（如果存在）
-- ============================================
DROP TABLE IF EXISTS "follows" CASCADE;
DROP TABLE IF EXISTS "post_likes" CASCADE;
DROP TABLE IF EXISTS "comments" CASCADE;
DROP TABLE IF EXISTS "posts" CASCADE;
DROP TABLE IF EXISTS "refunds" CASCADE;
DROP TABLE IF EXISTS "browse_histories" CASCADE;
DROP TABLE IF EXISTS "favorites" CASCADE;
DROP TABLE IF EXISTS "banners" CASCADE;
DROP TABLE IF EXISTS "user_coupons" CASCADE;
DROP TABLE IF EXISTS "coupons" CASCADE;
DROP TABLE IF EXISTS "cart_items" CASCADE;
DROP TABLE IF EXISTS "order_items" CASCADE;
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TABLE IF EXISTS "products" CASCADE;
DROP TABLE IF EXISTS "categories" CASCADE;
DROP TABLE IF EXISTS "admins" CASCADE;
DROP TABLE IF EXISTS "addresses" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- 删除枚举类型
DROP TYPE IF EXISTS "Gender" CASCADE;
DROP TYPE IF EXISTS "MemberLevel" CASCADE;
DROP TYPE IF EXISTS "UserStatus" CASCADE;
DROP TYPE IF EXISTS "AdminRole" CASCADE;
DROP TYPE IF EXISTS "Status" CASCADE;
DROP TYPE IF EXISTS "OrderStatus" CASCADE;
DROP TYPE IF EXISTS "PaymentMethod" CASCADE;
DROP TYPE IF EXISTS "PaymentStatus" CASCADE;
DROP TYPE IF EXISTS "CouponType" CASCADE;
DROP TYPE IF EXISTS "RefundStatus" CASCADE;
DROP TYPE IF EXISTS "BannerPosition" CASCADE;
DROP TYPE IF EXISTS "PostType" CASCADE;
DROP TYPE IF EXISTS "PostStatus" CASCADE;
DROP TYPE IF EXISTS "RankingType" CASCADE;
DROP TYPE IF EXISTS "TrendType" CASCADE;

-- ============================================
-- 第二步：创建枚举类型
-- ============================================
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');
CREATE TYPE "MemberLevel" AS ENUM ('NORMAL', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND');
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BANNED');
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'OPERATOR');
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING_PAYMENT', 'PENDING_SHIPMENT', 'SHIPPED', 'COMPLETED', 'CANCELLED', 'REFUNDING', 'REFUNDED');
CREATE TYPE "PaymentMethod" AS ENUM ('WECHAT', 'ALIPAY', 'BALANCE');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
CREATE TYPE "CouponType" AS ENUM ('DISCOUNT', 'FULL_DISCOUNT');
CREATE TYPE "RefundStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');
CREATE TYPE "BannerPosition" AS ENUM ('HOME', 'DISCOVER', 'PROFILE');
CREATE TYPE "PostType" AS ENUM ('IMAGE', 'VIDEO', 'TEXT');
CREATE TYPE "PostStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "RankingType" AS ENUM ('HOT', 'RATING', 'NEW', 'FAVORITE');
CREATE TYPE "TrendType" AS ENUM ('UP', 'DOWN', 'UNCHANGED');

-- ============================================
-- 第三步：创建表结构
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

-- 管理员表
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

-- 分类表
CREATE TABLE "categories" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "name" VARCHAR(50) NOT NULL,
  "icon" VARCHAR(100),
  "parentId" TEXT,
  "sort" INTEGER DEFAULT 0,
  "status" "Status" DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- 商品表
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

-- 轮播图表
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

-- 优惠券表
CREATE TABLE "coupons" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "name" VARCHAR(100) NOT NULL,
  "type" "CouponType" NOT NULL,
  "discountAmount" DECIMAL(10,2) DEFAULT 0,
  "minAmount" DECIMAL(10,2) DEFAULT 0,
  "totalCount" INTEGER NOT NULL,
  "receivedCount" INTEGER DEFAULT 0,
  "startTime" TIMESTAMP(3) NOT NULL,
  "endTime" TIMESTAMP(3) NOT NULL,
  "status" "Status" DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 第四步：插入初始数据
-- ============================================

-- 插入分类
INSERT INTO "categories" (id, name, icon, sort, status, "createdAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, '时尚服饰', '👗', 1, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid()::text, '运动户外', '⚽', 2, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid()::text, '美妆护肤', '💄', 3, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid()::text, '数码家电', '📱', 4, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid()::text, '食品生鲜', '🍎', 5, 'ACTIVE', NOW(), NOW());

-- 插入轮播图
INSERT INTO "banners" (id, title, image, link, position, sort, status, "createdAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, '春季新品大促',
   'https://picsum.photos/800/400?random=1',
   '/products', 'HOME', 1, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid()::text, '限时秒杀',
   'https://picsum.photos/800/400?random=2',
   '/flash-sale', 'HOME', 2, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid()::text, '会员专享',
   'https://picsum.photos/800/400?random=3',
   '/vip', 'HOME', 3, 'ACTIVE', NOW(), NOW());

-- 插入商品
DO $$
DECLARE
  cat1 TEXT;
  cat2 TEXT;
  cat3 TEXT;
  cat4 TEXT;
  cat5 TEXT;
BEGIN
  -- 获取分类ID
  SELECT id INTO cat1 FROM "categories" WHERE name = '时尚服饰' LIMIT 1;
  SELECT id INTO cat2 FROM "categories" WHERE name = '运动户外' LIMIT 1;
  SELECT id INTO cat3 FROM "categories" WHERE name = '美妆护肤' LIMIT 1;
  SELECT id INTO cat4 FROM "categories" WHERE name = '数码家电' LIMIT 1;
  SELECT id INTO cat5 FROM "categories" WHERE name = '食品生鲜' LIMIT 1;

  -- 时尚服饰商品
  INSERT INTO "products" ("categoryId", title, description, "mainImage", images, price, "originalPrice", stock, sales, tags, params, status, "createdAt", "updatedAt")
  VALUES
    (cat1, '时尚运动鞋 透气舒适跑步鞋', '轻便透气，舒适缓震，适合各种运动场景',
     'https://picsum.photos/400/400?random=10',
     ARRAY['https://picsum.photos/400/400?random=10','https://picsum.photos/400/400?random=11']::text[],
     599.00, 899.00, 1000, 23000, ARRAY['秒杀','热卖']::text[],
     '{"品牌":"Nike","产地":"中国","材质":"网布+橡胶"}'::jsonb, 'ACTIVE', NOW(), NOW()),
    (cat1, '春季新款连衣裙', '优雅气质，百搭时尚',
     'https://picsum.photos/400/400?random=12',
     ARRAY['https://picsum.photos/400/400?random=12']::text[],
     299.00, 599.00, 500, 5600, ARRAY['新品','推荐']::text[],
     '{"品牌":"ZARA","面料":"棉麻","风格":"休闲"}'::jsonb, 'ACTIVE', NOW(), NOW());

  -- 运动户外商品
  INSERT INTO "products" ("categoryId", title, description, "mainImage", images, price, "originalPrice", stock, sales, tags, params, status, "createdAt", "updatedAt")
  VALUES
    (cat2, '专业跑步鞋', '轻便透气，减震舒适',
     'https://picsum.photos/400/400?random=13',
     ARRAY['https://picsum.photos/400/400?random=13']::text[],
     399.00, 799.00, 800, 12000, ARRAY['热卖']::text[],
     '{"品牌":"Adidas","尺码":"40-44"}'::jsonb, 'ACTIVE', NOW(), NOW()),
    (cat2, '运动健身套装', '速干面料，运动必备',
     'https://picsum.photos/400/400?random=14',
     ARRAY['https://picsum.photos/400/400?random=14']::text[],
     259.00, 499.00, 600, 8900, ARRAY['推荐']::text[],
     '{"品牌":"Under Armour","材质":"聚酯纤维"}'::jsonb, 'ACTIVE', NOW(), NOW());

  -- 美妆护肤商品
  INSERT INTO "products" ("categoryId", title, description, "mainImage", images, price, "originalPrice", stock, sales, tags, params, status, "createdAt", "updatedAt")
  VALUES
    (cat3, '水润保湿精华液 深层补水', '深层补水保湿，提亮肤色，改善肌肤干燥',
     'https://picsum.photos/400/400?random=15',
     ARRAY['https://picsum.photos/400/400?random=15','https://picsum.photos/400/400?random=16']::text[],
     299.00, 499.00, 500, 15000, ARRAY['新品','热卖']::text[],
     '{"品牌":"SK-II","规格":"50ml","适用肤质":"所有肤质"}'::jsonb, 'ACTIVE', NOW(), NOW()),
    (cat3, '补水保湿面膜', '深层滋养，水润透亮',
     'https://picsum.photos/400/400?random=17',
     ARRAY['https://picsum.photos/400/400?random=17']::text[],
     89.00, 168.00, 1000, 25000, ARRAY['热卖']::text[],
     '{"品牌":"兰芝","规格":"10片装"}'::jsonb, 'ACTIVE', NOW(), NOW());

  -- 数码家电商品
  INSERT INTO "products" ("categoryId", title, description, "mainImage", images, price, "originalPrice", stock, sales, tags, params, status, "createdAt", "updatedAt")
  VALUES
    (cat4, '无线蓝牙耳机 降噪入耳式', '主动降噪，长续航，高音质',
     'https://picsum.photos/400/400?random=18',
     ARRAY['https://picsum.photos/400/400?random=18','https://picsum.photos/400/400?random=19']::text[],
     199.00, 399.00, 800, 30000, ARRAY['限时优惠']::text[],
     '{"品牌":"Apple","连接方式":"蓝牙5.3","续航时间":"30小时"}'::jsonb, 'ACTIVE', NOW(), NOW()),
    (cat4, '智能手环', '运动监测，健康管家',
     'https://picsum.photos/400/400?random=20',
     ARRAY['https://picsum.photos/400/400?random=20']::text[],
     199.00, 399.00, 1000, 18000, ARRAY['新品']::text[],
     '{"品牌":"小米","屏幕":"OLED"}'::jsonb, 'ACTIVE', NOW(), NOW());

  -- 食品生鲜商品
  INSERT INTO "products" ("categoryId", title, description, "mainImage", images, price, "originalPrice", stock, sales, tags, params, status, "createdAt", "updatedAt")
  VALUES
    (cat5, '进口坚果礼盒', '营养健康，每日坚果',
     'https://picsum.photos/400/400?random=21',
     ARRAY['https://picsum.photos/400/400?random=21']::text[],
     79.00, 158.00, 2000, 35000, ARRAY['热卖']::text[],
     '{"产地":"进口","净含量":"1000g"}'::jsonb, 'ACTIVE', NOW(), NOW()),
    (cat5, '精品咖啡豆', '醇香浓郁，手工烘焙',
     'https://picsum.photos/400/400?random=22',
     ARRAY['https://picsum.photos/400/400?random=22']::text[],
     128.00, 258.00, 800, 12000, ARRAY['推荐']::text[],
     '{"产地":"哥伦比亚","烘焙度":"中度"}'::jsonb, 'ACTIVE', NOW(), NOW());

  -- 再添加2个热门商品
  INSERT INTO "products" ("categoryId", title, description, "mainImage", images, price, "originalPrice", stock, sales, tags, params, status, "createdAt", "updatedAt")
  VALUES
    (cat1, '休闲T恤套装', '舒适透气，日常百搭',
     'https://picsum.photos/400/400?random=23',
     ARRAY['https://picsum.photos/400/400?random=23']::text[],
     159.00, 299.00, 800, 11000, ARRAY['推荐']::text[],
     '{"品牌":"Uniqlo","面料":"纯棉"}'::jsonb, 'ACTIVE', NOW(), NOW()),
    (cat4, '智能音箱', 'AI语音助手，智能家居控制',
     'https://picsum.photos/400/400?random=24',
     ARRAY['https://picsum.photos/400/400?random=24']::text[],
     299.00, 599.00, 600, 9000, ARRAY['新品','智能']::text[],
     '{"品牌":"小米","功能":"语音控制"}'::jsonb, 'ACTIVE', NOW(), NOW());
END $$;

-- 插入优惠券
INSERT INTO "coupons" (
  id, name, type, "discountAmount", "minAmount", "totalCount",
  "receivedCount", "startTime", "endTime", status, "createdAt", "updatedAt"
)
VALUES
  (gen_random_uuid()::text, '新人专享券', 'DISCOUNT', 20.00, 100.00, 10000, 0,
   NOW(), NOW() + INTERVAL '30 days', 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid()::text, '满减优惠券', 'DISCOUNT', 50.00, 300.00, 5000, 0,
   NOW(), NOW() + INTERVAL '15 days', 'ACTIVE', NOW(), NOW());

-- ============================================
-- 验证数据
-- ============================================
SELECT
  '分类' as "表名", COUNT(*)::text as "记录数" FROM "categories"
UNION ALL
SELECT '轮播图', COUNT(*)::text FROM "banners"
UNION ALL
SELECT '商品', COUNT(*)::text FROM "products"
UNION ALL
SELECT '优惠券', COUNT(*)::text FROM "coupons";
