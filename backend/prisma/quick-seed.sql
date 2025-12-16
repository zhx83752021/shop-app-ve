-- 快速数据初始化 SQL
-- 适用于 Supabase，字段名与 Prisma schema 完全匹配
-- 在 Supabase Dashboard → SQL Editor 中执行

-- ============================================
-- 1. 创建商品分类
-- ============================================
INSERT INTO "categories" (id, name, icon, sort, status, "createdAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, '时尚服饰', '👗', 1, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid()::text, '运动户外', '⚽', 2, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid()::text, '美妆护肤', '💄', 3, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid()::text, '数码家电', '📱', 4, 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid()::text, '食品生鲜', '🍎', 5, 'ACTIVE', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 2. 创建轮播图（重要！）
-- ============================================
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
   '/vip', 'HOME', 3, 'ACTIVE', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. 创建示例商品（每个分类2个商品）
-- ============================================
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

  -- 时尚服饰
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

  -- 运动户外
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

  -- 美妆护肤
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

  -- 数码家电
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

  -- 食品生鲜
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
END $$;

-- ============================================
-- 查询统计结果
-- ============================================
SELECT
  '分类' as "表名", COUNT(*)::text as "记录数" FROM "categories"
UNION ALL
SELECT '轮播图', COUNT(*)::text FROM "banners"
UNION ALL
SELECT '商品', COUNT(*)::text FROM "products";
