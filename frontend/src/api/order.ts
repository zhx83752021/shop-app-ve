import http from './http'

export interface CreateOrderParams {
  addressId: string
  cartItemIds: string[]
  couponId?: string
  buyerMessage?: string
}

export interface Order {
  id: string
  orderNo: string
  status: string
  totalAmount: string
  discountAmount: string
  payAmount: string
  buyerMessage: string | null
  createdAt: string
  items: OrderItem[]
  address: OrderAddress
}

export interface OrderItem {
  id: string
  productId: string
  title: string
  mainImage: string
  price: string
  quantity: number
  totalAmount: string
}

export interface OrderAddress {
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
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
 * 创建订单
 */
export const createOrder = (data: CreateOrderParams) => {
  return http.post<any, Order>('/orders', data)
}

/**
 * 获取订单列表
 */
export const getOrders = (status?: string, page: number = 1, pageSize: number = 10) => {
  return http.get<any, PaginatedResponse<Order>>('/orders', {
    params: { status, page, pageSize }
  })
}

/**
 * 获取订单详情
 */
export const getOrderById = (id: string) => {
  return http.get<any, Order>(`/orders/${id}`)
}

/**
 * 支付订单
 */
export const payOrder = (id: string, paymentMethod: string = 'ALIPAY') => {
  return http.post(`/orders/${id}/pay`, { paymentMethod })
}

/**
 * 取消订单
 */
export const cancelOrder = (id: string, reason?: string) => {
  return http.post(`/orders/${id}/cancel`, { reason })
}

/**
 * 确认收货
 */
export const confirmOrder = (id: string) => {
  return http.post(`/orders/${id}/confirm`)
}

/**
 * 申请退款
 */
export const refundOrder = (id: string, reason: string, amount: string) => {
  return http.post(`/orders/${id}/refund`, { reason, amount })
}
