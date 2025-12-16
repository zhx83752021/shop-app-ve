-- 数据库初始化 SQL
-- 适用于 Supabase PostgreSQL

-- 1. 创建测试用户
INSERT INTO "User" (id, phone, password, nickname, "memberLevel", points, "growthValue", status, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  '13800138000',
  '$2a$10$YourHashedPasswordHere',  -- 需要替换为实际的密码哈希
  '测试用户',
  'GOLD',
  1000,
  5000,
  'ACTIVE',
  NOW(),
  NOW()
) ON CONFLICT (phone) DO NOTHING;

-- 2. 创建商品分类
INSERT INTO "Category" (id, name, icon, sort, status, "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), '时尚服饰', '👗', 1, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid(), '运动户外', '⚽', 2, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid(), '美妆个护', '💄', 3, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid(), '数码电器', '📱', 4, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid(), '食品饮料', '🍔', 5, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid(), '家居生活', '🏠', 6, 'ACTIVE', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 3. 创建示例商品
WITH categories AS (
  SELECT id, name FROM "Category" ORDER BY sort LIMIT 6
)
INSERT INTO "Product" (
  id, name, subtitle, price, "originalPrice", stock, sales, images,
  "categoryId", status, "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid(),
  '示例商品 - ' || c.name,
  '精选优质商品，限时特惠',
  99.00,
  199.00,
  100,
  0,
  ARRAY['https://via.placeholder.com/400x400?text=Product']::text[],
  c.id,
  'ON_SALE',
  NOW(),
  NOW()
FROM categories c
ON CONFLICT DO NOTHING;

-- 4. 创建轮播图
INSERT INTO "Banner" (id, title, image, link, sort, status, "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), '新品上市', 'https://via.placeholder.com/800x400?text=Banner1', '/category', 1, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid(), '限时特惠', 'https://via.placeholder.com/800x400?text=Banner2', '/flash-sale', 2, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid(), '会员专享', 'https://via.placeholder.com/800x400?text=Banner3', '/member', 3, 'ACTIVE', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 5. 创建优惠券
INSERT INTO "Coupon" (
  id, name, type, "discountAmount", "minAmount", "totalCount",
  "receivedCount", "startTime", "endTime", status, "createdAt", "updatedAt"
)
VALUES
  (
    gen_random_uuid(),
    '新人专享券',
    'FULL_DISCOUNT',
    10.00,
    50.00,
    1000,
    0,
    NOW(),
    NOW() + INTERVAL '30 days',
    'ACTIVE',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    '满减优惠券',
    'FULL_DISCOUNT',
    50.00,
    200.00,
    500,
    0,
    NOW(),
    NOW() + INTERVAL '30 days',
    'ACTIVE',
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

-- 查询结果
SELECT 'Users' as table_name, COUNT(*) as count FROM "User"
UNION ALL
SELECT 'Categories', COUNT(*) FROM "Category"
UNION ALL
SELECT 'Products', COUNT(*) FROM "Product"
UNION ALL
SELECT 'Banners', COUNT(*) FROM "Banner"
UNION ALL
SELECT 'Coupons', COUNT(*) FROM "Coupon";
