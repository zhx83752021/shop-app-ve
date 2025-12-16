import http from './http'

export interface UserProfile {
  id: string
  phone: string
  nickname: string
  avatar: string | null
  gender: string | null
  birthday: string | null
  memberLevel: string
  points: number
  balance: string
  createdAt: string
}

export interface Address {
  id: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
}

export interface Order {
  id: string
  orderNo: string
  status: string
  totalAmount: string
  payAmount: string
  createdAt: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  productId: string
  title: string
  mainImage: string
  price: string
  quantity: number
}

/**
 * 获取用户信息
 */
export const getUserProfile = () => {
  return http.get<any, UserProfile>('/user/profile')
}

/**
 * 更新用户信息
 */
export const updateUserProfile = (data: Partial<UserProfile>) => {
  return http.put('/user/profile', data)
}

/**
 * 修改密码
 */
export const updatePassword = (oldPassword: string, newPassword: string) => {
  return http.put('/user/password', { oldPassword, newPassword })
}

/**
 * 获取地址列表
 */
export const getAddresses = () => {
  return http.get<any, Address[]>('/user/addresses')
}

/**
 * 添加地址
 */
export const addAddress = (data: Omit<Address, 'id'>) => {
  return http.post('/user/addresses', data)
}

/**
 * 更新地址
 */
export const updateAddress = (id: string, data: Partial<Address>) => {
  return http.put(`/user/addresses/${id}`, data)
}

/**
 * 删除地址
 */
export const deleteAddress = (id: string) => {
  return http.delete(`/user/addresses/${id}`)
}

/**
 * 获取收藏列表
 */
export const getFavorites = (page: number = 1, pageSize: number = 20) => {
  return http.get('/user/favorites', { params: { page, pageSize } })
}

/**
 * 添加收藏
 */
export const addFavorite = (productId: string) => {
  return http.post('/user/favorites', { productId })
}

/**
 * 取消收藏
 */
export const removeFavorite = (productId: string) => {
  return http.delete(`/user/favorites/${productId}`)
}

/**
 * 获取浏览历史
 */
export const getBrowseHistory = (page: number = 1, pageSize: number = 20) => {
  return http.get('/user/browse-history', { params: { page, pageSize } })
}

/**
 * 清空浏览历史
 */
export const clearBrowseHistory = () => {
  return http.delete('/user/browse-history')
}

/**
 * 关注用户
 */
export const followUser = (userId: string) => {
  return http.post('/user/follow', { userId })
}

/**
 * 取消关注用户
 */
export const unfollowUser = (userId: string) => {
  return http.delete(`/user/follow/${userId}`)
}

/**
 * 获取关注列表
 */
export const getFollowList = (page: number = 1, pageSize: number = 20) => {
  return http.get('/user/follow', { params: { page, pageSize } })
}

/**
 * 检查是否关注某用户
 */
export const checkFollowStatus = (userId: string) => {
  return http.get<any, { isFollowing: boolean }>(`/user/follow/check/${userId}`)
}

/**
 * 每日签到
 */
export const dailyCheckIn = () => {
  return http.post('/user/check-in')
}

/**
 * 检查今日是否已签到
 */
export const checkTodayCheckIn = () => {
  return http.get<any, { hasCheckedIn: boolean, points: number }>('/user/check-in/status')
}

/**
 * 检查商品收藏状态
 */
export const checkFavoriteStatus = (productId: string) => {
  return http.get<any, { isFavorite: boolean }>(`/user/favorites/check/${productId}`)
}
