import { Request, Response, NextFunction } from 'express'
import { UserService } from '../services/user.service'
import { success, paginated } from '../utils/response'

/**
 * 用户控制器
 */
export class UserController {
  /**
   * 获取用户信息
   */
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const user = await UserService.getUserProfile(userId)
      return success(res, user)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 更新用户信息
   */
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const user = await UserService.updateProfile(userId, req.body)
      return success(res, user, '更新成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 修改密码
   */
  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { oldPassword, newPassword } = req.body
      const result = await UserService.changePassword(userId, oldPassword, newPassword)
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 获取地址列表
   */
  static async getAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const addresses = await UserService.getAddresses(userId)
      return success(res, addresses)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 添加地址
   */
  static async addAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const address = await UserService.addAddress(userId, req.body)
      return success(res, address, '添加成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 更新地址
   */
  static async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { id } = req.params
      const address = await UserService.updateAddress(userId, id, req.body)
      return success(res, address, '更新成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 删除地址
   */
  static async deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { id } = req.params
      const result = await UserService.deleteAddress(userId, id)
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 获取收藏列表
   */
  static async getFavorites(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const page = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.pageSize as string) || 20
      const result = await UserService.getFavorites(userId, page, pageSize)
      return paginated(res, result.items, result.total, result.page, result.pageSize)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 添加收藏
   */
  static async addFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { productId } = req.body
      const favorite = await UserService.addFavorite(userId, productId)
      return success(res, favorite, '收藏成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 取消收藏
   */
  static async removeFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { productId } = req.params
      const result = await UserService.removeFavorite(userId, productId)
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 获取浏览历史
   */
  static async getBrowseHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const page = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.pageSize as string) || 20
      const result = await UserService.getBrowseHistory(userId, page, pageSize)
      return paginated(res, result.items, result.total, result.page, result.pageSize)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 清空浏览历史
   */
  static async clearBrowseHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const result = await UserService.clearBrowseHistory(userId)
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 关注用户
   */
  static async followUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { userId: targetUserId } = req.body

      if (!targetUserId) {
        return res.status(400).json({
          code: 400,
          message: '缺少目标用户ID'
        })
      }

      const result = await UserService.followUser(userId, targetUserId)
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 取消关注用户
   */
  static async unfollowUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { userId: targetUserId } = req.params
      const result = await UserService.unfollowUser(userId, targetUserId)
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 获取关注列表
   */
  static async getFollowings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const page = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.pageSize as string) || 20
      const result = await UserService.getFollowings(userId, page, pageSize)
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 获取粉丝列表
   */
  static async getFollowers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const page = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.pageSize as string) || 20
      const result = await UserService.getFollowers(userId, page, pageSize)
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }
}
