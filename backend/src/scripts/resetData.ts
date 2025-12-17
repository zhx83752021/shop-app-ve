import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetData() {
  try {
    console.log('🗑️  开始删除旧数据...')
    
    // 删除商品数据
    const deletedProducts = await prisma.product.deleteMany({})
    console.log(`✓ 删除了 ${deletedProducts.count} 个商品`)
    
    // 删除 Banner 数据
    const deletedBanners = await prisma.banner.deleteMany({})
    console.log(`✓ 删除了 ${deletedBanners.count} 个 Banner`)
    
    // 删除帖子数据
    const deletedPosts = await prisma.post.deleteMany({})
    console.log(`✓ 删除了 ${deletedPosts.count} 个帖子`)
    
    console.log('✅ 旧数据删除完成！')
    console.log('')
    console.log('现在可以运行初始化命令：')
    console.log('cd ..')
    console.log('$body = @{secretKey="_sb_secret_TtsIShXnMEEk83oDooN2Ng_3JjGWg4L"} | ConvertTo-Json')
    console.log('Invoke-RestMethod -Uri "https://shop.hybergy.cn/api/seed/initialize" -Method Post -Body $body -ContentType "application/json"')
  } catch (error) {
    console.error('❌ 删除数据失败:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

resetData()
