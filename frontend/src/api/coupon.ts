import http from './http'

export interface Coupon {
  id: string
  name: string
  type: 'FULL_DISCOUNT' | 'DISCOUNT_RATE'
  discountAmount: string
  minAmount: string
  totalCount: number
  receivedCount: number
  startTime: string
  endTime: string
  status: string
  createdAt: string
}

export interface UserCoupon {
  id: string
  status: 'UNUSED' | 'USED' | 'EXPIRED'
  usedAt: string | null
  createdAt: string
  coupon: Coupon
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

/**
 * 获取优惠券列表
 */
export const getCoupons = (page: number = 1, pageSize: number = 20) => {
  return http.get<any, PaginatedResponse<Coupon>>('/coupons', {
    params: { page, pageSize }
  })
}

/**
 * 领取优惠券
 */
export const claimCoupon = (couponId: string) => {
  return http.post(`/coupons/${couponId}/claim`)
}

/**
 * 领取优惠券（别名）
 */
export const receiveCoupon = claimCoupon

/**
 * 我的优惠券列表
 */
export const getMyCoupons = (status?: string, page: number = 1, pageSize: number = 20) => {
  return http.get<any, PaginatedResponse<UserCoupon>>('/coupons/my', {
    params: { status, page, pageSize }
  })
}

/**
 * 获取可用优惠券
 */
export const getAvailableCoupons = (totalAmount: number) => {
  return http.get<any, UserCoupon[]>('/coupons/available', {
    params: { totalAmount }
  })
}
