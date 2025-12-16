import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/utils/password'

// 加载环境变量
config()

const prisma = new PrismaClient()

async function main() {
  console.log('开始数据填充...')

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
  console.log('✓ 管理员账号创建完成:', admin.username)

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
  console.log('✓ 测试用户创建完成:', user.nickname)

  // 创建商品分类
  const categories = await Promise.all([
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
  console.log(`✓ 创建了 ${categories.length} 个商品分类`)

  // 创建示例商品
  const products = await Promise.all([
    prisma.product.create({
      data: {
        categoryId: categories[0].id,
        title: '时尚运动鞋 透气舒适跑步鞋',
        description: '轻便透气，舒适缓震，适合各种运动场景',
        mainImage: 'https://picsum.photos/400/400?random=1',
        images: [
          'https://picsum.photos/400/400?random=1',
          'https://picsum.photos/400/400?random=2',
          'https://picsum.photos/400/400?random=3'
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
        mainImage: 'https://picsum.photos/400/400?random=4',
        images: [
          'https://picsum.photos/400/400?random=4',
          'https://picsum.photos/400/400?random=5'
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
        mainImage: 'https://picsum.photos/400/400?random=6',
        images: [
          'https://picsum.photos/400/400?random=6',
          'https://picsum.photos/400/400?random=7',
          'https://picsum.photos/400/400?random=8'
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
    })
  ])
  console.log(`✓ 创建了 ${products.length} 个示例商品`)

  // 创建Banner
  const banners = await Promise.all([
    prisma.banner.create({
      data: {
        title: '春季新品大促',
        image: 'https://picsum.photos/800/400?random=10',
        link: '/products',
        position: 'HOME',
        sort: 1
      }
    }),
    prisma.banner.create({
      data: {
        title: '限时秒杀',
        image: 'https://picsum.photos/800/400?random=11',
        link: '/flash-sale',
        position: 'HOME',
        sort: 2
      }
    }),
    prisma.banner.create({
      data: {
        title: '会员专享',
        image: 'https://picsum.photos/800/400?random=12',
        link: '/vip',
        position: 'HOME',
        sort: 3
      }
    })
  ])
  console.log(`✓ 创建了 ${banners.length} 个Banner`)

  // 创建优惠券
  const coupons = await Promise.all([
    prisma.coupon.create({
      data: {
        name: '新人专享券',
        type: 'DISCOUNT',
        discountAmount: 20,
        minAmount: 100,
        totalCount: 10000,
        startTime: new Date(),
        endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30天后
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
        endTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15天后
      }
    })
  ])
  console.log(`✓ 创建了 ${coupons.length} 张优惠券`)

  // 创建测试帖子
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        userId: user.id,
        type: 'IMAGE',
        title: '春季穿搭分享',
        content: '今天分享一套春季穿搭，清新又舒适～',
        images: [
          'https://picsum.photos/400/600?random=20',
          'https://picsum.photos/400/600?random=21'
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
        images: ['https://picsum.photos/400/600?random=22'],
        viewCount: 8000,
        likeCount: 450,
        commentCount: 89,
        status: 'APPROVED'
      }
    })
  ])
  console.log(`✓ 创建了 ${posts.length} 篇帖子`)

  // 创建排行榜数据
  const rankingTypes = ['HOT', 'RATING', 'NEW', 'FAVORITE'];
  const trendTypes = ['UP', 'DOWN', 'UNCHANGED'];

  // 删除现有排行榜数据
  await prisma.ranking.deleteMany();

  // 为每种排行榜创建数据
  for (const type of rankingTypes) {
    // 为每个产品创建排行榜
    for (let i = 0; i < products.length; i++) {
      await prisma.ranking.create({
        data: {
          productId: products[i].id,
          type: type as any,
          rank: i + 1,
          score: type === 'HOT' ? products[i].sales :
                 type === 'RATING' ? 4.5 + Math.random() * 0.5 :
                 type === 'NEW' ? Date.now() - i * 86400000 :
                 1000 - i * 100, // FAVORITE
          trend: trendTypes[Math.floor(Math.random() * trendTypes.length)] as any,
          lastUpdated: new Date()
        }
      });
    }
  }
  console.log('✓ 创建了排行榜数据')

  console.log('\n✅ 数据填充完成！')
  console.log('\n📝 测试账号信息:')
  console.log('管理员 - 用户名: admin, 密码: admin123')
  console.log('用户 - 手机号: 13800138000, 密码: 123456')
}

main()
  .catch((e) => {
    console.error('❌ 数据填充失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
