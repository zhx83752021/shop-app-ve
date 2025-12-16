import express, { Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import routes from '../backend/src/routes'

// 创建简化的Express应用用于Vercel Serverless
const app = express()

// 中间件
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({
  origin: '*',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 健康检查
app.get('/api', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString(),
    database: process.env.DATABASE_URL ? 'Connected' : 'Not configured'
  })
})

// 导入真正的后端路由
app.use('/api', routes)

// 错误处理
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err)
  res.status(500).json({
    success: false,
    message: '服务器错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

export default app
