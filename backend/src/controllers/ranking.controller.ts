import { Request, Response } from 'express';
import { RankingService } from '../services/ranking.service';

/**
 * 获取排行榜数据
 * @param req 请求对象
 * @param res 响应对象
 */
export const getRankings = async (req: Request, res: Response) => {
  const { type } = req.query;

  try {
    // 验证排行榜类型
    if (!type || typeof type !== 'string' || !['hot', 'rating', 'new', 'favorite'].includes(type)) {
      return res.status(400).json({
        code: 400,
        message: '无效的排行榜类型',
        data: null
      });
    }

    // 使用服务获取排行榜数据
    const rankings = await RankingService.getRankings(type);

    // 返回统一格式响应
    res.json({
      code: 200,
      message: 'success',
      data: rankings
    });
  } catch (error) {
    console.error('获取排行榜数据失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      data: null
    });
  }
};
