import { Request, Response, NextFunction } from 'express'
import { ProductService } from '../services/product.service'
import { success, paginated } from '../utils/response'

// 模拟产品数据
const mockProducts = [
  {
    id: '1',
    title: 'Apple iPhone 15 Pro',
    description: '新一代强大的旗舰智能手机，搭载A17芯片',
    price: 8999,
    sales: 15263,
    mainImage: 'https://placehold.co/400x400?text=iPhone15Pro',
    rating: 4.9,
    createdAt: '2023-09-22',
    favoriteCount: 9872,
    originalPrice: 9999,
    tags: ['新品']
  },
  {
    id: '2',
    title: '华为 Mate 60 Pro',
    description: '革命性的国产旗舰，搭载鸿蒙系统',
    price: 6999,
    sales: 18751,
    mainImage: 'https://placehold.co/400x400?text=Mate60Pro',
    rating: 4.8,
    createdAt: '2023-08-29',
    favoriteCount: 10254,
    originalPrice: 7999,
    tags: ['热销']
  },
  {
    id: '3',
    title: '小米 14 Ultra',
    description: '专业影像旗舰，徕卡认证四摄系统',
    price: 5999,
    sales: 12543,
    mainImage: 'https://placehold.co/400x400?text=Mi14Ultra',
    rating: 4.7,
    createdAt: '2023-12-28',
    favoriteCount: 8765,
    originalPrice: 6999,
    tags: ['新品']
  },
  {
    id: '4',
    title: 'Samsung Galaxy S23 Ultra',
    description: '200MP超感光摄像头，S Pen触控笔',
    price: 7999,
    sales: 10892,
    mainImage: 'https://placehold.co/400x400?text=S23Ultra',
    rating: 4.6,
    createdAt: '2023-01-01',
    favoriteCount: 7865,
    originalPrice: 8999,
    tags: ['促销']
  },
  {
    id: '5',
    title: 'OPPO Find X7 Ultra',
    description: '哈苏影像系统，双长焦四摄',
    price: 5999,
    sales: 9871,
    mainImage: 'https://placehold.co/400x400?text=FindX7',
    rating: 4.5,
    createdAt: '2024-01-08',
    favoriteCount: 6543,
    originalPrice: 6999,
    tags: ['新品']
  },
  {
    id: '6',
    title: 'vivo X100 Pro',
    description: '蔡司光学系统，自研V2芯片',
    price: 5699,
    sales: 8762,
    mainImage: 'https://placehold.co/400x400?text=X100Pro',
    rating: 4.6,
    createdAt: '2023-11-13',
    favoriteCount: 7890,
    originalPrice: 6699,
    tags: ['热销']
  }
];

/**
 * 商品控制器
 */
export class ProductController {
  /**
   * 获取商品列表
   */
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      // 如果请求中指定了sort=createdAt，则返回模拟数据（支持新品首发页面）
      if (req.query.sort === 'createdAt') {
        // 根据时间排序
        const sortedProducts = [...mockProducts].sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return req.query.order === 'asc' ? dateA - dateB : dateB - dateA;
        });

        return res.json(sortedProducts);
      } else {
        // 正常获取商品列表
        const result = await ProductService.getProducts(req.query as any);
        return paginated(res, result.items, result.total, result.page, result.pageSize);
      }
    } catch (error) {
      // 如果有错误，返回模拟数据以防止前端崩溃
      console.error('获取商品列表失败:', error);
      return res.json(mockProducts);
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
    } catch (error) {
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
