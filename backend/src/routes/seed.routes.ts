import { Router, Request, Response } from 'express'
import { seedDatabase } from '../utils/seedDatabase'
import prisma from '../lib/prisma'
import logger from '../utils/logger'

const router = Router()

router.post('/initialize', async (req: Request, res: Response) => {
  try {
    const { secretKey } = req.body

    if (!secretKey || secretKey !== process.env.SEED_SECRET_KEY) {
      return res.status(403).json({
        success: false,
        message: '无效的密钥'
      })
    }
    
    await seedDatabase(prisma)

    return res.json({
      success: true,
      message: '数据库初始化成功',
      info: {
        admin: { username: 'admin', password: 'admin123' },
        user: { phone: '13800138000', password: '123456' }
      }
    })
  } catch (error: any) {
    logger.error('数据库初始化失败:', error)
    return res.status(500).json({
      success: false,
      message: '数据库初始化失败',
      error: error.message
    })
  }
})

router.get('/status', async (_req: Request, res: Response) => {
  try {
    
    const [
      productCount,
      categoryCount,
      bannerCount,
      couponCount,
      userCount
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.banner.count(),
      prisma.coupon.count(),
      prisma.user.count()
    ])

    return res.json({
      success: true,
      data: {
        products: productCount,
        categories: categoryCount,
        banners: bannerCount,
        coupons: couponCount,
        users: userCount,
        isEmpty: productCount === 0 && categoryCount === 0
      }
    })
  } catch (error: any) {
    logger.error('获取数据库状态失败:', error)
    return res.status(500).json({
      success: false,
      message: '获取数据库状态失败',
      error: error.message
    })
  }
})

export default router
