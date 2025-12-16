import Joi from 'joi'

/**
 * 添加到购物车验证
 */
export const addToCartSchema = Joi.object({
  productId: Joi.string().required().messages({
    'any.required': '商品ID不能为空'
  }),
  quantity: Joi.number().integer().min(1).default(1).messages({
    'number.min': '数量至少为1'
  })
})

/**
 * 更新购物车商品验证
 */
export const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required().messages({
    'number.min': '数量至少为1',
    'any.required': '数量不能为空'
  })
})

/**
 * 购物车项ID验证
 */
export const cartItemIdSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': '购物车项ID不能为空'
  })
})

/**
 * 全选/取消全选验证
 */
export const selectAllSchema = Joi.object({
  selected: Joi.boolean().required().messages({
    'any.required': 'selected参数不能为空'
  })
})
