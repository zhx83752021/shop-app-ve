import dotenv from 'dotenv'
import path from 'path'

// 加载环境变量
dotenv.config()

interface Config {
  env: string
  port: number
  appUrl: string
  database: {
    url: string
  }
  jwt: {
    secret: string
    expiresIn: string
    refreshSecret: string
    refreshExpiresIn: string
  }
  redis?: {
    url: string
  }
  upload: {
    dir: string
    maxFileSize: number
  }
  sms?: {
    accessKey: string
    secretKey: string
    signName: string
    templateCode: string
  }
  wechat?: {
    appId: string
    appSecret: string
    mchId: string
    apiKey: string
  }
  alipay?: {
    appId: string
    privateKey: string
    publicKey: string
  }
  sentry?: {
    dsn: string
  }
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  appUrl: process.env.APP_URL || 'http://localhost:3000',

  database: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/ecommerce'
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d'
  },

  redis: process.env.REDIS_URL
    ? {
        url: process.env.REDIS_URL
      }
    : undefined,

  upload: {
    dir: process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads'),
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10) // 10MB
  },

  sms: process.env.SMS_ACCESS_KEY
    ? {
        accessKey: process.env.SMS_ACCESS_KEY,
        secretKey: process.env.SMS_SECRET_KEY!,
        signName: process.env.SMS_SIGN_NAME!,
        templateCode: process.env.SMS_TEMPLATE_CODE!
      }
    : undefined,

  wechat: process.env.WECHAT_APP_ID
    ? {
        appId: process.env.WECHAT_APP_ID,
        appSecret: process.env.WECHAT_APP_SECRET!,
        mchId: process.env.WECHAT_MCH_ID!,
        apiKey: process.env.WECHAT_API_KEY!
      }
    : undefined,

  alipay: process.env.ALIPAY_APP_ID
    ? {
        appId: process.env.ALIPAY_APP_ID,
        privateKey: process.env.ALIPAY_PRIVATE_KEY!,
        publicKey: process.env.ALIPAY_PUBLIC_KEY!
      }
    : undefined,

  sentry: process.env.SENTRY_DSN
    ? {
        dsn: process.env.SENTRY_DSN
      }
    : undefined
}

export default config
