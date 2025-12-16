import jwt from 'jsonwebtoken'
import config from '../config'

interface TokenPayload {
  userId: string
  type: 'access' | 'refresh'
}

/**
 * 生成访问令牌
 */
export function generateAccessToken(userId: string): string {
  const payload: TokenPayload = {
    userId,
    type: 'access'
  }

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as any
  })
}

/**
 * 生成刷新令牌
 */
export function generateRefreshToken(userId: string): string {
  const payload: TokenPayload = {
    userId,
    type: 'refresh'
  }

  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn as any
  })
}

/**
 * 验证访问令牌
 */
export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwt.secret) as TokenPayload
}

/**
 * 验证刷新令牌
 */
export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload
}
