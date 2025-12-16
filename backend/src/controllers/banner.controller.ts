import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * 获取Banner列表
 */
export const getBanners = async (_req: Request, res: Response) => {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        status: 'ACTIVE'
      },
      orderBy: {
        sort: 'asc'
      },
      select: {
        id: true,
        title: true,
        image: true,
        link: true,
        sort: true
      }
    })

    res.json({
      code: 200,
      data: banners,
      message: '获取成功'
    })
  } catch (error) {
    console.error('获取Banner列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取Banner列表失败'
    })
  }
}
