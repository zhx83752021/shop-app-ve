import prisma from '../config/database'
import { Prisma } from '@prisma/client'

/**
 * 订单服务
 */
export class OrderService {
  /**
   * 创建订单
   */
  static async createOrder(userId: string, data: any) {
    const { addressId, cartItemIds, couponId, buyerMessage } = data

    // 验证地址
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId }
    })
    if (!address) {
      throw new Error('收货地址不存在')
    }

    // 获取购物车商品
    const cartItems = await prisma.cartItem.findMany({
      where: {
        id: { in: cartItemIds },
        userId
      },
      include: {
        product: true
      }
    })

    if (cartItems.length === 0) {
      throw new Error('购物车商品不存在')
    }

    // 检查库存和计算总价
    let totalAmount = 0
    const orderItems: any[] = []

    for (const item of cartItems) {
      if (item.product.status !== 'ACTIVE') {
        throw new Error(`商品 ${item.product.title} 已下架`)
      }
      if (item.product.stock < item.quantity) {
        throw new Error(`商品 ${item.product.title} 库存不足`)
      }

      const itemTotal = Number(item.product.price) * item.quantity
      totalAmount += itemTotal

      orderItems.push({
        productId: item.productId,
        productTitle: item.product.title,
        productImage: item.product.mainImage,
        price: item.product.price,
        quantity: item.quantity,
        totalAmount: itemTotal
      })
    }

    // 计算优惠金额
    let discountAmount = 0
    if (couponId) {
      const userCoupon = await prisma.userCoupon.findFirst({
        where: {
          id: couponId,
          userId,
          status: 'UNUSED'
        },
        include: {
          coupon: true
        }
      })

      if (userCoupon && userCoupon.coupon.status === 'ACTIVE') {
        const now = new Date()
        if (now >= userCoupon.coupon.startTime && now <= userCoupon.coupon.endTime) {
          if (totalAmount >= Number(userCoupon.coupon.minAmount)) {
            discountAmount = Number(userCoupon.coupon.discountAmount)
          }
        }
      }
    }

    // 计算实付金额
    const actualAmount = Math.max(totalAmount - discountAmount, 0)

    // 生成订单号
    const orderNo = `ORD${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // 创建订单
    const order = await prisma.$transaction(async (tx) => {
      // 创建订单
      const newOrder = await tx.order.create({
        data: {
          orderNo,
          userId,
          addressId,
          totalAmount,
          discountAmount,
          actualAmount,
          buyerMessage,
          items: {
            create: orderItems
          }
        },
        include: {
          items: true,
          address: true
        }
      })

      // 扣减库存
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity }
          }
        })
      }

      // 标记优惠券为已使用（如果有）
      if (couponId) {
        await tx.userCoupon.update({
          where: { id: couponId },
          data: {
            status: 'USED',
            usedAt: new Date()
          }
        })
      }

      // 清空购物车
      await tx.cartItem.deleteMany({
        where: {
          id: { in: cartItemIds }
        }
      })

      return newOrder
    })

    return {
      ...order,
      totalAmount: order.totalAmount.toString(),
      discountAmount: order.discountAmount.toString(),
      actualAmount: order.actualAmount.toString()
    }
  }

  /**
   * 获取订单列表
   */
  static async getOrders(userId: string, status?: string, page: number = 1, pageSize: number = 20) {
    const where: Prisma.OrderWhereInput = { userId }
    if (status) {
      where.status = status as any
    }

    const total = await prisma.order.count({ where })

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          select: {
            id: true,
            productTitle: true,
            productImage: true,
            price: true,
            quantity: true,
            totalAmount: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    })

    return {
      items: orders.map((order) => ({
        ...order,
        totalAmount: order.totalAmount.toString(),
        discountAmount: order.discountAmount.toString(),
        shippingFee: order.shippingFee.toString(),
        actualAmount: order.actualAmount.toString(),
        items: order.items.map((item) => ({
          ...item,
          price: item.price.toString(),
          totalAmount: item.totalAmount.toString()
        }))
      })),
      total,
      page,
      pageSize
    }
  }

  /**
   * 获取订单详情
   */
  static async getOrderById(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId
      },
      include: {
        items: true,
        address: true,
        refund: true
      }
    })

    if (!order) {
      throw new Error('订单不存在')
    }

    return {
      ...order,
      totalAmount: order.totalAmount.toString(),
      discountAmount: order.discountAmount.toString(),
      shippingFee: order.shippingFee.toString(),
      actualAmount: order.actualAmount.toString(),
      items: order.items.map((item) => ({
        ...item,
        price: item.price.toString(),
        totalAmount: item.totalAmount.toString()
      })),
      refund: order.refund ? {
        ...order.refund,
        refundAmount: order.refund.refundAmount.toString()
      } : null
    }
  }

  /**
   * 支付订单
   */
  static async payOrder(userId: string, orderId: string, paymentMethod: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId
      }
    })

    if (!order) {
      throw new Error('订单不存在')
    }

    if (order.status !== 'PENDING_PAYMENT') {
      throw new Error('订单状态不正确')
    }

    // TODO: 集成真实支付
    // 这里模拟支付成功
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PENDING_SHIP',
        paymentMethod: paymentMethod as any,
        paymentTime: new Date()
      }
    })

    // 增加销量
    const items = await prisma.orderItem.findMany({
      where: { orderId }
    })

    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          sales: { increment: item.quantity }
        }
      })
    }

    return {
      ...updatedOrder,
      totalAmount: updatedOrder.totalAmount.toString(),
      actualAmount: updatedOrder.actualAmount.toString()
    }
  }

  /**
   * 取消订单
   */
  static async cancelOrder(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId
      },
      include: {
        items: true
      }
    })

    if (!order) {
      throw new Error('订单不存在')
    }

    if (order.status !== 'PENDING_PAYMENT') {
      throw new Error('只能取消待付款订单')
    }

    // 恢复库存
    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity }
          }
        })
      }

      await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'CLOSED',
          closeTime: new Date(),
          closeReason: '用户取消'
        }
      })
    })

    return { message: '订单已取消' }
  }

  /**
   * 确认收货
   */
  static async confirmOrder(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId
      }
    })

    if (!order) {
      throw new Error('订单不存在')
    }

    if (order.status !== 'SHIPPED') {
      throw new Error('订单未发货')
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'COMPLETED',
        confirmTime: new Date()
      }
    })

    return { message: '确认收货成功' }
  }

  /**
   * 申请退款
   */
  static async createRefund(userId: string, orderId: string, data: any) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId
      }
    })

    if (!order) {
      throw new Error('订单不存在')
    }

    if (!['PENDING_SHIP', 'SHIPPED', 'COMPLETED'].includes(order.status)) {
      throw new Error('当前订单状态不支持退款')
    }

    // 检查是否已有退款申请
    const existingRefund = await prisma.refund.findUnique({
      where: { orderId }
    })

    if (existingRefund) {
      throw new Error('该订单已申请退款')
    }

    // 生成退款单号
    const refundNo = `REF${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    const refund = await prisma.$transaction(async (tx) => {
      const newRefund = await tx.refund.create({
        data: {
          refundNo,
          orderId,
          userId,
          refundAmount: order.actualAmount,
          refundReason: data.refundReason,
          refundType: data.refundType
        }
      })

      await tx.order.update({
        where: { id: orderId },
        data: { status: 'REFUNDING' }
      })

      return newRefund
    })

    return {
      ...refund,
      refundAmount: refund.refundAmount.toString()
    }
  }
}
