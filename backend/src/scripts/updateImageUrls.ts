import { PrismaClient } from '@prisma/client'
import logger from '../utils/logger'

const prisma = new PrismaClient()

async function updateImageUrls() {
  try {
    logger.info('开始更新图片URL...')

    // 更新商品图片
    const products = await prisma.product.findMany()
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      const randomBase = (i * 3) + 1
      
      await prisma.product.update({
        where: { id: product.id },
        data: {
          mainImage: `https://picsum.photos/400/400?random=${randomBase}`,
          images: [
            `https://picsum.photos/400/400?random=${randomBase}`,
            `https://picsum.photos/400/400?random=${randomBase + 1}`,
            `https://picsum.photos/400/400?random=${randomBase + 2}`
          ]
        }
      })
      
      logger.info(`✓ 更新商品 ${i + 1}/${products.length}: ${product.title}`)
    }

    // 更新Banner图片
    const banners = await prisma.banner.findMany()
    
    for (let i = 0; i < banners.length; i++) {
      const banner = banners[i]
      const randomId = 13 + i
      
      await prisma.banner.update({
        where: { id: banner.id },
        data: {
          image: `https://picsum.photos/800/400?random=${randomId}`
        }
      })
      
      logger.info(`✓ 更新Banner ${i + 1}/${banners.length}: ${banner.title}`)
    }

    logger.info('✅ 图片URL更新完成！')
  } catch (error) {
    logger.error('更新图片URL失败:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

updateImageUrls()
