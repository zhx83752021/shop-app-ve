import { Router } from 'express';
import { getRankings } from '../controllers/ranking.controller';

const router = Router();

/**
 * @api {get} /rankings 获取排行榜数据
 * @apiName GetRankings
 * @apiGroup Rankings
 *
 * @apiQuery {String} type 排行榜类型，可选值: hot(热销榜)、rating(好评榜)、new(新品榜)、favorite(收藏榜)
 *
 * @apiSuccess {Object[]} rankings 排行榜数据
 * @apiSuccess {String} rankings.id 商品ID
 * @apiSuccess {String} rankings.title 商品标题
 * @apiSuccess {String} rankings.description 商品描述
 * @apiSuccess {Number} rankings.price 商品价格
 * @apiSuccess {Number} rankings.sales 销量
 * @apiSuccess {String} rankings.image 商品图片
 * @apiSuccess {String} rankings.trend 趋势，值为 'up' 或 'down'
 */
router.get('/', getRankings);

export default router;
