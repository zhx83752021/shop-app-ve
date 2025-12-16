import { Response } from 'express'

interface SuccessResponse<T = any> {
  code: number
  message: string
  data?: T
}

interface ErrorResponse {
  code: number
  message: string
  error?: string
}

interface PaginatedData<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * 成功响应
 */
export function success<T>(res: Response, data?: T, message: string = 'success'): Response {
  const response: SuccessResponse<T> = {
    code: 200,
    message,
    data
  }
  return res.status(200).json(response)
}

/**
 * 创建成功响应
 */
export function created<T>(res: Response, data?: T, message: string = 'created'): Response {
  const response: SuccessResponse<T> = {
    code: 201,
    message,
    data
  }
  return res.status(201).json(response)
}

/**
 * 分页响应
 */
export function paginated<T>(
  res: Response,
  items: T[],
  total: number,
  page: number,
  pageSize: number
): Response {
  const totalPages = Math.ceil(total / pageSize)
  const data: PaginatedData<T> = {
    items,
    total,
    page,
    pageSize,
    totalPages
  }
  return success(res, data)
}

/**
 * 错误响应
 */
export function error(res: Response, message: string, code: number = 400, errorDetail?: string): Response {
  const response: ErrorResponse = {
    code,
    message,
    error: errorDetail
  }
  return res.status(code).json(response)
}

/**
 * 未认证响应
 */
export function unauthorized(res: Response, message: string = '未认证'): Response {
  return error(res, message, 401)
}

/**
 * 无权限响应
 */
export function forbidden(res: Response, message: string = '无权限'): Response {
  return error(res, message, 403)
}

/**
 * 未找到响应
 */
export function notFound(res: Response, message: string = '资源不存在'): Response {
  return error(res, message, 404)
}

/**
 * 服务器错误响应
 */
export function serverError(res: Response, message: string = '服务器错误', errorDetail?: string): Response {
  return error(res, message, 500, errorDetail)
}
