import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { error } from '../utils/response'

/**
 * 验证中间件工厂函数
 */
export function validate(schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error: validationError, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    })

    if (validationError) {
      const errorMessage = validationError.details
        .map((detail) => detail.message)
        .join('; ')
      return error(res, '参数验证失败', 400, errorMessage)
    }

    // 替换为验证后的值
    req[property] = value
    next()
  }
}
