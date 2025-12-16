import http from './http'

export const login = (data: { username: string; password: string }) => {
  return http.post('/admin/login', data)
}

export const getDashboard = () => {
  return http.get('/admin/dashboard')
}

export const getProducts = (params?: any) => {
  return http.get('/admin/products', { params })
}

export const createProduct = (data: any) => {
  return http.post('/admin/products', data)
}

export const updateProduct = (id: string, data: any) => {
  return http.put(`/admin/products/${id}`, data)
}

export const deleteProduct = (id: string) => {
  return http.delete(`/admin/products/${id}`)
}

export const getOrders = (params?: any) => {
  return http.get('/admin/orders', { params })
}

export const shipOrder = (id: string, data: any) => {
  return http.post(`/admin/orders/${id}/ship`, data)
}

export const getUsers = (params?: any) => {
  return http.get('/admin/users', { params })
}

export const updateUserStatus = (id: string, status: string) => {
  return http.put(`/admin/users/${id}/status`, { status })
}

export const getRefunds = (params?: any) => {
  return http.get('/admin/refunds', { params })
}

export const processRefund = (id: string, data: any) => {
  return http.post(`/admin/refunds/${id}/process`, data)
}

export const getPosts = (params?: any) => {
  return http.get('/admin/posts', { params })
}

export const reviewPost = (id: string, data: any) => {
  return http.put(`/admin/posts/${id}/review`, data)
}
