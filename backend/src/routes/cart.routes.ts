import { Router } from 'express'
import { CartController } from '../controllers/cart.controller'
import { authenticate } from '../middlewares/auth'
import { validate } from '../middlewares/validator'
import {
  addToCartSchema,
  updateCartItemSchema,
  cartItemIdSchema,
  selectAllSchema
} from '../validators/cart.validator'

const router = Router()

// 所有购物车操作都需要认证
router.use(authenticate)

/**
 * @route   GET /api/cart
 * @desc    获取购物车
 * @access  Private
 */
router.get('/', CartController.getCart)

/**
 * @route   POST /api/cart
 * @desc    添加到购物车
 * @access  Private
 */
router.post('/', validate(addToCartSchema), CartController.addToCart)

/**
 * @route   PUT /api/cart/:id
 * @desc    更新购物车商品数量
 * @access  Private
 */
router.put('/:id', validate(cartItemIdSchema, 'params'), validate(updateCartItemSchema), CartController.updateCartItem)

/**
 * @route   DELETE /api/cart/:id
 * @desc    删除购物车商品
 * @access  Private
 */
router.delete('/:id', validate(cartItemIdSchema, 'params'), CartController.deleteCartItem)

/**
 * @route   PUT /api/cart/select-all
 * @desc    全选/取消全选
 * @access  Private
 */
router.put('/select-all', validate(selectAllSchema), CartController.selectAll)

/**
 * @route   DELETE /api/cart
 * @desc    清空购物车
 * @access  Private
 */
router.delete('/', CartController.clearCart)

export default router
