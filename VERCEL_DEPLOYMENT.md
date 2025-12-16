# Vercel 部署指南 - 前后端同项目部署
## 一键部署（前后端一起）
本项目已配置为前后端在同一个 Vercel 项目中部署，无需分开部署。
### 1. 登录 Vercel
访问 https://vercel.com 并登录你的账号
### 2. 导入项目
1. 点击 "Add New..." → "Project"
2. 选择 "Import Git Repository"
3. 输入仓库地址: `https://github.com/zhx83752021/shop-app-ve`
4. 点击 "Import"
### 3. 配置项目
#### 基本设置
- **Framework Preset**: Vite
- **Root Directory**: 留空（使用根目录）
- **Build Command**: `npm run vercel-build`（自动配置）
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install`
#### 环境变量
在 Vercel 项目设置的 "Environment Variables" 中添加：
```bash
# 前端API配置（已自动配置为相对路径，无需手动设置）
VITE_API_BASE_URL=/api
# 数据库配置（如使用Vercel Postgres）
DATABASE_URL=postgresql://user:password@host:port/database
# JWT配置
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
# 其他配置
NODE_ENV=production
```
**注意**: 前端已配置使用相对路径 `/api`，无需额外配置 API 地址
### 4. 部署
点击 "Deploy" 按钮，等待构建完成
部署完成后，你将获得一个 `.vercel.app` 域名，例如：
```
https://shop-app-ve.vercel.app
```
## 自定义域名（可选）
1. 在 Vercel 项目设置中选择 "Domains"
2. 添加你的自定义域名
3. 按照提示配置 DNS 记录
## 后续更新
### 方式一：通过 Git 推送自动部署
每次推送代码到 GitHub，Vercel 会自动检测并重新部署：
```bash
git add .
git commit -m "更新说明"
git push origin main
```
### 方式二：手动触发部署
在 Vercel 项目页面点击 "Redeploy" 按钮
## 后端部署建议
Vercel 主要适合部署前端静态网站和 Serverless API。对于本项目的后端，建议使用以下服务：
### 推荐选项 1: Railway
- 网址: https://railway.app
- 支持 Node.js + PostgreSQL
- 免费额度: $5/月
- 适合全栈应用
### 推荐选项 2: Render
- 网址: https://render.com
- 支持 Node.js + PostgreSQL
- 有免费套餐
- 部署简单
### 推荐选项 3: Fly.io
- 网址: https://fly.io
- 支持 Node.js
- 全球 CDN 加速
- 有免费额度
## 环境变量配置清单
### 前端 (Vercel)
```
VITE_API_BASE_URL=https://your-backend-url.com/api
```
### 后端（如部署）
```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
# 文件上传
UPLOAD_DIR=/tmp/uploads
MAX_FILE_SIZE=10485760
# 短信服务（可选）
SMS_ACCESS_KEY=your_access_key
SMS_SECRET_KEY=your_secret_key
SMS_SIGN_NAME=your_sign_name
SMS_TEMPLATE_CODE=your_template_code
```
## 数据库配置
### 使用 Vercel Postgres（推荐）
1. 在 Vercel 项目中点击 "Storage"
2. 创建 Postgres 数据库
3. 自动获得 `DATABASE_URL` 环境变量
### 使用 Supabase（免费）
1. 访问 https://supabase.com
2. 创建项目
3. 获取 PostgreSQL 连接字符串
4. 在 Vercel 中配置 `DATABASE_URL`
## 常见问题
### 1. 构建失败
- 检查 Node 版本是否匹配（建议 18.x 或 20.x）
- 检查依赖是否正确安装
- 查看构建日志中的错误信息
### 2. API 请求失败
- 确认 `VITE_API_BASE_URL` 配置正确
- 检查后端服务是否正常运行
- 检查 CORS 配置
### 3. 页面 404
- 确认 `vercel.json` 中的 rewrites 配置正确
- 检查路由配置是否正确
### 4. 环境变量不生效
- 环境变量名必须以 `VITE_` 开头才能在前端访问
- 修改环境变量后需要重新部署
## 性能优化建议
1. **启用 Vercel Analytics**
   - 在项目设置中启用 Analytics
   - 监控页面性能和访问数据
2. **配置缓存策略**
   - 静态资源自动缓存
   - API 响应可配置缓存头
3. **图片优化**
   - 使用 Vercel Image Optimization
   - 配置图片 CDN
4. **启用压缩**
   - Vercel 自动启用 Gzip/Brotli 压缩
## 监控和日志
### 查看部署日志
1. 进入 Vercel 项目页面
2. 点击 "Deployments"
3. 选择具体的部署记录查看日志
### 查看运行时日志
1. 点击 "Functions"
2. 选择具体的函数查看运行日志
## 团队协作
### 添加团队成员
1. 在项目设置中选择 "Team"
2. 邀请团队成员
3. 设置权限级别
### 环境分离
- **Production**: main 分支自动部署
- **Preview**: 其他分支自动生成预览链接
- **Development**: 本地开发环境
## 费用说明
Vercel 免费套餐包含：
- ✅ 无限部署
- ✅ 100GB 带宽/月
- ✅ 自动 HTTPS
- ✅ 自动 CDN
- ✅ 无限 Serverless 函数执行（有时间限制）
超出免费额度后的收费标准请参考：
https://vercel.com/pricing
## 技术支持
- Vercel 文档: https://vercel.com/docs
- GitHub Issues: https://github.com/zhx83752021/shop-app-ve/issues
- 项目维护者: zhx83752021
