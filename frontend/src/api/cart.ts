import http from './http'
import type { CartItem } from '../types'

/**
 * 获取购物车
 */
export const getCart = () => {
  return http.get<any, {
    items: any[]
    totalAmount: string
    selectedCount: number
  }>('/cart')
}

/**
 * 添加到购物车
 */
export const addToCart = (productId: string, quantity: number = 1) => {
  return http.post('/cart', { productId, quantity })
}

/**
 * 更新购物车商品数量
 */
export const updateCartItem = (cartItemId: string, quantity: number) => {
  return http.put(`/cart/${cartItemId}`, { quantity })
}

/**
 * 删除购物车商品
 */
export const deleteCartItem = (cartItemId: string) => {
  return http.delete(`/cart/${cartItemId}`)
}

/**
 * 全选/取消全选
 */
export const selectAll = (selected: boolean) => {
  return http.put('/cart/select-all', { selected })
}

/**
 * 清空购物车
 */
export const clearCart = () => {
  return http.delete('/cart')
}

/**
 * 获取推荐商品
 */
export const getRecommendProducts = () => {
  return http.get<any, any[]>('/products/recommend')
}
