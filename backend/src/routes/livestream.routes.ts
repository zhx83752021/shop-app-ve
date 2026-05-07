import { Router } from 'express'
import { LiveStreamController } from '../controllers/livestream.controller'

const router = Router()

// 获取直播列表
router.get('/', LiveStreamController.getLiveStreams)

// 获取直播间详情
router.get('/:id', LiveStreamController.getLiveStreamById)

export default router
