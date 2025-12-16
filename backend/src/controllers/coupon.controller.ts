import { Request, Response, NextFunction } from 'express'
import { CouponService } from '../services/coupon.service'
import { success, paginated } from '../utils/response'

/**
 * 优惠券控制器
 */
export class CouponController {
  /**
   * 获取优惠券列表
   */
  static async getCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, pageSize } = req.query
      const result = await CouponService.getCoupons(
        parseInt(page as string) || 1,
        parseInt(pageSize as string) || 20
      )
      return paginated(res, result.items, result.total, result.page, result.pageSize)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 领取优惠券
   */
  static async claimCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { id } = req.params
      const result = await CouponService.claimCoupon(userId, id)
      return success(res, result, '领取成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 我的优惠券列表
   */
  static async getMyCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { status, page, pageSize } = req.query
      const result = await CouponService.getMyCoupons(
        userId,
        status as string,
        parseInt(page as string) || 1,
        parseInt(pageSize as string) || 20
      )
      return paginated(res, result.items, result.total, result.page, result.pageSize)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 获取可用优惠券
   */
  static async getAvailableCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { totalAmount } = req.query
      const coupons = await CouponService.getAvailableCoupons(
        userId,
        parseFloat(totalAmount as string) || 0
      )
      return success(res, coupons)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 获取Banner列表
   */
  static async getBanners(req: Request, res: Response, next: NextFunction) {
    try {
      const banners = await CouponService.getBanners()
      return success(res, banners)
    } catch (error) {
      next(error)
    }
  }
}
