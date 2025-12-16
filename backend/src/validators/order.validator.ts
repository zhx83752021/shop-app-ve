import Joi from 'joi'

/**
 * 创建订单验证
 */
export const createOrderSchema = Joi.object({
  addressId: Joi.string().required().messages({
    'any.required': '收货地址ID不能为空'
  }),
  cartItemIds: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': '至少选择一件商品',
    'any.required': '商品列表不能为空'
  }),
  couponId: Joi.string().optional(),
  buyerMessage: Joi.string().max(500).optional()
})

/**
 * 订单列表查询验证
 */
export const getOrdersSchema = Joi.object({
  status: Joi.string()
    .valid('PENDING_PAYMENT', 'PENDING_SHIP', 'SHIPPED', 'COMPLETED', 'CLOSED', 'REFUNDING')
    .optional(),
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(50).default(20)
})

/**
 * 订单ID验证
 */
export const orderIdSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': '订单ID不能为空'
  })
})

/**
 * 支付订单验证
 */
export const payOrderSchema = Joi.object({
  paymentMethod: Joi.string().valid('WECHAT', 'ALIPAY', 'BALANCE').required().messages({
    'any.only': '支付方式必须是 WECHAT, ALIPAY 或 BALANCE',
    'any.required': '支付方式不能为空'
  })
})

/**
 * 申请退款验证
 */
export const createRefundSchema = Joi.object({
  refundReason: Joi.string().max(500).required().messages({
    'string.max': '退款原因最多500个字符',
    'any.required': '退款原因不能为空'
  }),
  refundType: Joi.string().valid('REFUND_ONLY', 'RETURN_REFUND').required().messages({
    'any.only': '退款类型必须是 REFUND_ONLY 或 RETURN_REFUND',
    'any.required': '退款类型不能为空'
  })
})
