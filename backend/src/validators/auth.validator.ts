import Joi from 'joi'

/**
 * 注册验证
 */
export const registerSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^1[3-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': '手机号格式不正确',
      'any.required': '手机号不能为空'
    }),
  password: Joi.string()
    .min(6)
    .max(20)
    .required()
    .messages({
      'string.min': '密码长度至少6位',
      'string.max': '密码长度最多20位',
      'any.required': '密码不能为空'
    }),
  code: Joi.string()
    .length(6)
    .required()
    .messages({
      'string.length': '验证码必须是6位',
      'any.required': '验证码不能为空'
    })
})

/**
 * 登录验证
 */
export const loginSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^1[3-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': '手机号格式不正确',
      'any.required': '手机号不能为空'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': '密码不能为空'
    })
})

/**
 * 发送验证码验证
 */
export const sendCodeSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^1[3-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': '手机号格式不正确',
      'any.required': '手机号不能为空'
    }),
  type: Joi.string()
    .valid('register', 'login', 'reset_password')
    .required()
    .messages({
      'any.only': '类型必须是 register, login 或 reset_password',
      'any.required': '类型不能为空'
    })
})

/**
 * 刷新Token验证
 */
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'any.required': 'refreshToken不能为空'
    })
})
