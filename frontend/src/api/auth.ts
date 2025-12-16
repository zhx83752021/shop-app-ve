import http from './http'

export interface LoginParams {
  phone: string
  password: string
}

export interface RegisterParams {
  phone: string
  password: string
  code: string
}

export interface LoginResponse {
  user: {
    id: string
    phone: string
    nickname: string
    avatar: string | null
    memberLevel: string
    points: number
    balance: string
  }
  accessToken: string
  refreshToken: string
}

/**
 * 用户登录
 */
export const login = (data: LoginParams) => {
  return http.post<any, LoginResponse>('/auth/login', data)
}

/**
 * 用户注册
 */
export const register = (data: RegisterParams) => {
  return http.post<any, LoginResponse>('/auth/register', data)
}

/**
 * 发送验证码
 */
export const sendCode = (phone: string) => {
  return http.post<any, { message: string; code?: string }>('/auth/send-code', { phone, type: 'register' })
}

/**
 * 刷新Token
 */
export const refreshToken = (refreshToken: string) => {
  return http.post('/auth/refresh', { refreshToken })
}
