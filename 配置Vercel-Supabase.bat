@echo off
chcp 65001 >nul
echo ==========================================
echo   配置 Vercel Supabase 数据库
echo ==========================================
echo.

echo 正在更新 backend\.env 文件...
(
    echo # Vercel Supabase PostgreSQL 配置
    echo # 数据库: evnyggvxpxeiincrnbjb.supabase.co
    echo # 区域: US East 1
    echo # 生成时间: %date% %time%
    echo.
    echo NODE_ENV=development
    echo PORT=3000
    echo APP_URL=http://localhost:3000
    echo.
    echo # 数据库连接 - Prisma 优化的连接池
    echo DATABASE_URL="postgres://postgres.evnyggvxpxeiincrnbjb:WY6KMr0YTwkc9ND9@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
    echo.
    echo # 备用连接（无连接池）
    echo # DATABASE_URL="postgres://postgres.evnyggvxpxeiincrnbjb:WY6KMr0YTwkc9ND9@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
    echo.
    echo # Supabase 配置
    echo SUPABASE_URL="https://evnyggvxpxeiincrnbjb.supabase.co"
    echo SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2bnlnZ3Z4cHhlaWluY3JuYmpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NTU2OTgsImV4cCI6MjA4MTQzMTY5OH0.umDesRN5pGVC979nW4vJ9SM5aiJQ8c0_HA23rJLlWHM"
    echo SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2bnlnZ3Z4cHhlaWluY3JuYmpiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTg1NTY5OCwiZXhwIjoyMDgxNDMxNjk4fQ.DwJNKhjyadkKsnvYh489Es0NiPrX3T0L9SJn9Wc5KxY"
    echo.
    echo # JWT配置
    echo JWT_SECRET=dev-secret-key-change-in-production-2024
    echo JWT_EXPIRES_IN=7d
    echo REFRESH_TOKEN_SECRET=dev-refresh-secret-key-2024
    echo REFRESH_TOKEN_EXPIRES_IN=30d
    echo.
    echo # Redis
    echo REDIS_URL=redis://localhost:6379
    echo.
    echo # 文件上传
    echo UPLOAD_DIR=./uploads
    echo MAX_FILE_SIZE=10485760
) > backend\.env

echo ✓ backend\.env 已更新
echo.

echo 生成 Prisma 客户端...
cd backend
call npx prisma generate
if errorlevel 1 (
    echo.
    echo ✗ Prisma 生成失败
    echo 请手动运行: cd backend ^&^& npx prisma generate
    cd ..
    pause
    exit /b 1
)
echo ✓ Prisma 客户端已生成
echo.

echo 推送数据库 Schema 到 Vercel Supabase...
call npx prisma db push
if errorlevel 1 (
    echo.
    echo ✗ 数据库推送失败
    echo.
    echo 可能原因：
    echo 1. 网络连接问题（数据库在美国东部）
    echo 2. SSL连接问题
    echo.
    echo 手动重试：
    echo   cd backend
    echo   npx prisma db push
    cd ..
    pause
    exit /b 1
)
echo ✓ 数据库表结构已创建
echo.

cd ..

echo ==========================================
echo   🎉 配置完成！
echo ==========================================
echo.
echo 数据库: Vercel Supabase (Free Plan)
echo 服务器: db.evnyggvxpxeiincrnbjb.supabase.co
echo 区域: US East 1
echo 状态: ✅ 已连接
echo.
echo ==========================================
echo   重要提示
echo ==========================================
echo.
echo ✓ Vercel 生产环境已自动配置
echo   无需手动添加环境变量！
echo.
echo ✓ 本地开发环境已配置
echo   backend\.env 已更新
echo.
echo ==========================================
echo   测试连接
echo ==========================================
echo.
echo 查看数据库:
echo   cd backend
echo   npx prisma studio
echo   浏览器: http://localhost:5555
echo.
echo 启动后端:
echo   cd backend
echo   npm run dev
echo   API: http://localhost:3000
echo.
echo 启动前端:
echo   cd frontend
echo   npm run dev
echo   前端: http://localhost:5173
echo.
echo ==========================================
echo   Supabase Dashboard
echo ==========================================
echo.
echo 访问: https://evnyggvxpxeiincrnbjb.supabase.co
echo 或通过 Vercel Dashboard → Storage → ecommerce
echo.
pause
