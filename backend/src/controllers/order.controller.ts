import { Request, Response, NextFunction } from 'express'
import { OrderService } from '../services/order.service'
import { success, created, paginated } from '../utils/response'

/**
 * 订单控制器
 */
export class OrderController {
  /**
   * 创建订单
   */
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const order = await OrderService.createOrder(userId, req.body)
      return created(res, order, '订单创建成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 获取订单列表
   */
  static async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { status, page, pageSize } = req.query
      const result = await OrderService.getOrders(
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
   * 获取订单详情
   */
  static async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { id } = req.params
      const order = await OrderService.getOrderById(userId, id)
      return success(res, order)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 支付订单
   */
  static async payOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { id } = req.params
      const { paymentMethod } = req.body
      const order = await OrderService.payOrder(userId, id, paymentMethod)
      return success(res, order, '支付成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 取消订单
   */
  static async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { id } = req.params
      const result = await OrderService.cancelOrder(userId, id)
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 确认收货
   */
  static async confirmOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { id } = req.params
      const result = await OrderService.confirmOrder(userId, id)
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 申请退款
   */
  static async createRefund(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { id } = req.params
      const refund = await OrderService.createRefund(userId, id, req.body)
      return success(res, refund, '退款申请已提交')
    } catch (error) {
      next(error)
    }
  }
}
