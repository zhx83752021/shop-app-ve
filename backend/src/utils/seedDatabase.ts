import { PrismaClient } from '@prisma/client'
import { hashPassword } from './password'
import logger from './logger'

export async function seedDatabase(prisma: PrismaClient): Promise<void> {
  logger.info('开始数据填充...')

  // 创建管理员账号
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: await hashPassword('admin123'),
      nickname: '超级管理员',
      role: 'SUPER_ADMIN'
    }
  })
  logger.info('✓ 管理员账号创建完成: ' + admin.username)

  // 创建测试用户
  const user = await prisma.user.upsert({
    where: { phone: '13800138000' },
    update: {},
    create: {
      phone: '13800138000',
      password: await hashPassword('123456'),
      nickname: '测试用户',
      memberLevel: 'GOLD',
      points: 1000,
      growthValue: 5000
    }
  })
  logger.info('✓ 测试用户创建完成: ' + user.nickname)

  // 检查是否已有分类数据
  const existingCategories = await prisma.category.findMany()
  let categories = existingCategories

  if (existingCategories.length === 0) {
    // 创建商品分类
    categories = await Promise.all([
      prisma.category.create({
        data: {
          name: '时尚服饰',
          icon: '👗',
          sort: 1
        }
      }),
      prisma.category.create({
        data: {
          name: '运动户外',
          icon: '⚽',
          sort: 2
        }
      }),
      prisma.category.create({
        data: {
          name: '美妆护肤',
          icon: '💄',
          sort: 3
        }
      }),
      prisma.category.create({
        data: {
          name: '数码家电',
          icon: '📱',
          sort: 4
        }
      }),
      prisma.category.create({
        data: {
          name: '食品生鲜',
          icon: '🍎',
          sort: 5
        }
      })
    ])
    logger.info(`✓ 创建了 ${categories.length} 个商品分类`)
  } else {
    logger.info(`✓ 已存在 ${categories.length} 个商品分类，跳过创建`)
  }

  // 检查是否已有商品数据
  const existingProducts = await prisma.product.findMany()

  if (existingProducts.length === 0) {
    // 创建示例商品
    const products = await Promise.all([
      prisma.product.create({
        data: {
          categoryId: categories[0].id,
          title: '时尚运动鞋 透气舒适跑步鞋',
          description: '轻便透气，舒适缓震，适合各种运动场景',
          mainImage: 'https://via.placeholder.com/400x400/FFFFFF/000000?text=Nike+Running+Shoes',
          images: [
            'https://via.placeholder.com/400x400/FFFFFF/000000?text=Nike+Running+Shoes',
            'https://via.placeholder.com/400x400/F8F8F8/333333?text=Side+View',
            'https://via.placeholder.com/400x400/F5F5F5/555555?text=Detail+View'
          ],
          price: 599,
          originalPrice: 899,
          stock: 1000,
          sales: 23000,
          tags: ['秒杀', '热卖'],
          params: {
            品牌: 'Nike',
            产地: '中国',
            材质: '网布+橡胶'
          }
        }
      }),
      prisma.product.create({
        data: {
          categoryId: categories[2].id,
          title: '水润保湿精华液 深层补水',
          description: '深层补水保湿，提亮肤色，改善肌肤干燥',
          mainImage: 'https://via.placeholder.com/400x400/FFFFFF/FF69B4?text=SK-II+Serum',
          images: [
            'https://via.placeholder.com/400x400/FFFFFF/FF69B4?text=SK-II+Serum',
            'https://via.placeholder.com/400x400/FFF5F7/FF1493?text=Product+Details'
          ],
          price: 299,
          originalPrice: 499,
          stock: 500,
          sales: 15000,
          tags: ['新品', '热卖'],
          params: {
            品牌: 'SK-II',
            规格: '50ml',
            适用肤质: '所有肤质'
          }
        }
      }),
      prisma.product.create({
        data: {
          categoryId: categories[3].id,
          title: '无线蓝牙耳机 降噪入耳式',
          description: '主动降噪，长续航，高音质',
          mainImage: 'https://via.placeholder.com/400x400/FFFFFF/000000?text=Wireless+Earbuds',
          images: [
            'https://via.placeholder.com/400x400/FFFFFF/000000?text=Wireless+Earbuds',
            'https://via.placeholder.com/400x400/F8F8F8/1A1A1A?text=With+Case',
            'https://via.placeholder.com/400x400/F5F5F5/2C2C2C?text=Close+Up'
          ],
          price: 199,
          originalPrice: 399,
          stock: 800,
          sales: 30000,
          tags: ['限时优惠'],
          params: {
            品牌: 'Apple',
            连接方式: '蓝牙5.3',
            续航时间: '30小时'
          }
        }
      }),
      prisma.product.create({
        data: {
          categoryId: categories[1].id,
          title: '户外登山包 大容量防水背包',
          description: '50L大容量，防水防撕裂，舒适背负系统',
          mainImage: 'https://via.placeholder.com/400x400/FFFFFF/228B22?text=Hiking+Backpack+50L',
          images: [
            'https://via.placeholder.com/400x400/FFFFFF/228B22?text=Hiking+Backpack+50L',
            'https://via.placeholder.com/400x400/F8F8F8/2E8B57?text=Back+View'
          ],
          price: 399,
          originalPrice: 599,
          stock: 300,
          sales: 8000,
          tags: ['新品'],
          params: {
            品牌: 'TheNorthFace',
            容量: '50L',
            材质: '尼龙'
          }
        }
      }),
      prisma.product.create({
        data: {
          categoryId: categories[4].id,
          title: '新鲜水果礼盒 进口车厘子',
          description: '智利进口，JJ级大果，新鲜直达',
          mainImage: 'https://via.placeholder.com/400x400/FFFFFF/DC143C?text=Fresh+Cherries+2kg',
          images: [
            'https://via.placeholder.com/400x400/FFFFFF/DC143C?text=Fresh+Cherries+2kg',
            'https://via.placeholder.com/400x400/FFF5F5/B22222?text=Premium+Quality'
          ],
          price: 199,
          originalPrice: 299,
          stock: 500,
          sales: 12000,
          tags: ['限时优惠', '热卖'],
          params: {
            产地: '智利',
            规格: '2kg/盒',
            等级: 'JJ级'
          }
        }
      })
    ])
    logger.info(`✓ 创建了 ${products.length} 个示例商品`)

    // 创建排行榜数据
    const rankingTypes = ['HOT', 'RATING', 'NEW', 'FAVORITE'];
    const trendTypes = ['UP', 'DOWN', 'UNCHANGED'];

    for (const type of rankingTypes) {
      for (let i = 0; i < products.length; i++) {
        await prisma.ranking.create({
          data: {
            productId: products[i].id,
            type: type as any,
            rank: i + 1,
            score: type === 'HOT' ? products[i].sales :
                   type === 'RATING' ? 4.5 + Math.random() * 0.5 :
                   type === 'NEW' ? Date.now() - i * 86400000 :
                   1000 - i * 100,
            trend: trendTypes[Math.floor(Math.random() * trendTypes.length)] as any,
            lastUpdated: new Date()
          }
        });
      }
    }
    logger.info('✓ 创建了排行榜数据')

    // 创建帖子
    const posts = await Promise.all([
      prisma.post.create({
        data: {
          userId: user.id,
          type: 'IMAGE',
          title: '春季穿搭分享',
          content: '今天分享一套春季穿搭，清新又舒适～',
          images: [
            'https://source.unsplash.com/400x600/?spring-fashion,outfit',
            'https://source.unsplash.com/400x600/?casual-wear,style'
          ],
          viewCount: 5000,
          likeCount: 230,
          commentCount: 56,
          status: 'APPROVED'
        }
      }),
      prisma.post.create({
        data: {
          userId: user.id,
          type: 'IMAGE',
          title: '好物推荐',
          content: '这款精华液真的超好用！用了一周皮肤明显变好了',
          images: ['https://source.unsplash.com/400x600/?skincare-routine,beauty-products'],
          viewCount: 8000,
          likeCount: 450,
          commentCount: 89,
          status: 'APPROVED'
        }
      })
    ])
    logger.info(`✓ 创建了 ${posts.length} 篇帖子`)
  } else {
    logger.info(`✓ 已存在 ${existingProducts.length} 个商品，跳过创建`)
  }

  // 检查是否已有Banner数据
  const existingBanners = await prisma.banner.findMany()

  if (existingBanners.length === 0) {
    const banners = await Promise.all([
      prisma.banner.create({
        data: {
          title: '春季新品大促',
          image: 'https://via.placeholder.com/800x400/FF6B6B/FFFFFF?text=Spring+Sale+-+Up+to+50%+OFF',
          link: '/products',
          position: 'HOME',
          sort: 1
        }
      }),
      prisma.banner.create({
        data: {
          title: '限时秒杀',
          image: 'https://via.placeholder.com/800x400/4ECDC4/FFFFFF?text=Flash+Sale+-+Limited+Time',
          link: '/flash-sale',
          position: 'HOME',
          sort: 2
        }
      }),
      prisma.banner.create({
        data: {
          title: '会员专享',
          image: 'https://via.placeholder.com/800x400/FFD93D/333333?text=VIP+Exclusive+Benefits',
          link: '/vip',
          position: 'HOME',
          sort: 3
        }
      })
    ])
    logger.info(`✓ 创建了 ${banners.length} 个Banner`)
  } else {
    logger.info(`✓ 已存在 ${existingBanners.length} 个Banner，跳过创建`)
  }

  // 检查是否已有优惠券数据
  const existingCoupons = await prisma.coupon.findMany()

  if (existingCoupons.length === 0) {
    const coupons = await Promise.all([
      prisma.coupon.create({
        data: {
          name: '新人专享券',
          type: 'DISCOUNT',
          discountAmount: 20,
          minAmount: 100,
          totalCount: 10000,
          startTime: new Date(),
          endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      }),
      prisma.coupon.create({
        data: {
          name: '满减优惠券',
          type: 'DISCOUNT',
          discountAmount: 50,
          minAmount: 300,
          totalCount: 5000,
          startTime: new Date(),
          endTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        }
      })
    ])
    logger.info(`✓ 创建了 ${coupons.length} 张优惠券`)
  } else {
    logger.info(`✓ 已存在 ${existingCoupons.length} 张优惠券，跳过创建`)
  }

  logger.info('✅ 数据填充完成！')
  logger.info('📝 测试账号信息:')
  logger.info('管理员 - 用户名: admin, 密码: admin123')
  logger.info('用户 - 手机号: 13800138000, 密码: 123456')
}
