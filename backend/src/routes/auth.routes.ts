import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { validate } from '../middlewares/validator'
import {
  registerSchema,
  loginSchema,
  sendCodeSchema,
  refreshTokenSchema
} from '../validators/auth.validator'

const router = Router()

/**
 * @route   POST /api/auth/register
 * @desc    用户注册
 * @access  Public
 */
router.post('/register', validate(registerSchema), AuthController.register)

/**
 * @route   POST /api/auth/login
 * @desc    用户登录
 * @access  Public
 */
router.post('/login', validate(loginSchema), AuthController.login)

/**
 * @route   POST /api/auth/refresh
 * @desc    刷新Token
 * @access  Public
 */
router.post('/refresh', validate(refreshTokenSchema), AuthController.refreshToken)

/**
 * @route   POST /api/auth/send-code
 * @desc    发送验证码
 * @access  Public
 */
router.post('/send-code', validate(sendCodeSchema), AuthController.sendCode)

export default router
