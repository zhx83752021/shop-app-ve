import { PrismaClient } from '@prisma/client'
import logger from '../utils/logger'

const prisma = new PrismaClient()

async function updateImageUrls() {
  try {
    logger.info('开始更新图片URL为主题匹配的Unsplash图片...')

    // 更新商品图片 - 根据商品标题匹配相应的Unsplash图片
    const products = await prisma.product.findMany()
    
    // 定义商品类型对应的Unsplash图片URL映射
    const productImageMapping: Record<string, { mainImage: string; images: string[] }> = {
      '运动鞋': {
        mainImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop'
        ]
      },
      '精华液': {
        mainImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop'
        ]
      },
      '耳机': {
        mainImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&h=400&fit=crop'
        ]
      },
      '登山包': {
        mainImage: 'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=400&h=400&fit=crop'
        ]
      },
      '车厘子': {
        mainImage: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=400&fit=crop'
        ]
      }
    }
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      
      // 根据标题关键词匹配图片
      let imageData = null
      for (const [keyword, images] of Object.entries(productImageMapping)) {
        if (product.title.includes(keyword)) {
          imageData = images
          break
        }
      }
      
      // 如果找到匹配的图片，则更新
      if (imageData) {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            mainImage: imageData.mainImage,
            images: imageData.images
          }
        })
        logger.info(`✓ 更新商品 ${i + 1}/${products.length}: ${product.title}`)
      } else {
        logger.info(`⊘ 跳过商品 ${i + 1}/${products.length}: ${product.title} (未找到匹配)`)
      }
    }

    // 更新Banner图片
    const banners = await prisma.banner.findMany()
    
    const bannerImages = [
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=800&h=400&fit=crop'
    ]
    
    for (let i = 0; i < banners.length; i++) {
      const banner = banners[i]
      const imageIndex = i % bannerImages.length
      
      await prisma.banner.update({
        where: { id: banner.id },
        data: {
          image: bannerImages[imageIndex]
        }
      })
      
      logger.info(`✓ 更新Banner ${i + 1}/${banners.length}: ${banner.title}`)
    }

    logger.info('✅ 图片URL更新完成！所有图片已替换为主题匹配的Unsplash图片')
  } catch (error) {
    logger.error('更新图片URL失败:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

updateImageUrls()
