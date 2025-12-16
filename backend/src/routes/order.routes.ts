import { Router } from 'express'
import { OrderController } from '../controllers/order.controller'
import { authenticate } from '../middlewares/auth'
import { validate } from '../middlewares/validator'
import {
  createOrderSchema,
  getOrdersSchema,
  orderIdSchema,
  payOrderSchema,
  createRefundSchema
} from '../validators/order.validator'

const router = Router()

// 所有订单操作都需要认证
router.use(authenticate)

/**
 * @route   POST /api/orders
 * @desc    创建订单
 * @access  Private
 */
router.post('/', validate(createOrderSchema), OrderController.createOrder)

/**
 * @route   GET /api/orders
 * @desc    获取订单列表
 * @access  Private
 */
router.get('/', validate(getOrdersSchema, 'query'), OrderController.getOrders)

/**
 * @route   GET /api/orders/:id
 * @desc    获取订单详情
 * @access  Private
 */
router.get('/:id', validate(orderIdSchema, 'params'), OrderController.getOrderById)

/**
 * @route   POST /api/orders/:id/pay
 * @desc    支付订单
 * @access  Private
 */
router.post('/:id/pay', validate(orderIdSchema, 'params'), validate(payOrderSchema), OrderController.payOrder)

/**
 * @route   POST /api/orders/:id/cancel
 * @desc    取消订单
 * @access  Private
 */
router.post('/:id/cancel', validate(orderIdSchema, 'params'), OrderController.cancelOrder)

/**
 * @route   POST /api/orders/:id/confirm
 * @desc    确认收货
 * @access  Private
 */
router.post('/:id/confirm', validate(orderIdSchema, 'params'), OrderController.confirmOrder)

/**
 * @route   POST /api/orders/:id/refund
 * @desc    申请退款
 * @access  Private
 */
router.post('/:id/refund', validate(orderIdSchema, 'params'), validate(createRefundSchema), OrderController.createRefund)

export default router
