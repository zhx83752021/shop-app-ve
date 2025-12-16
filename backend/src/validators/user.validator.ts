import Joi from 'joi'

/**
 * 更新用户信息验证
 */
export const updateProfileSchema = Joi.object({
  nickname: Joi.string().min(2).max(20).optional().messages({
    'string.min': '昵称至少2个字符',
    'string.max': '昵称最多20个字符'
  }),
  avatar: Joi.string().uri().optional().messages({
    'string.uri': '头像URL格式不正确'
  }),
  gender: Joi.string().valid('MALE', 'FEMALE', 'UNKNOWN').optional()
})

/**
 * 修改密码验证
 */
export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    'any.required': '旧密码不能为空'
  }),
  newPassword: Joi.string().min(6).max(20).required().messages({
    'string.min': '新密码长度至少6位',
    'string.max': '新密码长度最多20位',
    'any.required': '新密码不能为空'
  })
})

/**
 * 添加地址验证
 */
export const addAddressSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': '收货人姓名不能为空'
  }),
  phone: Joi.string()
    .pattern(/^1[3-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': '手机号格式不正确',
      'any.required': '手机号不能为空'
    }),
  province: Joi.string().required().messages({
    'any.required': '省份不能为空'
  }),
  city: Joi.string().required().messages({
    'any.required': '城市不能为空'
  }),
  district: Joi.string().required().messages({
    'any.required': '区/县不能为空'
  }),
  detail: Joi.string().required().messages({
    'any.required': '详细地址不能为空'
  }),
  isDefault: Joi.boolean().default(false)
})

/**
 * 更新地址验证
 */
export const updateAddressSchema = addAddressSchema

/**
 * 地址ID验证
 */
export const addressIdSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': '地址ID不能为空'
  })
})

/**
 * 收藏验证
 */
export const favoriteSchema = Joi.object({
  productId: Joi.string().required().messages({
    'any.required': '商品ID不能为空'
  })
})
