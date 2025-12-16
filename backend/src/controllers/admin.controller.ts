import { Request, Response, NextFunction } from 'express'
import { AdminService } from '../services/admin.service'
import { success, created, paginated } from '../utils/response'

/**
 * 管理后台控制器
 */
export class AdminController {
  /**
   * 管理员登录
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body
      const result = await AdminService.login(username, password)
      return success(res, result, '登录成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Dashboard统计
   */
  static async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getDashboardStats()
      return success(res, stats)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 商品列表
   */
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getProducts(req.query)
      return paginated(res, result.items, result.total, result.page, result.pageSize)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 创建商品
   */
  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await AdminService.createProduct(req.body)
      return created(res, product, '创建成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 更新商品
   */
  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const product = await AdminService.updateProduct(id, req.body)
      return success(res, product, '更新成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 删除商品
   */
  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const result = await AdminService.deleteProduct(id)
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 订单列表
   */
  static async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getOrders(req.query)
      return paginated(res, result.items, result.total, result.page, result.pageSize)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 订单发货
   */
  static async shipOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const order = await AdminService.shipOrder(id, req.body)
      return success(res, order, '发货成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 退款列表
   */
  static async getRefunds(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getRefunds(req.query)
      return paginated(res, result.items, result.total, result.page, result.pageSize)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 处理退款
   */
  static async processRefund(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const result = await AdminService.processRefund(id, req.body)
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 用户列表
   */
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getUsers(req.query)
      return paginated(res, result.items, result.total, result.page, result.pageSize)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 更新用户状态
   */
  static async updateUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { status } = req.body
      const result = await AdminService.updateUserStatus(id, status)
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 内容列表
   */
  static async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getPosts(req.query)
      return paginated(res, result.items, result.total, result.page, result.pageSize)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 审核内容
   */
  static async reviewPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { status } = req.body
      const result = await AdminService.reviewPost(id, status)
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }

  // ==================== 优惠券管理 ====================

  /**
   * 获取优惠券列表
   */
  static async getCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getCoupons(req.query)
      return paginated(res, result.items, result.total, result.page, result.pageSize)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 创建优惠券
   */
  static async createCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.createCoupon(req.body)
      return success(res, result, '创建成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 更新优惠券
   */
  static async updateCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const result = await AdminService.updateCoupon(id, req.body)
      return success(res, result, '更新成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 删除优惠券
   */
  static async deleteCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      await AdminService.deleteCoupon(id)
      return success(res, null, '删除成功')
    } catch (error) {
      next(error)
    }
  }

  // ==================== Banner管理 ====================

  /**
   * 获取Banner列表
   */
  static async getBanners(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getBanners(req.query)
      return paginated(res, result.items, result.total, result.page, result.pageSize)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 创建Banner
   */
  static async createBanner(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.createBanner(req.body)
      return success(res, result, '创建成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 更新Banner
   */
  static async updateBanner(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const result = await AdminService.updateBanner(id, req.body)
      return success(res, result, '更新成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 删除Banner
   */
  static async deleteBanner(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      await AdminService.deleteBanner(id)
      return success(res, null, '删除成功')
    } catch (error) {
      next(error)
    }
  }

  // ==================== 分类管理 ====================

  /**
   * 获取分类列表
   */
  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getCategories()
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 创建分类
   */
  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.createCategory(req.body)
      return success(res, result, '创建成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 更新分类
   */
  static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const result = await AdminService.updateCategory(id, req.body)
      return success(res, result, '更新成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 删除分类
   */
  static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      await AdminService.deleteCategory(id)
      return success(res, null, '删除成功')
    } catch (error) {
      next(error)
    }
  }
}
