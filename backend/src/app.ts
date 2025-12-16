import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import config from './config'
import logger from './utils/logger'
import routes from './routes'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler'

// 创建Express应用
const app: Application = express()

// 安全中间件
app.use(helmet())

// CORS配置
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production'
      ? ['https://your-app.vercel.app', 'https://your-app-admin.vercel.app']
      : '*',
    credentials: true
  })
)

// 请求体解析
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 请求日志
if (config.env === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// 请求频率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制100次请求
  message: '请求过于频繁，请稍后再试'
})
app.use('/api/', limiter)

// API路由
app.use('/api', routes)

// 404处理
app.use(notFoundHandler)

// 错误处理
app.use(errorHandler)

// 启动服务器
const PORT = config.port

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`🚀 服务器运行在端口 ${PORT}`)
    logger.info(`📝 环境: ${config.env}`)
    logger.info(`🔗 API地址: ${config.appUrl}/api`)
  })
}

export default app
