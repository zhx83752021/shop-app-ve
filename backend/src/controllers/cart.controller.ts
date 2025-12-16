import { Request, Response, NextFunction } from 'express'
import { CartService } from '../services/cart.service'
import { success } from '../utils/response'

/**
 * 购物车控制器
 */
export class CartController {
  /**
   * 获取购物车
   */
  static async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const cart = await CartService.getCart(userId)
      return success(res, cart)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 添加到购物车
   */
  static async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { productId, quantity } = req.body
      const cartItem = await CartService.addToCart(userId, productId, quantity)
      return success(res, cartItem, '添加成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 更新购物车商品数量
   */
  static async updateCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { id } = req.params
      const { quantity } = req.body
      const cartItem = await CartService.updateCartItem(userId, id, quantity)
      return success(res, cartItem, '更新成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 删除购物车商品
   */
  static async deleteCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { id } = req.params
      const result = await CartService.deleteCartItem(userId, id)
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 全选/取消全选
   */
  static async selectAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { selected } = req.body
      const result = await CartService.selectAll(userId, selected)
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 清空购物车
   */
  static async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const result = await CartService.clearCart(userId)
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }
}
