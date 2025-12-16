import winston from 'winston'
import config from '../config'

const { combine, timestamp, printf, colorize, errors } = winston.format

// 自定义日志格式
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`
})

// 创建传输器数组
const transports: winston.transport[] = [
  // 控制台输出（所有环境）
  new winston.transports.Console({
    format: combine(
      colorize(),
      logFormat
    )
  })
]

// 只在开发环境启用文件日志（Vercel Serverless环境不支持文件写入）
if (config.env !== 'production') {
  transports.push(
    // 错误日志文件
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // 所有日志文件
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5
    })
  )
}

// 创建 logger 实例
const logger = winston.createLogger({
  level: config.env === 'production' ? 'info' : 'debug',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports
})

export default logger
