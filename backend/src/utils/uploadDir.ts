import path from 'path'

/**
 * 上传目录：Vercel Serverless 仅 /tmp 可写；本地默认 public/uploads。
 */
export function resolveUploadDir(): string {
  if (process.env.UPLOAD_DIR) {
    return path.resolve(process.env.UPLOAD_DIR)
  }
  if (process.env.VERCEL) {
    return path.join('/tmp', 'uploads')
  }
  return path.join(process.cwd(), 'public/uploads')
}
