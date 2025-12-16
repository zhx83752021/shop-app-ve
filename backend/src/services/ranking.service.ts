import prisma from '../lib/prisma';

/**
 * 排行榜服务
 */
export class RankingService {
  /**
   * 根据类型获取排行榜
   * @param type 排行榜类型 hot(热销榜) | rating(好评榜) | new(新品榜) | favorite(收藏榜)
   */
  static async getRankings(type: string) {
    try {
      let products = [];

      switch (type) {
        case 'hot':
          // 热销榜 - 根据销量排序
          products = await prisma.product.findMany({
            where: { status: 'ACTIVE' },
            orderBy: { sales: 'desc' },
            select: {
              id: true,
              title: true,
              description: true,
              price: true,
              sales: true,
              mainImage: true
            },
            take: 10
          });
          break;

        case 'rating':
          // 好评榜 - 基于浏览量和销量
          products = await prisma.product.findMany({
            where: { status: 'ACTIVE' },
            orderBy: [
              { views: 'desc' },
              { sales: 'desc' }
            ],
            select: {
              id: true,
              title: true,
              description: true,
              price: true,
              sales: true,
              mainImage: true,
              views: true
            },
            take: 10
          });
          break;

        case 'new':
          // 新品榜 - 根据上架时间排序
          products = await prisma.product.findMany({
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              title: true,
              description: true,
              price: true,
              sales: true,
              mainImage: true,
              createdAt: true
            },
            take: 10
          });
          break;

        case 'favorite':
          // 收藏榜 - 通过计算收藏表关联数量
          const results = await prisma.$queryRaw`
            SELECT p.id, p.title, p.description, p.price, p.sales, p."mainImage", COUNT(f.id) as favorite_count
            FROM products p
            LEFT JOIN favorites f ON p.id = f."productId"
            WHERE p.status = 'ACTIVE'
            GROUP BY p.id, p.title, p.description, p.price, p.sales, p."mainImage"
            ORDER BY favorite_count DESC
            LIMIT 10
          `;
          products = results as any[];
          break;

        default:
          // 默认返回热销榜
          products = await prisma.product.findMany({
            where: { status: 'ACTIVE' },
            orderBy: { sales: 'desc' },
            select: {
              id: true,
              title: true,
              description: true,
              price: true,
              sales: true,
              mainImage: true
            },
            take: 10
          });
      }

      // 格式化返回结果
      return products.map((product, index) => ({
        id: product.id,
        title: product.title,
        description: product.description || '暂无描述',
        price: parseFloat(product.price.toString()),
        sales: product.sales,
        image: product.mainImage,
        trend: Math.random() > 0.5 ? 'up' : 'down', // 随机生成趋势
        rank: index + 1
      }));

    } catch (error) {
      console.error('获取排行榜数据失败:', error);
      throw error;
    }
  }
}
