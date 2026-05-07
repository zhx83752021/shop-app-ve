import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/utils/password'

// 加载环境变量
config()

const prisma = new PrismaClient()

async function main() {
  console.log('开始数据填充...')

  // 创建管理员账号 (官方精选)
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: await hashPassword('admin123'),
      nickname: '官方精选',
      role: 'SUPER_ADMIN',
      avatar: 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
    }
  })
  console.log('✓ 管理员账号创建完成:', admin.username)

  // 创建测试用户 (中国人形象)
  const user = await prisma.user.upsert({
    where: { phone: '13800138000' },
    update: {
      nickname: '林夕的日常',
      avatar: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
    },
    create: {
      phone: '13800138000',
      password: await hashPassword('123456'),
      nickname: '林夕的日常',
      memberLevel: 'GOLD',
      points: 1000,
      growthValue: 5000,
      avatar: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
    }
  })
  console.log('✓ 测试用户创建完成:', user.nickname)

  // 清理现有业务数据 (按照外键依赖的反序清理)
  await prisma.liveProduct.deleteMany()
  await prisma.liveStream.deleteMany()
  await prisma.banner.deleteMany()
  await prisma.ranking.deleteMany()
  await prisma.postLike.deleteMany()
  await prisma.postProduct.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.follow.deleteMany()
  await prisma.userCoupon.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.browseHistory.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.address.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.refund.deleteMany()
  await prisma.order.deleteMany()
  await prisma.sku.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  console.log('✓ 成功清理了旧的业务数据 (级联关系已处理)')

  // 创建收货地址
  await prisma.address.create({
    data: {
      userId: user.id,
      receiverName: '林小姐',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '粤海街道大冲商务中心',
      isDefault: true
    }
  })
  console.log('✓ 收货地址填充完成')

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
        mainImage: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        images: [
          'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
          'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
          'https://images.pexels.com/photos/2048548/pexels-photo-2048548.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop'
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
        mainImage: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        images: [
          'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
          'https://images.pexels.com/photos/2693617/pexels-photo-2693617.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop'
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
        mainImage: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        images: [
          'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
          'https://images.pexels.com/photos/5082579/pexels-photo-5082579.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
          'https://images.pexels.com/photos/3825540/pexels-photo-3825540.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop'
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
        categoryId: categories[3].id,
        title: 'Apple iPhone 15 Pro',
        description: '新一代强大的旗舰智能手机，搭载A17芯片',
        mainImage: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        images: [
          'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop'
        ],
        price: 8999,
        originalPrice: 9999,
        stock: 1000,
        sales: 15263,
        tags: ['新品', '旗舰'],
        createdAt: new Date('2023-09-22')
      }
    }),
    prisma.product.create({
      data: {
        categoryId: categories[3].id,
        title: '华为 Mate 60 Pro',
        description: '革命性的国产旗舰，搭载鸿蒙系统',
        mainImage: 'https://images.pexels.com/photos/1447254/pexels-photo-1447254.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        images: [
          'https://images.pexels.com/photos/1447254/pexels-photo-1447254.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop'
        ],
        price: 6999,
        originalPrice: 7999,
        stock: 800,
        sales: 18751,
        tags: ['热销', '国产'],
        createdAt: new Date('2023-08-29')
      }
    }),
    prisma.product.create({
      data: {
        categoryId: categories[3].id,
        title: '小米 14 Ultra',
        description: '专业影像旗舰，徕卡认证四摄系统',
        mainImage: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        images: [
          'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop'
        ],
        price: 5999,
        originalPrice: 6999,
        stock: 1200,
        sales: 12543,
        tags: ['新品', '影像'],
        createdAt: new Date('2023-12-28')
      }
    })
  ])
  console.log(`✓ 创建了 ${products.length} 个示例商品`)

  // 创建Banner
  const banners = await Promise.all([
    prisma.banner.create({
      data: {
        title: '春季新品大促',
        image: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
        link: '/products',
        position: 'HOME',
        sort: 1
      }
    }),
    prisma.banner.create({
      data: {
        title: '限时秒杀',
        image: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
        link: '/flash-sale',
        position: 'HOME',
        sort: 2
      }
    }),
    prisma.banner.create({
      data: {
        title: '会员专享',
        image: 'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
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

  // 创建测试帖子（带关键词以便 Tab 过滤）
  const seededPosts = await Promise.all([
    prisma.post.create({
      data: {
        userId: user.id,
        type: 'IMAGE',
        title: '今日份穿搭：法式慵懒风',
        content: '今天这套穿搭真的太绝了！法式碎花裙搭配慵懒的针织衫，随性又不失高级感。非常适合五一出游哦！#时尚穿搭 #法式慵懒',
        images: [
          'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        viewCount: 15000,
        likeCount: 1230,
        commentCount: 156,
        status: 'APPROVED'
      }
    }),
    prisma.post.create({
      data: {
        userId: user.id,
        type: 'IMAGE',
        title: '探店首尔：超治愈的独栋咖啡厅',
        content: '这家店的咖啡和甜品真的太好吃了！尤其是这个草莓塔，满满的食欲。环境也非常适合拍照，美食博主必打卡！#首尔探店 #咖啡馆 #美食分享',
        images: [
          'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        viewCount: 28000,
        likeCount: 3450,
        commentCount: 289,
        status: 'APPROVED'
      }
    }),
    prisma.post.create({
      data: {
        userId: user.id,
        type: 'IMAGE',
        title: '我的极简主义桌面 2.0',
        content: '最近折腾了一下的数码桌面，换了新的机械键盘和耳机。整体色调非常统一，生产力拉满！#桌面搭配 #数码生活 #键盘测评',
        images: [
          'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/434337/pexels-photo-434337.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        viewCount: 45000,
        likeCount: 5600,
        commentCount: 420,
        status: 'APPROVED'
      }
    }),
    prisma.post.create({
      data: {
        userId: user.id,
        type: 'IMAGE',
        title: '把大自然带回家：卧室绿植分享',
        content: '最近在卧室里添置了几盆绿植，整个家居环境瞬间变得清新了很多。柔软的四件套搭配生机勃勃的植物，太舒服了！#家居美学 #卧室布置 #绿植',
        images: [
          'https://images.pexels.com/photos/7947012/pexels-photo-7947012.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        viewCount: 32000,
        likeCount: 4100,
        commentCount: 380,
        status: 'APPROVED'
      }
    }),
    prisma.post.create({
      data: {
        userId: user.id,
        type: 'IMAGE',
        title: '旅行日记：在大理洱海边吹风',
        content: '在这里时间仿佛慢了下来，旅行的意义可能就是在大自然中寻找宁静。出游必去！#大理旅行 #洱海 #随手拍',
        images: [
          'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        viewCount: 12000,
        likeCount: 890,
        commentCount: 125,
        status: 'APPROVED'
      }
    }),
    prisma.post.create({
      data: {
        userId: user.id,
        type: 'IMAGE',
        title: '春夏护肤清单：干皮救星',
        content: '最近皮肤状态很不错，分享一下我的护肤心得。这几款妆前乳和护肤水真的很好用，时尚博主都在推！#护肤心得 #春夏护肤 #好物分享',
        images: [
          'https://images.pexels.com/photos/3618606/pexels-photo-3618606.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        viewCount: 18000,
        likeCount: 2100,
        commentCount: 190,
        status: 'APPROVED'
      }
    })
  ])
  console.log(`✓ 创建了 ${seededPosts.length} 篇帖子`)

  // 创建排行榜数据
  const rankingTypes = ['HOT', 'RATING', 'NEW', 'FAVORITE'];
  const trendTypes = ['UP', 'DOWN', 'UNCHANGED'];

  // 为每种排行榜创建数据
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
