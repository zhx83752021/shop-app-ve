import { Request, Response, NextFunction } from 'express'
import path from 'path'
import fs from 'fs'
import { success } from '../utils/response'

/**
 * 上传控制器
 */
export class UploadController {
  /**
   * 上传单张图片
   */
  static async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new Error('请选择要上传的文件')
      }

      // 生成访问URL
      // 在生产环境中，这里应该是上传到 OSS 后的 URL
      const protocol = req.protocol
      const host = req.get('host')
      const filePath = `/uploads/${req.file.filename}`
      const url = `${protocol}://${host}${filePath}`

      return success(res, {
        url,
        filename: req.file.filename,
        size: req.file.size
      }, '上传成功')
    } catch (error) {
      next(error)
    }
  }
}
