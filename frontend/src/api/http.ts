import axios from 'axios'

// 创建axios实例
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    const { data } = response

    // 统一处理API响应格式
    // 当有code和message字段时，按标准格式处理
    if (data && typeof data === 'object') {
      if (data.code === 200) {
        return data.data; // 成功时返回数据
      } else if (data.code) {
        // 服务器返回了错误状态码
        return Promise.reject(new Error(data.message || '请求失败'));
      } else {
        // 兼容已经是数据的情况，如数组等
        return data;
      }
    }

    // 其他情况直接返回
    return data;
  },
  async (error) => {
    if (error.response) {
      const { status, data } = error.response

      // token过期，尝试刷新
      if (status === 401) {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          try {
            const res = await axios.post(`${http.defaults.baseURL}/auth/refresh`, {
              refreshToken
            })

            const { accessToken, refreshToken: newRefreshToken } = res.data.data
            localStorage.setItem('access_token', accessToken)
            localStorage.setItem('refresh_token', newRefreshToken)

            // 重试原请求
            error.config.headers.Authorization = `Bearer ${accessToken}`
            return http.request(error.config)
          } catch (refreshError) {
            // 刷新失败，清除token并跳转登录
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            window.location.href = '/login'
            return Promise.reject(refreshError)
          }
        } else {
          window.location.href = '/login'
        }
      }

      return Promise.reject(new Error(data?.message || '请求失败'))
    }

    return Promise.reject(error)
  }
)

export default http
