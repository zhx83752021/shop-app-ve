import { Request, Response, NextFunction } from 'express'
import { ProductService } from '../services/product.service'
import { success, paginated } from '../utils/response'


/**
 * 商品控制器
 */
export class ProductController {
  /**
   * 获取商品列表
   */
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      // 正常获取商品列表
      const result = await ProductService.getProducts(req.query as any);
      return paginated(res, result.items, result.total, result.page, result.pageSize);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取商品详情
   */
  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const userId = req.userId // 从认证中间件获取
      const product = await ProductService.getProductById(id, userId)
      return success(res, product)
    } catch (error: any) {
      if (error.message === '商品不存在或已下架') {
        return res.status(404).json({
          code: 404,
          message: error.message
        });
      }
      next(error)
    }
  }

  /**
   * 获取分类列表
   */
  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await ProductService.getCategories()
      return success(res, categories)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 搜索建议
   */
  static async getSearchSuggestions(req: Request, res: Response, next: NextFunction) {
    try {
      const { keyword } = req.query
      const suggestions = await ProductService.getSearchSuggestions(keyword as string)
      return success(res, suggestions)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 获取推荐商品
   */
  static async getRecommendedProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10
      const products = await ProductService.getRecommendedProducts(limit)
      return success(res, products)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 获取秒杀商品列表
   */
  static async getFlashSaleProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.pageSize as string) || 20
      const result = await ProductService.getFlashSaleProducts(page, pageSize)
      return paginated(res, result.items, result.total, result.page, result.pageSize)
    } catch (error) {
      next(error)
    }
  }
}
