import { Router } from 'express'
import { getBanners } from '../controllers/banner.controller'

const router = Router()

/**
 * @route   GET /api/banners
 * @desc    获取Banner列表
 * @access  Public
 * @query   position - 可选，筛选Banner位置 (HOME, DISCOVER, PROFILE)
 */
router.get('/', getBanners)

export default router
