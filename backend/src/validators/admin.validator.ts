import Joi from 'joi'

/**
 * 管理员登录验证
 */
export const adminLoginSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': '用户名不能为空'
  }),
  password: Joi.string().required().messages({
    'any.required': '密码不能为空'
  })
})

/**
 * 商品管理 - 创建/更新验证
 */
export const productManageSchema = Joi.object({
  categoryId: Joi.string().required().messages({
    'any.required': '分类ID不能为空'
  }),
  title: Joi.string().min(2).max(200).required().messages({
    'string.min': '标题至少2个字符',
    'string.max': '标题最多200个字符',
    'any.required': '标题不能为空'
  }),
  description: Joi.string().optional(),
  mainImage: Joi.string().uri().required().messages({
    'string.uri': '主图URL格式不正确',
    'any.required': '主图不能为空'
  }),
  images: Joi.array().items(Joi.string().uri()).optional(),
  price: Joi.number().min(0).required().messages({
    'number.min': '价格不能小于0',
    'any.required': '价格不能为空'
  }),
  originalPrice: Joi.number().min(0).required().messages({
    'number.min': '原价不能小于0',
    'any.required': '原价不能为空'
  }),
  stock: Joi.number().integer().min(0).required().messages({
    'number.min': '库存不能小于0',
    'any.required': '库存不能为空'
  }),
  tags: Joi.array().items(Joi.string()).optional(),
  params: Joi.object().optional(),
  detail: Joi.string().optional(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').optional()
})

/**
 * 订单发货验证
 */
export const shipOrderSchema = Joi.object({
  shippingNo: Joi.string().required().messages({
    'any.required': '物流单号不能为空'
  }),
  shippingMethod: Joi.string().required().messages({
    'any.required': '物流公司不能为空'
  })
})

/**
 * 退款处理验证
 */
export const processRefundSchema = Joi.object({
  status: Joi.string().valid('APPROVED', 'REJECTED').required().messages({
    'any.only': '状态必须是 APPROVED 或 REJECTED',
    'any.required': '状态不能为空'
  }),
  rejectReason: Joi.string().when('status', {
    is: 'REJECTED',
    then: Joi.required(),
    otherwise: Joi.optional()
  }).messages({
    'any.required': '拒绝原因不能为空'
  })
})

/**
 * 内容审核验证
 */
export const reviewPostSchema = Joi.object({
  status: Joi.string().valid('APPROVED', 'REJECTED').required().messages({
    'any.only': '状态必须是 APPROVED 或 REJECTED',
    'any.required': '状态不能为空'
  })
})

/**
 * 用户状态管理验证
 */
export const updateUserStatusSchema = Joi.object({
  status: Joi.string().valid('ACTIVE', 'INACTIVE').required().messages({
    'any.only': '状态必须是 ACTIVE 或 INACTIVE',
    'any.required': '状态不能为空'
  })
})
