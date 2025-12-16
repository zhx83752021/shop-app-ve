@echo off
chcp 65001 >nul
echo ==========================================
echo   Supabase PostgreSQL 快速配置向导
echo ==========================================
echo.

echo 步骤 1/4: 获取Supabase连接字符串
echo -------------------------------------
echo 1. 打开浏览器访问: https://supabase.com/dashboard
echo 2. 进入项目: shop-app-ecommerce
echo 3. Settings → Database → Connection string → URI
echo 4. 复制完整的连接字符串
echo.
echo 示例格式:
echo postgresql://postgres.xxxxx:SpoDa7qk1Y0DIfvU@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
echo.
pause

echo.
echo 步骤 2/4: 配置环境变量
echo -------------------------------------
set /p DATABASE_URL="粘贴你的DATABASE_URL: "

if "%DATABASE_URL%"=="" (
    echo 错误: DATABASE_URL不能为空
    pause
    exit /b 1
)

echo.
echo 正在创建 backend\.env 文件...
(
    echo # Supabase PostgreSQL 配置
    echo # 生成时间: %date% %time%
    echo.
    echo NODE_ENV=development
    echo PORT=3000
    echo APP_URL=http://localhost:3000
    echo.
    echo # Supabase 数据库
    echo DATABASE_URL=%DATABASE_URL%
    echo.
    echo # JWT配置
    echo JWT_SECRET=dev-secret-key-change-in-production
    echo JWT_EXPIRES_IN=7d
    echo REFRESH_TOKEN_SECRET=dev-refresh-secret-key
    echo REFRESH_TOKEN_EXPIRES_IN=30d
    echo.
    echo # Redis
    echo REDIS_URL=redis://localhost:6379
    echo.
    echo # 文件上传
    echo UPLOAD_DIR=./uploads
    echo MAX_FILE_SIZE=10485760
) > backend\.env

echo ✓ backend\.env 已创建
echo.

echo 步骤 3/4: 安装依赖和生成Prisma客户端
echo -------------------------------------
cd backend
echo 安装依赖...
call npm install
if errorlevel 1 (
    echo 错误: 依赖安装失败
    cd ..
    pause
    exit /b 1
)

echo.
echo 生成Prisma客户端...
call npx prisma generate
if errorlevel 1 (
    echo 错误: Prisma生成失败
    cd ..
    pause
    exit /b 1
)

echo ✓ Prisma客户端已生成
echo.

echo 步骤 4/4: 推送数据库Schema
echo -------------------------------------
echo 即将创建数据库表结构...
echo.
set /p CONFIRM="确认推送Schema到Supabase? (Y/N): "
if /i "%CONFIRM%"=="Y" (
    call npx prisma db push
    if errorlevel 1 (
        echo 错误: 数据库推送失败
        cd ..
        pause
        exit /b 1
    )
    echo ✓ 数据库Schema已创建
) else (
    echo 跳过数据库推送，稍后可手动执行: npx prisma db push
)

cd ..

echo.
echo ==========================================
echo   🎉 配置完成！
echo ==========================================
echo.
echo 后端配置文件: backend\.env
echo 数据库: Supabase PostgreSQL (500MB)
echo.
echo 下一步:
echo 1. 启动后端: cd backend ^&^& npm run dev
echo 2. 查看数据库: cd backend ^&^& npx prisma studio
echo 3. 配置Vercel环境变量（见下方）
echo.
echo ==========================================
echo   Vercel环境变量配置
echo ==========================================
echo.
echo 登录 Vercel Dashboard:
echo 1. https://vercel.com/dashboard
echo 2. 选择项目: shop-app-ve
echo 3. Settings → Environment Variables
echo 4. 添加以下变量:
echo.
echo    Name: DATABASE_URL
echo    Value: %DATABASE_URL%
echo    Environment: Production, Preview, Development
echo.
echo 5. 保存后重新部署项目
echo.
pause
