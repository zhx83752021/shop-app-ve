import prisma from './config/database'

async function seedLiveStreams() {
  const user = await prisma.user.findFirst()
  if (!user) {
    console.log('No user found, please run standard seed first.')
    return
  }

  const existingStreams = await prisma.liveStream.count()
  if (existingStreams > 0) {
    console.log('Live streams already seeded.')
    return
  }

  await prisma.liveStream.createMany({
    data: [
      {
        anchorId: user.id,
        title: '【限时抢购】Apple iPhone 15 Pro 超值优惠',
        cover: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=300&fit=crop',
        viewers: 12580,
        tags: ['数码', '限时优惠', '热卖'],
        status: 'LIVE',
      },
      {
        anchorId: user.id,
        title: '美妆护肤专场 大牌好物直降',
        cover: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop',
        viewers: 8763,
        tags: ['美妆', '护肤', '新品'],
        status: 'LIVE',
      },
      {
        anchorId: user.id,
        title: 'Nike运动鞋专场 全场5折起',
        cover: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
        viewers: 15420,
        tags: ['运动', '服饰', '折扣'],
        status: 'LIVE',
      }
    ]
  })

  console.log('Seeded live streams successfully.')
}

seedLiveStreams()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
