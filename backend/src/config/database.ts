import { PrismaClient } from '@prisma/client'
import logger from '../utils/logger'

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query'
    },
    {
      emit: 'event',
      level: 'error'
    },
    {
      emit: 'event',
      level: 'info'
    },
    {
      emit: 'event',
      level: 'warn'
    }
  ]
})

// 查询日志
prisma.$on('query' as never, (e: any) => {
  logger.debug(`Query: ${e.query}`)
  logger.debug(`Duration: ${e.duration}ms`)
})

// 错误日志
prisma.$on('error' as never, (e: any) => {
  logger.error('Prisma Error:', e)
})

// 优雅关闭
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export default prisma
