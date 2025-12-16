import prisma from '../config/database'

/**
 * 优惠券服务
 */
export class CouponService {
  /**
   * 获取优惠券列表
   */
  static async getCoupons(page: number = 1, pageSize: number = 20) {
    const now = new Date()

    const where = {
      status: 'ACTIVE' as const,
      startTime: { lte: now },
      endTime: { gte: now }
    }

    const total = await prisma.coupon.count({ where })

    const coupons = await prisma.coupon.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    })

    return {
      items: coupons.map((coupon) => ({
        ...coupon,
        minAmount: coupon.minAmount.toString(),
        discountAmount: coupon.discountAmount.toString()
      })),
      total,
      page,
      pageSize
    }
  }

  /**
   * 领取优惠券
   */
  static async claimCoupon(userId: string, couponId: string) {
    const coupon = await prisma.coupon.findUnique({
      where: { id: couponId }
    })

    if (!coupon) {
      throw new Error('优惠券不存在')
    }

    if (coupon.status !== 'ACTIVE') {
      throw new Error('优惠券已失效')
    }

    const now = new Date()
    if (now < coupon.startTime || now > coupon.endTime) {
      throw new Error('不在领取时间范围内')
    }

    if (coupon.totalCount <= coupon.receivedCount) {
      throw new Error('优惠券已被领完')
    }

    // 检查是否已领取
    const existingUserCoupon = await prisma.userCoupon.findFirst({
      where: {
        userId,
        couponId,
        status: 'UNUSED'
      }
    })

    if (existingUserCoupon) {
      throw new Error('您已领取过该优惠券')
    }

    // 领取优惠券
    const result = await prisma.$transaction(async (tx) => {
      const userCoupon = await tx.userCoupon.create({
        data: {
          userId,
          couponId
        }
      })

      await tx.coupon.update({
        where: { id: couponId },
        data: {
          receivedCount: { increment: 1 }
        }
      })

      return userCoupon
    })

    return result
  }

  /**
   * 我的优惠券列表
   */
  static async getMyCoupons(userId: string, status?: string, page: number = 1, pageSize: number = 20) {
    const where: any = { userId }

    if (status) {
      where.status = status
    }

    const total = await prisma.userCoupon.count({ where })

    const userCoupons = await prisma.userCoupon.findMany({
      where,
      include: {
        coupon: true
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    })

    return {
      items: userCoupons.map((uc) => ({
        id: uc.id,
        status: uc.status,
        usedAt: uc.usedAt,
        createdAt: uc.createdAt,
        coupon: {
          ...uc.coupon,
          minAmount: uc.coupon.minAmount.toString(),
          discountAmount: uc.coupon.discountAmount.toString()
        }
      })),
      total,
      page,
      pageSize
    }
  }

  /**
   * 获取可用优惠券
   */
  static async getAvailableCoupons(userId: string, totalAmount: number) {
    const now = new Date()

    const userCoupons = await prisma.userCoupon.findMany({
      where: {
        userId,
        status: 'UNUSED'
      },
      include: {
        coupon: true
      }
    })

    const availableCoupons = userCoupons.filter((uc) => {
      const coupon = uc.coupon
      return (
        coupon.status === 'ACTIVE' &&
        now >= coupon.startTime &&
        now <= coupon.endTime &&
        Number(coupon.minAmount) <= totalAmount
      )
    })

    return availableCoupons.map((uc) => ({
      id: uc.id,
      coupon: {
        ...uc.coupon,
        minAmount: uc.coupon.minAmount.toString(),
        discountAmount: uc.coupon.discountAmount.toString()
      }
    }))
  }

  /**
   * 获取Banner列表
   */
  static async getBanners() {
    const banners = await prisma.banner.findMany({
      where: {
        status: 'ACTIVE'
      },
      orderBy: { sort: 'asc' }
    })

    return banners
  }
}
