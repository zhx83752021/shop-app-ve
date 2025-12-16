import { Router } from 'express'
import authRoutes from './auth.routes'
import productRoutes from './product.routes'
import cartRoutes from './cart.routes'
import userRoutes from './user.routes'
import orderRoutes from './order.routes'
import adminRoutes from './admin.routes'
import postRoutes from './post.routes'
import couponRoutes from './coupon.routes'
import rankingRoutes from './ranking.routes'
import bannerRoutes from './banner.routes'

const router = Router()

// 认证路由
router.use('/auth', authRoutes)

// 用户路由
router.use('/user', userRoutes)

// 商品路由
router.use('/products', productRoutes)

// 分类路由
router.get('/categories', productRoutes)

// 购物车路由
router.use('/cart', cartRoutes)

// 订单路由
router.use('/orders', orderRoutes)

// 帖子路由
router.use('/posts', postRoutes)

// 优惠券路由
router.use('/coupons', couponRoutes)

// Banner路由
router.use('/banners', bannerRoutes)

// 排行榜路由
router.use('/rankings', rankingRoutes)

// 管理后台路由
router.use('/admin', adminRoutes)

// 健康检查
router.get('/health', (_, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  })
})

export default router
