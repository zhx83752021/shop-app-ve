import Joi from 'joi'

/**
 * 优惠券列表查询验证
 */
export const getCouponsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(50).default(20)
})

/**
 * 优惠券ID验证
 */
export const couponIdSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': '优惠券ID不能为空'
  })
})
