import { Router } from 'express'
import { AdminController } from '../controllers/admin.controller'
import { authenticate } from '../middlewares/auth'
import { validate } from '../middlewares/validator'
import {
  adminLoginSchema,
  productManageSchema,
  shipOrderSchema,
  processRefundSchema,
  reviewPostSchema,
  updateUserStatusSchema
} from '../validators/admin.validator'

const router = Router()

/**
 * @route   POST /api/admin/login
 * @desc    管理员登录
 * @access  Public
 */
router.post('/login', validate(adminLoginSchema), AdminController.login)

// 以下路由需要管理员认证
router.use(authenticate)

/**
 * @route   GET /api/admin/dashboard
 * @desc    Dashboard统计数据
 * @access  Private (Admin)
 */
router.get('/dashboard', AdminController.getDashboardStats)

// ==================== 商品管理 ====================

/**
 * @route   GET /api/admin/products
 * @desc    商品列表
 * @access  Private (Admin)
 */
router.get('/products', AdminController.getProducts)

/**
 * @route   POST /api/admin/products
 * @desc    创建商品
 * @access  Private (Admin)
 */
router.post('/products', validate(productManageSchema), AdminController.createProduct)

/**
 * @route   PUT /api/admin/products/:id
 * @desc    更新商品
 * @access  Private (Admin)
 */
router.put('/products/:id', validate(productManageSchema), AdminController.updateProduct)

/**
 * @route   DELETE /api/admin/products/:id
 * @desc    删除商品
 * @access  Private (Admin)
 */
router.delete('/products/:id', AdminController.deleteProduct)

// ==================== 订单管理 ====================

/**
 * @route   GET /api/admin/orders
 * @desc    订单列表
 * @access  Private (Admin)
 */
router.get('/orders', AdminController.getOrders)

/**
 * @route   POST /api/admin/orders/:id/ship
 * @desc    订单发货
 * @access  Private (Admin)
 */
router.post('/orders/:id/ship', validate(shipOrderSchema), AdminController.shipOrder)

// ==================== 退款管理 ====================

/**
 * @route   GET /api/admin/refunds
 * @desc    退款列表
 * @access  Private (Admin)
 */
router.get('/refunds', AdminController.getRefunds)

/**
 * @route   POST /api/admin/refunds/:id/process
 * @desc    处理退款
 * @access  Private (Admin)
 */
router.post('/refunds/:id/process', validate(processRefundSchema), AdminController.processRefund)

// ==================== 用户管理 ====================

/**
 * @route   GET /api/admin/users
 * @desc    用户列表
 * @access  Private (Admin)
 */
router.get('/users', AdminController.getUsers)

/**
 * @route   PUT /api/admin/users/:id/status
 * @desc    更新用户状态
 * @access  Private (Admin)
 */
router.put('/users/:id/status', validate(updateUserStatusSchema), AdminController.updateUserStatus)

// ==================== 内容审核 ====================

/**
 * @route   GET /api/admin/posts
 * @desc    内容列表
 * @access  Private (Admin)
 */
router.get('/posts', AdminController.getPosts)

/**
 * @route   PUT /api/admin/posts/:id/review
 * @desc    审核内容
 * @access  Private (Admin)
 */
router.put('/posts/:id/review', validate(reviewPostSchema), AdminController.reviewPost)

// ==================== 优惠券管理 ====================

/**
 * @route   GET /api/admin/coupons
 * @desc    优惠券列表
 * @access  Private (Admin)
 */
router.get('/coupons', AdminController.getCoupons)

/**
 * @route   POST /api/admin/coupons
 * @desc    创建优惠券
 * @access  Private (Admin)
 */
router.post('/coupons', AdminController.createCoupon)

/**
 * @route   PUT /api/admin/coupons/:id
 * @desc    更新优惠券
 * @access  Private (Admin)
 */
router.put('/coupons/:id', AdminController.updateCoupon)

/**
 * @route   DELETE /api/admin/coupons/:id
 * @desc    删除优惠券
 * @access  Private (Admin)
 */
router.delete('/coupons/:id', AdminController.deleteCoupon)

// ==================== Banner管理 ====================

/**
 * @route   GET /api/admin/banners
 * @desc    Banner列表
 * @access  Private (Admin)
 */
router.get('/banners', AdminController.getBanners)

/**
 * @route   POST /api/admin/banners
 * @desc    创建Banner
 * @access  Private (Admin)
 */
router.post('/banners', AdminController.createBanner)

/**
 * @route   PUT /api/admin/banners/:id
 * @desc    更新Banner
 * @access  Private (Admin)
 */
router.put('/banners/:id', AdminController.updateBanner)

/**
 * @route   DELETE /api/admin/banners/:id
 * @desc    删除Banner
 * @access  Private (Admin)
 */
router.delete('/banners/:id', AdminController.deleteBanner)

// ==================== 分类管理 ====================

/**
 * @route   GET /api/admin/categories
 * @desc    分类列表
 * @access  Private (Admin)
 */
router.get('/categories', AdminController.getCategories)

/**
 * @route   POST /api/admin/categories
 * @desc    创建分类
 * @access  Private (Admin)
 */
router.post('/categories', AdminController.createCategory)

/**
 * @route   PUT /api/admin/categories/:id
 * @desc    更新分类
 * @access  Private (Admin)
 */
router.put('/categories/:id', AdminController.updateCategory)

/**
 * @route   DELETE /api/admin/categories/:id
 * @desc    删除分类
 * @access  Private (Admin)
 */
router.delete('/categories/:id', AdminController.deleteCategory)

export default router
