import http from './http'
import type { Banner } from '../types'

/**
 * 获取Banner列表
 */
export const getBanners = () => {
  return http.get<any, Banner[]>('/banners')
}
