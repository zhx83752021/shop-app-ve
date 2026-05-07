import { Request, Response, NextFunction } from 'express'
import { LiveStreamService } from '../services/livestream.service'
import { success, paginated } from '../utils/response'

export class LiveStreamController {
  /**
   * 获取直播列表
   */
  static async getLiveStreams(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await LiveStreamService.getLiveStreams(req.query)
      return paginated(res, result.items, result.total, result.page, result.pageSize)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 获取直播间详情
   */
  static async getLiveStreamById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const result = await LiveStreamService.getLiveStreamById(id)
      return success(res, result)
    } catch (error) {
      next(error)
    }
  }
}
