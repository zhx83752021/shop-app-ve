import http from './http'

/**
 * 获取地址列表
 */
export const getAddresses = () => {
  return http.get('/user/addresses')
}

/**
 * 添加地址
 */
export const addAddress = (data: any) => {
  return http.post('/user/addresses', data)
}

/**
 * 更新地址
 */
export const updateAddress = (id: string, data: any) => {
  return http.put(`/user/addresses/${id}`, data)
}

/**
 * 删除地址
 */
export const deleteAddress = (id: string) => {
  return http.delete(`/user/addresses/${id}`)
}

/**
 * 设为默认地址
 */
export const setDefaultAddress = (id: string) => {
  return http.put(`/user/addresses/${id}/default`)
}
