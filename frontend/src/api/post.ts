import http from './http'
import type { Post } from '../types'

export interface GetPostsParams {
  page?: number
  pageSize?: number
  type?: 'IMAGE' | 'VIDEO'
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

export interface Comment {
  id: string
  content: string
  userId: string
  postId: string
  parentId: string | null
  replyToUserId: string | null
  createdAt: string
  user: {
    id: string
    nickname: string
    avatar: string | null
  }
  replyToUser?: {
    id: string
    nickname: string
  }
  replies?: Comment[]
  replyCount?: number
}

/**
 * 获取帖子列表
 */
export const getPosts = (params?: GetPostsParams) => {
  return http.get<any, PaginatedResponse<Post>>('/posts', { params })
}

/**
 * 获取帖子详情
 */
export const getPostById = (id: string) => {
  return http.get<any, Post>(`/posts/${id}`)
}

/**
 * 发布帖子
 */
export const createPost = (data: any) => {
  return http.post('/posts', data)
}

/**
 * 点赞/取消点赞
 */
export const toggleLike = (postId: string) => {
  return http.post(`/posts/${postId}/like`)
}

/**
 * 获取评论列表
 */
export const getComments = (postId: string, page: number = 1, pageSize: number = 20) => {
  return http.get<any, PaginatedResponse<Comment>>(`/posts/${postId}/comments`, {
    params: { page, pageSize }
  })
}

/**
 * 发表评论
 */
export const createComment = (postId: string, content: string, parentId?: string) => {
  return http.post(`/posts/${postId}/comments`, { content, parentId })
}

/**
 * 删除评论
 */
export const deleteComment = (commentId: string) => {
  return http.delete(`/posts/comments/${commentId}`)
}

/**
 * 我的帖子列表
 */
export const getMyPosts = (page: number = 1, pageSize: number = 20) => {
  return http.get('/posts/my', { params: { page, pageSize } })
}
