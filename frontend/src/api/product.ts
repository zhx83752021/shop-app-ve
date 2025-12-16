import http from './http'
import type { Product } from '../types'

export interface GetProductsParams {
  page?: number
  pageSize?: number
  categoryId?: string
  keyword?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price' | 'sales' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
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
 * 获取商品列表
 */
export const getProducts = (params?: GetProductsParams) => {
  return http.get<any, PaginatedResponse<Product>>('/products', { params })
}

/**
 * 获取商品详情
 */
export const getProductById = (id: string) => {
  return http.get<any, Product>(`/products/${id}`)
}

/**
 * 获取推荐商品
 */
export const getRecommendProducts = (limit: number = 10) => {
  return http.get<any, Product[]>('/products/recommend', { params: { limit } })
}

/**
 * 获取分类列表
 */
export const getCategories = () => {
  return http.get('/categories')
}

/**
 * 搜索建议
 */
export const getSearchSuggestions = (keyword: string) => {
  return http.get('/products/search/suggest', { params: { keyword } })
}

/**
 * 获取秒杀商品列表
 */
export const getFlashSaleProducts = (page: number = 1, pageSize: number = 20) => {
  return http.get<any, PaginatedResponse<Product>>('/products/flash-sale', { params: { page, pageSize } })
}

/**
 * 搜索商品
 */
export const searchProducts = (keyword: string, page: number = 1, pageSize: number = 20) => {
  return http.get<any, PaginatedResponse<Product>>('/products/search', { params: { keyword, page, pageSize } })
}
