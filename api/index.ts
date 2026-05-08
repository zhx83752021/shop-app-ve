import fs from 'fs'
import path from 'path'
import express, { Request, Response, Router } from 'express'
import cors from 'cors'
import helmet from 'helmet'

/** Vercel 构建会把 backend/dist 拷到 api/.server-dist；本地开发可直接用 backend/dist */
function loadApiRoutes(): Router {
  const candidates = [
    path.join(__dirname, '.server-dist', 'routes'),
    path.join(__dirname, '..', 'backend', 'dist', 'routes'),
  ]
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, 'index.js'))) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mod = require(dir)
      return (mod.default ?? mod) as Router
    }
  }
  throw new Error(
    '未找到后端编译产物：请先执行 npm run vercel-build，或在 backend 目录执行 npm run build'
  )
}

const routes = loadApiRoutes()

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
