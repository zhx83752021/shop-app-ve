import http from './http'

export interface LiveStream {
  id: string
  anchorId: string
  title: string
  cover: string
  viewers: number
  tags: string[]
  status: 'PREPARING' | 'LIVE' | 'ENDED'
  startTime: string | null
  endTime: string | null
  createdAt: string
  updatedAt: string
  anchor: {
    id: string
    nickname: string
    avatar: string
  }
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
 * 获取直播列表
 */
export const getLiveStreams = (params?: { page?: number; pageSize?: number; status?: string }) => {
  return http.get<any, PaginatedResponse<LiveStream>>('/livestreams', { params })
}

/**
 * 获取直播详情
 */
export const getLiveStreamById = (id: string) => {
  return http.get<any, LiveStream>(`/livestreams/${id}`)
}
