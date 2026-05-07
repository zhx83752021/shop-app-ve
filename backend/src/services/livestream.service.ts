import prisma from '../config/database'
import { Prisma } from '@prisma/client'

export class LiveStreamService {
  /**
   * 获取直播列表
   */
  static async getLiveStreams(query: any) {
    const { page = 1, pageSize = 10, status } = query

    const where: Prisma.LiveStreamWhereInput = {}
    
    if (status) {
      where.status = status
    }

    const total = await prisma.liveStream.count({ where })

    const streams = await prisma.liveStream.findMany({
      where,
      include: {
        anchor: {
          select: {
            id: true,
            nickname: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: Number(pageSize)
    })

    return {
      items: streams,
      total,
      page: Number(page),
      pageSize: Number(pageSize)
    }
  }

  /**
   * 获取直播间详情
   */
  static async getLiveStreamById(id: string) {
    const stream = await prisma.liveStream.findUnique({
      where: { id },
      include: {
        anchor: {
          select: {
            id: true,
            nickname: true,
            avatar: true
          }
        },
        products: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                mainImage: true,
                price: true,
                originalPrice: true
              }
            }
          },
          orderBy: { sort: 'asc' }
        }
      }
    })

    if (!stream) {
      throw new Error('直播间不存在')
    }

    return stream
  }
}
