import prisma from '../config/database'
import { hashPassword, verifyPassword } from '../utils/password'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt'

interface RegisterInput {
  phone: string
  password: string
  code: string
}

interface LoginInput {
  phone: string
  password: string
}

/**
 * 认证服务
 */
export class AuthService {
  /**
   * 用户注册
   */
  static async register(input: RegisterInput) {
    const { phone, password, code } = input

    // TODO: 验证短信验证码
    // 这里暂时跳过验证码校验，实际项目中需要从Redis中验证
    console.log('验证码:', code)

    // 检查手机号是否已注册
    const existingUser = await prisma.user.findUnique({
      where: { phone }
    })

    if (existingUser) {
      throw new Error('手机号已注册')
    }

    // 加密密码
    const hashedPassword = await hashPassword(password)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        phone,
        password: hashedPassword,
        nickname: `用户${phone.substring(7)}`
      },
      select: {
        id: true,
        phone: true,
        nickname: true,
        avatar: true,
        memberLevel: true
      }
    })

    // 生成Token
    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    return {
      user: {
        ...user,
        phone: phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      },
      accessToken,
      refreshToken
    }
  }

  /**
   * 用户登录
   */
  static async login(input: LoginInput) {
    const { phone, password } = input

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { phone }
    })

    if (!user) {
      throw new Error('手机号或密码错误')
    }

    // 验证密码
    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      throw new Error('手机号或密码错误')
    }

    // 检查用户状态
    if (user.status !== 'ACTIVE') {
      throw new Error('账号已被禁用')
    }

    // 更新最后登录时间
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    // 生成Token
    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    return {
      user: {
        id: user.id,
        phone: phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
        nickname: user.nickname,
        avatar: user.avatar,
        memberLevel: user.memberLevel,
        points: user.points,
        balance: user.balance.toString()
      },
      accessToken,
      refreshToken
    }
  }

  /**
   * 刷新Token
   */
  static async refreshToken(refreshToken: string) {
    try {
      // 验证刷新令牌
      const payload = verifyRefreshToken(refreshToken)

      // 检查用户是否存在
      const user = await prisma.user.findUnique({
        where: { id: payload.userId }
      })

      if (!user || user.status !== 'ACTIVE') {
        throw new Error('用户不存在或已被禁用')
      }

      // 生成新的访问令牌
      const newAccessToken = generateAccessToken(user.id)

      return {
        accessToken: newAccessToken
      }
    } catch (error) {
      throw new Error('刷新Token失败')
    }
  }

  /**
   * 发送验证码
   */
  static async sendCode(phone: string, type: string) {
    // TODO: 集成短信服务
    // 这里暂时生成一个随机验证码并打印
    const code = Math.random().toString().slice(2, 8)
    console.log(`发送验证码到 ${phone}: ${code}`)

    // TODO: 将验证码存储到Redis中，设置5分钟过期
    // await redis.setex(`sms:${type}:${phone}`, 300, code)

    return {
      message: '验证码已发送',
      // 开发环境下返回验证码，生产环境不应返回
      code: process.env.NODE_ENV === 'development' ? code : undefined
    }
  }
}
