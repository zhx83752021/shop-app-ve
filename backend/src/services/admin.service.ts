import prisma from '../config/database'
import { verifyPassword } from '../utils/password'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'
import { Prisma } from '@prisma/client'

/**
 * 管理后台服务
 */
export class AdminService {
  /**
   * 管理员登录
   */
  static async login(username: string, password: string) {
    const admin = await prisma.admin.findUnique({
      where: { username }
    })

    if (!admin) {
      throw new Error('用户名或密码错误')
    }

    const isValid = await verifyPassword(password, admin.password)
    if (!isValid) {
      throw new Error('用户名或密码错误')
    }

    if (admin.status !== 'ACTIVE') {
      throw new Error('账号已被禁用')
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() }
    })

    const accessToken = generateAccessToken(admin.id)
    const refreshToken = generateRefreshToken(admin.id)

    return {
      admin: {
        id: admin.id,
        username: admin.username,
        nickname: admin.nickname,
        role: admin.role
      },
      accessToken,
      refreshToken
    }
  }

  /**
   * Dashboard统计数据
   */
  static async getDashboardStats() {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      todayOrders,
      totalRevenue,
      pendingRefunds
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      prisma.order.count(),
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.order.aggregate({
        where: { status: { in: ['COMPLETED', 'SHIPPED'] } },
        _sum: { actualAmount: true }
      }),
      prisma.refund.count({ where: { status: 'PENDING' } })
    ])

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      todayOrders,
      totalRevenue: totalRevenue._sum.actualAmount?.toString() || '0',
      pendingRefunds
    }
  }

  /**
   * 商品管理 - 列表
   */
  static async getProducts(query: any) {
    const { keyword, categoryId, status, page = '1', pageSize = '20' } = query
    const pageNum = parseInt(page, 10)
    const pageSizeNum = parseInt(pageSize, 10)

    const where: Prisma.ProductWhereInput = {}
    if (keyword) {
      where.title = { contains: keyword, mode: 'insensitive' }
    }
    if (categoryId) {
      where.categoryId = categoryId
    }
    if (status) {
      where.status = status
    }

    const total = await prisma.product.count({ where })
    const products = await prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * pageSizeNum,
      take: pageSizeNum
    })

    return {
      items: products.map((p) => ({
        ...p,
        price: p.price.toString(),
        originalPrice: p.originalPrice.toString()
      })),
      total,
      page: pageNum,
      pageSize: pageSizeNum
    }
  }

  /**
   * 商品管理 - 创建
   */
  static async createProduct(data: any) {
    const product = await prisma.product.create({
      data: {
        ...data,
        price: parseFloat(data.price),
        originalPrice: parseFloat(data.originalPrice)
      }
    })

    return {
      ...product,
      price: product.price.toString(),
      originalPrice: product.originalPrice.toString()
    }
  }

  /**
   * 商品管理 - 更新
   */
  static async updateProduct(id: string, data: any) {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        price: data.price ? parseFloat(data.price) : undefined,
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : undefined
      }
    })

    return {
      ...product,
      price: product.price.toString(),
      originalPrice: product.originalPrice.toString()
    }
  }

  /**
   * 商品管理 - 删除
   */
  static async deleteProduct(id: string) {
    await prisma.product.delete({ where: { id } })
    return { message: '删除成功' }
  }

  /**
   * 订单管理 - 列表
   */
  static async getOrders(query: any) {
    const { status, startDate, endDate, page = '1', pageSize = '20' } = query
    const pageNum = parseInt(page, 10)
    const pageSizeNum = parseInt(pageSize, 10)

    const where: Prisma.OrderWhereInput = {}
    if (status) {
      where.status = status
    }
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    const total = await prisma.order.count({ where })
    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { nickname: true, phone: true } },
        items: true
      },
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * pageSizeNum,
      take: pageSizeNum
    })

    return {
      items: orders.map((o) => ({
        ...o,
        totalAmount: o.totalAmount.toString(),
        actualAmount: o.actualAmount.toString(),
        items: o.items.map((item) => ({
          ...item,
          price: item.price.toString(),
          totalAmount: item.totalAmount.toString()
        }))
      })),
      total,
      page: pageNum,
      pageSize: pageSizeNum
    }
  }

  /**
   * 订单管理 - 发货
   */
  static async shipOrder(orderId: string, data: any) {
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) {
      throw new Error('订单不存在')
    }
    if (order.status !== 'PENDING_SHIP') {
      throw new Error('订单状态不正确')
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'SHIPPED',
        shippingNo: data.shippingNo,
        shippingMethod: data.shippingMethod,
        shippingTime: new Date()
      }
    })

    return updated
  }

  /**
   * 退款管理 - 列表
   */
  static async getRefunds(query: any) {
    const { status, page = '1', pageSize = '20' } = query
    const pageNum = parseInt(page, 10)
    const pageSizeNum = parseInt(pageSize, 10)

    const where: Prisma.RefundWhereInput = {}
    if (status) {
      where.status = status
    }

    const total = await prisma.refund.count({ where })
    const refunds = await prisma.refund.findMany({
      where,
      include: {
        order: { select: { orderNo: true } },
        user: { select: { nickname: true, phone: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * pageSizeNum,
      take: pageSizeNum
    })

    return {
      items: refunds.map((r) => ({
        ...r,
        refundAmount: r.refundAmount.toString()
      })),
      total,
      page: pageNum,
      pageSize: pageSizeNum
    }
  }

  /**
   * 退款管理 - 处理
   */
  static async processRefund(refundId: string, data: any) {
    const refund = await prisma.refund.findUnique({
      where: { id: refundId },
      include: { order: { include: { items: true } } }
    })

    if (!refund) {
      throw new Error('退款申请不存在')
    }
    if (refund.status !== 'PENDING') {
      throw new Error('该退款申请已处理')
    }

    if (data.status === 'APPROVED') {
      // 恢复库存和销量
      await prisma.$transaction(async (tx) => {
        for (const item of refund.order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { increment: item.quantity },
              sales: { decrement: item.quantity }
            }
          })
        }

        await tx.refund.update({
          where: { id: refundId },
          data: {
            status: 'APPROVED',
            processTime: new Date()
          }
        })

        await tx.order.update({
          where: { id: refund.orderId },
          data: { status: 'CLOSED', closeReason: '退款成功' }
        })
      })
    } else {
      await prisma.$transaction(async (tx) => {
        await tx.refund.update({
          where: { id: refundId },
          data: {
            status: 'REJECTED',
            rejectReason: data.rejectReason,
            processTime: new Date()
          }
        })

        await tx.order.update({
          where: { id: refund.orderId },
          data: { status: 'SHIPPED' }
        })
      })
    }

    return { message: '处理成功' }
  }

  /**
   * 用户管理 - 列表
   */
  static async getUsers(query: any) {
    const { keyword, status, page = '1', pageSize = '20' } = query
    const pageNum = parseInt(page, 10)
    const pageSizeNum = parseInt(pageSize, 10)

    const where: Prisma.UserWhereInput = {}
    if (keyword) {
      where.OR = [
        { nickname: { contains: keyword, mode: 'insensitive' } },
        { phone: { contains: keyword } }
      ]
    }
    if (status) {
      where.status = status
    }

    const total = await prisma.user.count({ where })
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        phone: true,
        nickname: true,
        avatar: true,
        memberLevel: true,
        points: true,
        balance: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * pageSizeNum,
      take: pageSizeNum
    })

    return {
      items: users.map((u) => ({
        ...u,
        balance: u.balance.toString()
      })),
      total,
      page: pageNum,
      pageSize: pageSizeNum
    }
  }

  /**
   * 用户管理 - 更新状态
   */
  static async updateUserStatus(userId: string, status: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { status: status as any }
    })

    return { message: '更新成功' }
  }

  /**
   * 内容审核 - 列表
   */
  static async getPosts(query: any) {
    const { status, page = '1', pageSize = '20' } = query
    const pageNum = parseInt(page, 10)
    const pageSizeNum = parseInt(pageSize, 10)

    const where: Prisma.PostWhereInput = {}
    if (status) {
      where.status = status
    }

    const total = await prisma.post.count({ where })
    const posts = await prisma.post.findMany({
      where,
      include: {
        user: { select: { nickname: true, phone: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * pageSizeNum,
      take: pageSizeNum
    })

    return { items: posts, total, page: pageNum, pageSize: pageSizeNum }
  }

  /**
   * 内容审核 - 审核
   */
  static async reviewPost(postId: string, status: string) {
    await prisma.post.update({
      where: { id: postId },
      data: { status: status as any }
    })

    return { message: '审核完成' }
  }

  // ==================== 优惠券管理 ====================

  /**
   * 获取优惠券列表
   */
  static async getCoupons(query: any) {
    const pageNum = parseInt(query.page) || 1
    const pageSizeNum = parseInt(query.pageSize) || 20
    const keyword = query.keyword || ''
    const status = query.status || ''

    const where: Prisma.CouponWhereInput = {}

    if (keyword) {
      where.name = { contains: keyword, mode: 'insensitive' }
    }

    if (status) {
      where.status = status
    }

    const total = await prisma.coupon.count({ where })
    const coupons = await prisma.coupon.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * pageSizeNum,
      take: pageSizeNum
    })

    return { items: coupons, total, page: pageNum, pageSize: pageSizeNum }
  }

  /**
   * 创建优惠券
   */
  static async createCoupon(data: any) {
    return await prisma.coupon.create({
      data: {
        name: data.name,
        type: data.type || 'DISCOUNT',
        discountAmount: data.amount,
        minAmount: data.minAmount,
        totalCount: data.totalCount,
        receivedCount: 0,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        status: this.getCouponStatus(new Date(data.startTime), new Date(data.endTime)) as any
      }
    })
  }

  /**
   * 更新优惠券
   */
  static async updateCoupon(id: string, data: any) {
    return await prisma.coupon.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        discountAmount: data.amount,
        minAmount: data.minAmount,
        totalCount: data.totalCount,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        status: this.getCouponStatus(new Date(data.startTime), new Date(data.endTime)) as any
      }
    })
  }

  /**
   * 删除优惠券
   */
  static async deleteCoupon(id: string) {
    await prisma.coupon.delete({ where: { id } })
  }

  /**
   * 计算优惠券状态
   */
  private static getCouponStatus(startTime: Date, endTime: Date): string {
    const now = new Date()
    if (now < startTime) return 'PENDING'
    if (now > endTime) return 'EXPIRED'
    return 'ACTIVE'
  }

  // ==================== Banner管理 ====================

  /**
   * 获取Banner列表
   */
  static async getBanners(query: any) {
    const pageNum = parseInt(query.page) || 1
    const pageSizeNum = parseInt(query.pageSize) || 20

    const total = await prisma.banner.count()
    const banners = await prisma.banner.findMany({
      orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }],
      skip: (pageNum - 1) * pageSizeNum,
      take: pageSizeNum
    })

    return { items: banners, total, page: pageNum, pageSize: pageSizeNum }
  }

  /**
   * 创建Banner
   */
  static async createBanner(data: any) {
    return await prisma.banner.create({
      data: {
        title: data.title,
        image: data.image,
        link: data.link || '',
        position: data.position || 'HOME',
        sort: data.sort || 0,
        status: data.status || 'ACTIVE'
      }
    })
  }

  /**
   * 更新Banner
   */
  static async updateBanner(id: string, data: any) {
    return await prisma.banner.update({
      where: { id },
      data: {
        title: data.title,
        image: data.image,
        link: data.link,
        position: data.position,
        sort: data.sort,
        status: data.status
      }
    })
  }

  /**
   * 删除Banner
   */
  static async deleteBanner(id: string) {
    await prisma.banner.delete({ where: { id } })
  }

  // ==================== 分类管理 ====================

  /**
   * 获取分类列表（全部，用于构建树）
   */
  static async getCategories() {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { sort: 'asc' }
    })

    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      parentId: cat.parentId,
      sort: cat.sort,
      status: cat.status,
      productCount: cat._count.products,
      createdAt: cat.createdAt
    }))
  }

  /**
   * 创建分类
   */
  static async createCategory(data: any) {
    return await prisma.category.create({
      data: {
        name: data.name,
        icon: data.icon || null,
        parentId: data.parentId || null,
        sort: data.sort || 0,
        status: data.status || 'ACTIVE'
      }
    })
  }

  /**
   * 更新分类
   */
  static async updateCategory(id: string, data: any) {
    return await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        icon: data.icon || null,
        parentId: data.parentId || null,
        sort: data.sort,
        status: data.status
      }
    })
  }

  /**
   * 删除分类
   */
  static async deleteCategory(id: string) {
    // 检查是否有子分类
    const children = await prisma.category.findMany({
      where: { parentId: id }
    })

    // 递归删除子分类
    for (const child of children) {
      await this.deleteCategory(child.id)
    }

    // 删除分类
    await prisma.category.delete({ where: { id } })
  }
}
