import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { UploadController } from '../controllers/upload.controller'
import { authenticate } from '../middlewares/auth'

const router = Router()

// 确保上传目录存在
const uploadDir = path.join(process.cwd(), 'public/uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// 配置文件存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    if (extname && mimetype) {
      return cb(null, true)
    }
    cb(new Error('仅支持上传图片格式 (jpg, png, gif, webp)'))
  }
})

// 路由定义
router.post('/image', authenticate, upload.single('image'), UploadController.uploadImage)

export default router
