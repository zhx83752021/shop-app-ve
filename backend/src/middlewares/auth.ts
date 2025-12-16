import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'
import { unauthorized } from '../utils/response'

// 扩展 Express Request 类型
declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

/**
 * 认证中间件
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    // 从 header 中获取 token
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorized(res, 'Token缺失')
    }

    const token = authHeader.substring(7)

    // 验证 token
    const payload = verifyAccessToken(token)

    // 将 userId 存储到 req 对象
    req.userId = payload.userId

    next()
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        return unauthorized(res, 'Token已过期')
      }
      if (error.name === 'JsonWebTokenError') {
        return unauthorized(res, 'Token无效')
      }
    }
    return unauthorized(res, '认证失败')
  }
}

/**
 * 可选认证中间件 (Token 可选)
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const payload = verifyAccessToken(token)
      req.userId = payload.userId
    }
    next()
  } catch (error) {
    // 忽略错误，继续执行
    next()
  }
}
