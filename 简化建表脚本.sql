-- 简化版建表脚本 - 只创建核心表
-- 适用于 Supabase PostgreSQL

-- 删除旧表（如果存在）
DROP TABLE IF EXISTS "banners" CASCADE;
DROP TABLE IF EXISTS "products" CASCADE;
DROP TABLE IF EXISTS "categories" CASCADE;
DROP TABLE IF EXISTS "coupons" CASCADE;

-- 删除旧的枚举类型（如果存在）
DROP TYPE IF EXISTS "Status" CASCADE;

-- 创建枚举类型
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- 1. 分类表
CREATE TABLE "categories" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "name" VARCHAR(50) NOT NULL,
  "icon" VARCHAR(100),
  "image" VARCHAR(500),
  "parentId" TEXT,
  "sort" INTEGER DEFAULT 0,
  "status" "Status" DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL
);

-- 2. 商品表
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

-- 3. 轮播图表
CREATE TABLE "banners" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "title" VARCHAR(100) NOT NULL,
  "image" VARCHAR(500) NOT NULL,
  "link" VARCHAR(500),
  "sort" INTEGER DEFAULT 0,
  "status" "Status" DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- 4. 优惠券表
CREATE TABLE "coupons" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "name" VARCHAR(100) NOT NULL,
  "type" VARCHAR(20) NOT NULL,
  "discountAmount" DECIMAL(10,2) NOT NULL,
  "minAmount" DECIMAL(10,2) NOT NULL,
  "totalCount" INTEGER NOT NULL,
  "receivedCount" INTEGER DEFAULT 0,
  "startTime" TIMESTAMP(3) NOT NULL,
  "endTime" TIMESTAMP(3) NOT NULL,
  "status" "Status" DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX "categories_status_idx" ON "categories"("status");
CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");
CREATE INDEX "products_status_idx" ON "products"("status");
CREATE INDEX "banners_status_idx" ON "banners"("status");

-- ============================================
-- 插入测试数据
-- ============================================

-- 插入分类数据
INSERT INTO "categories" (id, name, icon, image, sort, status)
VALUES
  ('cat-1', '时尚服饰', '👔', 'https://picsum.photos/200/200?random=1', 1, 'ACTIVE'),
  ('cat-2', '数码电器', '📱', 'https://picsum.photos/200/200?random=2', 2, 'ACTIVE'),
  ('cat-3', '美妆护肤', '💄', 'https://picsum.photos/200/200?random=3', 3, 'ACTIVE'),
  ('cat-4', '家居生活', '🏠', 'https://picsum.photos/200/200?random=4', 4, 'ACTIVE'),
  ('cat-5', '食品饮料', '🍔', 'https://picsum.photos/200/200?random=5', 5, 'ACTIVE');

-- 插入轮播图数据
INSERT INTO "banners" (title, image, link, sort, status)
VALUES
  ('春季新品大促', 'https://picsum.photos/800/400?random=1', '/products', 1, 'ACTIVE'),
  ('限时秒杀', 'https://picsum.photos/800/400?random=2', '/flash-sale', 2, 'ACTIVE'),
  ('会员专享', 'https://picsum.photos/800/400?random=3', '/membership', 3, 'ACTIVE');

-- 插入商品数据
INSERT INTO "products" (
  "categoryId", "title", "description", "mainImage", "images",
  "price", "originalPrice", "stock", "sales", "tags", "params", "status"
)
VALUES
  ('cat-1', '纯棉T恤', '舒适透气，日常百搭',
   'https://picsum.photos/400/400?random=11',
   ARRAY['https://picsum.photos/400/400?random=11']::text[],
   89.00, 159.00, 1000, 5230, ARRAY['热卖', '新品']::text[],
   '{"材质":"纯棉","产地":"中国"}'::jsonb, 'ACTIVE'),

  ('cat-2', 'iPhone 15 Pro', '强大的A17芯片',
   'https://picsum.photos/400/400?random=12',
   ARRAY['https://picsum.photos/400/400?random=12']::text[],
   8999.00, 9999.00, 500, 3200, ARRAY['新品', '热卖']::text[],
   '{"品牌":"Apple","存储":"256GB"}'::jsonb, 'ACTIVE'),

  ('cat-3', '保湿面霜', '深层补水，持久保湿',
   'https://picsum.photos/400/400?random=13',
   ARRAY['https://picsum.photos/400/400?random=13']::text[],
   299.00, 499.00, 2000, 8900, ARRAY['热卖']::text[],
   '{"品牌":"SK-II","容量":"50ml"}'::jsonb, 'ACTIVE'),

  ('cat-4', '智能扫地机器人', '自动清扫，智能避障',
   'https://picsum.photos/400/400?random=14',
   ARRAY['https://picsum.photos/400/400?random=14']::text[],
   1999.00, 2999.00, 800, 4560, ARRAY['新品']::text[],
   '{"品牌":"小米","容量":"5000mAh"}'::jsonb, 'ACTIVE'),

  ('cat-5', '进口红酒', '法国原瓶进口',
   'https://picsum.photos/400/400?random=15',
   ARRAY['https://picsum.photos/400/400?random=15']::text[],
   399.00, 699.00, 500, 2340, ARRAY['推荐']::text[],
   '{"产地":"法国","年份":"2020"}'::jsonb, 'ACTIVE'),

  ('cat-1', '牛仔裤', '修身显瘦，弹力舒适',
   'https://picsum.photos/400/400?random=16',
   ARRAY['https://picsum.photos/400/400?random=16']::text[],
   199.00, 399.00, 1500, 6780, ARRAY['热卖']::text[],
   '{"品牌":"Levi''s","尺码":"M"}'::jsonb, 'ACTIVE'),

  ('cat-2', '无线蓝牙耳机', '降噪通话，长续航',
   'https://picsum.photos/400/400?random=17',
   ARRAY['https://picsum.photos/400/400?random=17']::text[],
   599.00, 999.00, 1200, 7890, ARRAY['新品', '推荐']::text[],
   '{"品牌":"索尼","续航":"30h"}'::jsonb, 'ACTIVE'),

  ('cat-3', '口红套装', '持久不脱色，滋润保湿',
   'https://picsum.photos/400/400?random=18',
   ARRAY['https://picsum.photos/400/400?random=18']::text[],
   399.00, 699.00, 3000, 12000, ARRAY['热卖', '推荐']::text[],
   '{"品牌":"YSL","数量":"3支"}'::jsonb, 'ACTIVE'),

  ('cat-4', '北欧风台灯', '护眼柔光，触摸调光',
   'https://picsum.photos/400/400?random=19',
   ARRAY['https://picsum.photos/400/400?random=19']::text[],
   159.00, 299.00, 2000, 5600, ARRAY['推荐']::text[],
   '{"功率":"12W","色温":"3000K"}'::jsonb, 'ACTIVE'),

  ('cat-5', '有机咖啡豆', '醇香浓郁，手工烘焙',
   'https://picsum.photos/400/400?random=20',
   ARRAY['https://picsum.photos/400/400?random=20']::text[],
   128.00, 258.00, 800, 3400, ARRAY['新品']::text[],
   '{"产地":"哥伦比亚","净重":"500g"}'::jsonb, 'ACTIVE'),

  ('cat-2', '平板电脑', '大屏娱乐，办公学习',
   'https://picsum.photos/400/400?random=21',
   ARRAY['https://picsum.photos/400/400?random=21']::text[],
   2999.00, 3999.00, 600, 2100, ARRAY['新品']::text[],
   '{"品牌":"iPad","存储":"128GB"}'::jsonb, 'ACTIVE'),

  ('cat-1', '运动鞋', '透气网面，缓震舒适',
   'https://picsum.photos/400/400?random=22',
   ARRAY['https://picsum.photos/400/400?random=22']::text[],
   499.00, 899.00, 1800, 9000, ARRAY['热卖']::text[],
   '{"品牌":"Nike","尺码":"42"}'::jsonb, 'ACTIVE');

-- 插入优惠券数据
INSERT INTO "coupons" (name, type, "discountAmount", "minAmount", "totalCount", "receivedCount", "startTime", "endTime", status)
VALUES
  ('新人专享券', 'DISCOUNT', 20.00, 100.00, 10000, 0, NOW(), NOW() + INTERVAL '30 days', 'ACTIVE'),
  ('满减优惠券', 'DISCOUNT', 50.00, 300.00, 5000, 0, NOW(), NOW() + INTERVAL '15 days', 'ACTIVE');

-- 验证创建的表
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
