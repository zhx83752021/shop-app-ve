import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth.service'
import { success } from '../utils/response'

/**
 * 认证控制器
 */
export class AuthController {
  /**
   * 用户注册
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body)
      return success(res, result, '注册成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 用户登录
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body)
      return success(res, result, '登录成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 刷新Token
   */
  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body
      const result = await AuthService.refreshToken(refreshToken)
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 发送验证码
   */
  static async sendCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone, type } = req.body
      const result = await AuthService.sendCode(phone, type)
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }
}
