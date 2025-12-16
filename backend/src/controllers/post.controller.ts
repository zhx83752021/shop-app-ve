import { Request, Response, NextFunction } from 'express'
import { PostService } from '../services/post.service'
import { success, created, paginated } from '../utils/response'

/**
 * 帖子控制器
 */
export class PostController {
  /**
   * 获取帖子列表
   */
  static async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId // 可选，用于获取点赞和关注状态
      const result = await PostService.getPosts(req.query, userId)
      return paginated(res, result.items, result.total, result.page, result.pageSize)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 获取帖子详情
   */
  static async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const userId = req.userId
      const post = await PostService.getPostById(id, userId)
      return success(res, post)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 发布帖子
   */
  static async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const post = await PostService.createPost(userId, req.body)
      return created(res, post, '发布成功,待审核')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 点赞/取消点赞
   */
  static async toggleLike(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { id } = req.params
      const result = await PostService.toggleLike(userId, id)
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 获取评论列表
   */
  static async getComments(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { page, pageSize } = req.query
      const result = await PostService.getComments(
        id,
        parseInt(page as string) || 1,
        parseInt(pageSize as string) || 20
      )
      return paginated(res, result.items, result.total, result.page, result.pageSize)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 发表评论
   */
  static async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { id } = req.params
      const comment = await PostService.createComment(userId, id, req.body)
      return created(res, comment, '评论成功')
    } catch (error) {
      next(error)
    }
  }

  /**
   * 删除评论
   */
  static async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { id } = req.params
      const result = await PostService.deleteComment(userId, id)
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 我的帖子列表
   */
  static async getMyPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { page, pageSize } = req.query
      const result = await PostService.getMyPosts(
        userId,
        parseInt(page as string) || 1,
        parseInt(pageSize as string) || 20
      )
      return paginated(res, result.items, result.total, result.page, result.pageSize)
    } catch (error) {
      next(error)
    }
  }
}
