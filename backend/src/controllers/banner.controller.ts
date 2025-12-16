import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * 获取Banner列表
 */
export const getBanners = async (req: Request, res: Response) => {
  try {
    const { position } = req.query

    const where: any = {
      status: 'ACTIVE'
    }

    // 如果指定了位置，则筛选
    if (position) {
      where.position = position
    }

    const banners = await prisma.banner.findMany({
      where,
      orderBy: {
        sort: 'asc'
      },
      select: {
        id: true,
        title: true,
        image: true,
        link: true,
        position: true,
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
