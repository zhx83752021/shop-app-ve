import prisma from '../config/database'
import { Prisma } from '@prisma/client'

interface GetProductsQuery {
  categoryId?: string
  keyword?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'sales' | 'price' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  page: number
  pageSize: number
}

/**
 * 商品服务
 */
export class ProductService {
  /**
   * 获取商品列表
   */
  static async getProducts(query: GetProductsQuery) {
    const {
      categoryId,
      keyword,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page,
      pageSize
    } = query

    // 构建查询条件
    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE'
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } }
      ]
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) {
        where.price.gte = minPrice
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice
      }
    }

    // 排序
    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      [sortBy]: sortOrder
    }

    // 查询总数
    const total = await prisma.product.count({ where })

    // 查询商品列表
    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        title: true,
        mainImage: true,
        price: true,
        originalPrice: true,
        sales: true,
        tags: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return {
      items: products.map((p) => ({
        ...p,
        price: p.price.toString(),
        originalPrice: p.originalPrice.toString()
      })),
      total,
      page,
      pageSize
    }
  }

  /**
   * 获取商品详情
   */
  static async getProductById(id: string, userId?: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        skus: {
          select: {
            id: true,
            specs: true,
            price: true,
            stock: true,
            image: true
          }
        }
      }
    })

    if (!product || product.status !== 'ACTIVE') {
      throw new Error('商品不存在或已下架')
    }

    // 增加浏览量
    await prisma.product.update({
      where: { id },
      data: { views: { increment: 1 } }
    })

    // 如果用户已登录，记录浏览历史
    if (userId) {
      await prisma.browseHistory.create({
        data: {
          userId,
          productId: id
        }
      }).catch(() => {
        // 忽略重复记录错误
      })
    }

    return {
      ...product,
      price: product.price.toString(),
      originalPrice: product.originalPrice.toString(),
      skus: product.skus.map((sku) => ({
        ...sku,
        price: sku.price.toString()
      }))
    }
  }

  /**
   * 获取分类列表
   */
  static async getCategories() {
    const categories = await prisma.category.findMany({
      where: {
        status: 'ACTIVE',
        parentId: null
      },
      orderBy: { sort: 'asc' },
      include: {
        children: {
          where: { status: 'ACTIVE' },
          orderBy: { sort: 'asc' },
          select: {
            id: true,
            name: true,
            icon: true
          }
        }
      }
    })

    return categories
  }

  /**
   * 搜索建议
   */
  static async getSearchSuggestions(keyword: string) {
    // 搜索商品
    const products = await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        title: {
          contains: keyword,
          mode: 'insensitive'
        }
      },
      take: 5,
      select: {
        id: true,
        title: true,
        mainImage: true
      }
    })

    // TODO: 这里可以添加热门搜索关键词推荐
    const keywords = [
      `${keyword}`,
      `${keyword} 新款`,
      `${keyword} 优惠`
    ].slice(0, 3)

    return {
      keywords,
      products
    }
  }

  /**
   * 获取推荐商品
   */
  static async getRecommendedProducts(limit: number = 10) {
    const products = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { sales: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        mainImage: true,
        price: true,
        originalPrice: true,
        sales: true,
        tags: true
      }
    })

    return products.map((p) => ({
      ...p,
      price: p.price.toString(),
      originalPrice: p.originalPrice.toString()
    }))
  }

  /**
   * 获取秒杀商品列表
   */
  static async getFlashSaleProducts(page: number = 1, pageSize: number = 20) {
    // 构建查询条件 - 筛选有较大折扣的商品作为秒杀商品
    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE',
      stock: { gt: 0 }, // 有库存
      originalPrice: { gt: 0 } // 有原价
    }

    // 查询总数
    const total = await prisma.product.count({ where })

    // 查询商品列表 - 按销量和折扣力度排序
    const products = await prisma.product.findMany({
      where,
      orderBy: [
        { sales: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        title: true,
        mainImage: true,
        price: true,
        originalPrice: true,
        sales: true,
        stock: true,
        tags: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return {
      items: products.map((p) => ({
        ...p,
        price: p.price.toString(),
        originalPrice: p.originalPrice.toString()
      })),
      total,
      page,
      pageSize
    }
  }
}
