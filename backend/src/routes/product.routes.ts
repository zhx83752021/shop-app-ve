import { Router } from 'express'
import { ProductController } from '../controllers/product.controller'
import { validate } from '../middlewares/validator'
import { optionalAuth } from '../middlewares/auth'
import {
  getProductsSchema,
  productIdSchema,
  searchSuggestSchema
} from '../validators/product.validator'

const router = Router()

/**
 * @route   GET /api/categories
 * @desc    获取分类列表
 * @access  Public
 */
router.get('/categories', ProductController.getCategories)

/**
 * @route   GET /api/products
 * @desc    获取商品列表
 * @access  Public
 */
router.get('/', validate(getProductsSchema, 'query'), ProductController.getProducts)

/**
 * @route   GET /api/products/recommend
 * @desc    获取推荐商品
 * @access  Public
 */
router.get('/recommend', ProductController.getRecommendedProducts)

/**
 * @route   GET /api/products/flash-sale
 * @desc    获取秒杀商品列表
 * @access  Public
 */
router.get('/flash-sale', ProductController.getFlashSaleProducts)

/**
 * @route   GET /api/products/search/suggest
 * @desc    搜索建议
 * @access  Public
 */
router.get('/search/suggest', validate(searchSuggestSchema, 'query'), ProductController.getSearchSuggestions)

/**
 * @route   GET /api/products/:id
 * @desc    获取商品详情
 * @access  Public (可选认证)
 */
router.get('/:id', optionalAuth, validate(productIdSchema, 'params'), ProductController.getProductById)

export default router
