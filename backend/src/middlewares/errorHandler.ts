import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger'
import { serverError } from '../utils/response'

/**
 * 全局错误处理中间件
 */
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error('Error:', err)

  // Joi 验证错误
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      code: 400,
      message: '参数验证失败',
      error: err.message
    })
  }

  // Prisma 错误
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      code: 400,
      message: '数据库操作失败',
      error: err.message
    })
  }

  // 默认服务器错误
  return serverError(res, '服务器内部错误', err.message)
}

/**
 * 404 错误处理
 */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    code: 404,
    message: '接口不存在',
    path: req.path
  })
}
