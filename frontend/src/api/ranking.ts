import http from './http'

/**
 * 获取排行榜列表
 * @param type 排行榜类型：hot(热销榜) | rating(好评榜) | new(新品榜) | favorite(收藏榜)
 */
export const getRankingList = (type: string) => {
  return http.get('/rankings', { params: { type } })
}
