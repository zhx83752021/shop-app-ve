@echo off
chcp 65001 >nul
echo ==========================================
echo   配置 Supabase PostgreSQL
echo ==========================================
echo.

echo 正在创建 backend\.env 文件...
(
    echo # Supabase PostgreSQL 配置
    echo # 自动生成时间: %date% %time%
    echo.
    echo NODE_ENV=development
    echo PORT=3000
    echo APP_URL=http://localhost:3000
    echo.
    echo # Supabase 数据库
    echo DATABASE_URL=postgresql://postgres:SpoDa7qk1Y0DIfvU@db.xidbrgszgwrvqrpckjkw.supabase.co:5432/postgres
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

echo ✓ backend\.env 已创建
echo.

echo 开始安装依赖...
cd backend
call npm install
if errorlevel 1 (
    echo.
    echo ✗ 依赖安装失败
    echo 请检查网络连接或手动运行: cd backend ^&^& npm install
    cd ..
    pause
    exit /b 1
)
echo ✓ 依赖安装成功
echo.

echo 生成 Prisma 客户端...
call npx prisma generate
if errorlevel 1 (
    echo.
    echo ✗ Prisma 生成失败
    cd ..
    pause
    exit /b 1
)
echo ✓ Prisma 客户端已生成
echo.

echo 推送数据库 Schema 到 Supabase...
call npx prisma db push
if errorlevel 1 (
    echo.
    echo ✗ 数据库推送失败
    echo 请检查：
    echo 1. Supabase 项目是否正常运行
    echo 2. 连接字符串是否正确
    echo 3. 网络连接是否正常
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
echo 配置文件: backend\.env
echo 数据库: Supabase PostgreSQL (500MB)
echo 连接: db.xidbrgszgwrvqrpckjkw.supabase.co
echo.
echo ==========================================
echo   测试数据库连接
echo ==========================================
echo.
echo 查看数据库（Prisma Studio）:
echo   cd backend
echo   npx prisma studio
echo   浏览器访问: http://localhost:5555
echo.
echo 启动后端服务:
echo   cd backend
echo   npm run dev
echo   API地址: http://localhost:3000
echo.
echo ==========================================
echo   Vercel 部署配置
echo ==========================================
echo.
echo 1. 访问: https://vercel.com/dashboard
echo 2. 选择项目: shop-app-ve
echo 3. Settings → Environment Variables
echo 4. 添加变量:
echo.
echo    Name: DATABASE_URL
echo    Value: postgresql://postgres:SpoDa7qk1Y0DIfvU@db.xidbrgszgwrvqrpckjkw.supabase.co:5432/postgres
echo    Environments: 全选
echo.
echo 5. 保存并重新部署
echo.
echo ==========================================
echo   下一步
echo ==========================================
echo.
echo 1. 查看数据库表: cd backend ^&^& npx prisma studio
echo 2. 启动后端: cd backend ^&^& npm run dev
echo 3. 启动前端: cd frontend ^&^& npm run dev
echo 4. 配置 Vercel 环境变量
echo 5. 推送代码自动部署
echo.
pause
