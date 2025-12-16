-- Supabase 数据库初始化 SQL
-- 执行方式：在 Supabase Dashboard → SQL Editor 中执行

-- ============================================
-- 1. 创建测试用户
-- ============================================
INSERT INTO "users" (
  id, phone, password, nickname, "memberLevel",
  points, "growthValue", status, "createdAt", "updatedAt"
)
VALUES (
  gen_random_uuid()::text,
  '13800138000',
  -- 密码: 123456 (已哈希)
  '$2a$10$N9qo8uLOickgx2ZMRZRo4OQ3T3f3ZsqQvnr0JvJHB3JJjPIxJm.Hy',
  '测试用户',
  'GOLD',
  1000,
  5000,
  'ACTIVE',
  NOW(),
  NOW()
) ON CONFLICT (phone) DO NOTHING;

-- ============================================
-- 2. 创建商品分类
-- ============================================
INSERT INTO "categories" (id, name, icon, sort, status, "createdAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, '时尚服饰', '👗', 1, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid()::text, '运动户外', '⚽', 2, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid()::text, '美妆个护', '💄', 3, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid()::text, '数码电器', '📱', 4, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid()::text, '食品饮料', '🍔', 5, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid()::text, '家居生活', '🏠', 6, 'ACTIVE', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. 创建示例商品（每个分类2个商品）
-- ============================================
DO $$
DECLARE
  cat_fashion UUID;
  cat_sports UUID;
  cat_beauty UUID;
  cat_digital UUID;
  cat_food UUID;
  cat_home UUID;
BEGIN
  -- 获取分类ID
  SELECT id INTO cat_fashion FROM "categories" WHERE name = '时尚服饰';
  SELECT id INTO cat_sports FROM "categories" WHERE name = '运动户外';
  SELECT id INTO cat_beauty FROM "categories" WHERE name = '美妆个护';
  SELECT id INTO cat_digital FROM "categories" WHERE name = '数码电器';
  SELECT id INTO cat_food FROM "categories" WHERE name = '食品饮料';
  SELECT id INTO cat_home FROM "categories" WHERE name = '家居生活';

  -- 时尚服饰
  INSERT INTO "products" (id, name, subtitle, price, "originalPrice", stock, sales, images, "categoryId", status, "createdAt", "updatedAt")
  VALUES
    (gen_random_uuid(), '春季新款连衣裙', '优雅气质，百搭时尚', 299.00, 599.00, 100, 156,
     ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400']::text[],
     cat_fashion, 'ON_SALE', NOW(), NOW()),
    (gen_random_uuid(), '休闲T恤套装', '舒适透气，日常百搭', 159.00, 299.00, 200, 234,
     ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400']::text[],
     cat_fashion, 'ON_SALE', NOW(), NOW());

  -- 运动户外
  INSERT INTO "products" (id, name, subtitle, price, "originalPrice", stock, sales, images, "categoryId", status, "createdAt", "updatedAt")
  VALUES
    (gen_random_uuid(), '专业跑步鞋', '轻便透气，减震舒适', 399.00, 799.00, 150, 189,
     ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400']::text[],
     cat_sports, 'ON_SALE', NOW(), NOW()),
    (gen_random_uuid(), '运动健身套装', '速干面料，运动必备', 259.00, 499.00, 180, 145,
     ARRAY['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400']::text[],
     cat_sports, 'ON_SALE', NOW(), NOW());

  -- 美妆个护
  INSERT INTO "products" (id, name, subtitle, price, "originalPrice", stock, sales, images, "categoryId", status, "createdAt", "updatedAt")
  VALUES
    (gen_random_uuid(), '补水保湿面膜', '深层滋养，水润透亮', 89.00, 168.00, 300, 567,
     ARRAY['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400']::text[],
     cat_beauty, 'ON_SALE', NOW(), NOW()),
    (gen_random_uuid(), '口红礼盒套装', '多色可选，持久显色', 199.00, 368.00, 120, 423,
     ARRAY['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400']::text[],
     cat_beauty, 'ON_SALE', NOW(), NOW());

  -- 数码电器
  INSERT INTO "products" (id, name, subtitle, price, "originalPrice", stock, sales, images, "categoryId", status, "createdAt", "updatedAt")
  VALUES
    (gen_random_uuid(), '无线蓝牙耳机', '降噪通话，长续航', 299.00, 599.00, 200, 345,
     ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400']::text[],
     cat_digital, 'ON_SALE', NOW(), NOW()),
    (gen_random_uuid(), '智能手环', '运动监测，健康管家', 199.00, 399.00, 250, 289,
     ARRAY['https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=400']::text[],
     cat_digital, 'ON_SALE', NOW(), NOW());

  -- 食品饮料
  INSERT INTO "products" (id, name, subtitle, price, "originalPrice", stock, sales, images, "categoryId", status, "createdAt", "updatedAt")
  VALUES
    (gen_random_uuid(), '进口坚果礼盒', '营养健康，每日坚果', 79.00, 158.00, 500, 678,
     ARRAY['https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400']::text[],
     cat_food, 'ON_SALE', NOW(), NOW()),
    (gen_random_uuid(), '精品咖啡豆', '醇香浓郁，手工烘焙', 128.00, 258.00, 300, 234,
     ARRAY['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400']::text[],
     cat_food, 'ON_SALE', NOW(), NOW());

  -- 家居生活
  INSERT INTO "products" (id, name, subtitle, price, "originalPrice", stock, sales, images, "categoryId", status, "createdAt", "updatedAt")
  VALUES
    (gen_random_uuid(), '北欧风台灯', '简约设计，护眼光源', 189.00, 368.00, 150, 167,
     ARRAY['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400']::text[],
     cat_home, 'ON_SALE', NOW(), NOW()),
    (gen_random_uuid(), '四件套床品', '纯棉亲肤，舒适透气', 299.00, 588.00, 200, 234,
     ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400']::text[],
     cat_home, 'ON_SALE', NOW(), NOW());
END $$;

-- ============================================
-- 4. 创建轮播图
-- ============================================
INSERT INTO "banners" (id, title, image, link, sort, status, "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), '新品上市',
   'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
   '/category', 1, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid(), '限时特惠',
   'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop',
   '/flash-sale', 2, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid(), '会员专享',
   'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=400&fit=crop',
   '/member', 3, 'ACTIVE', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. 创建优惠券
-- ============================================
INSERT INTO "coupons" (
  id, name, type, "discountAmount", "minAmount", "totalCount",
  "receivedCount", "startTime", "endTime", status, "createdAt", "updatedAt"
)
VALUES
  (gen_random_uuid(), '新人专享券', 'FULL_DISCOUNT', 10.00, 50.00, 1000, 0,
   NOW(), NOW() + INTERVAL '30 days', 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid(), '满100减20', 'FULL_DISCOUNT', 20.00, 100.00, 500, 0,
   NOW(), NOW() + INTERVAL '30 days', 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid(), '满200减50', 'FULL_DISCOUNT', 50.00, 200.00, 300, 0,
   NOW(), NOW() + INTERVAL '30 days', 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid(), '限时9折券', 'DISCOUNT_RATE', 0.90, 0.00, 800, 0,
   NOW(), NOW() + INTERVAL '7 days', 'ACTIVE', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 查询统计结果
-- ============================================
SELECT
  '用户' as "表名", COUNT(*)::text as "记录数" FROM "users"
UNION ALL
SELECT '分类', COUNT(*)::text FROM "categories"
UNION ALL
SELECT '商品', COUNT(*)::text FROM "products"
UNION ALL
SELECT '轮播图', COUNT(*)::text FROM "banners"
UNION ALL
SELECT '优惠券', COUNT(*)::text FROM "coupons";
