@echo off
chcp 65001 >nul
echo ==========================================
echo   完成 Supabase 数据库配置
echo ==========================================
echo.

echo 检查 .env 配置文件...
if exist backend\.env (
    echo ✓ backend\.env 已存在
) else (
    echo ✗ backend\.env 不存在
    echo 请先运行: 快速配置数据库.bat
    pause
    exit /b 1
)
echo.

echo 步骤 1/2: 生成 Prisma 客户端
echo -------------------------------------
cd backend
timeout /t 2 /nobreak >nul
call npx prisma generate
if errorlevel 1 (
    echo.
    echo ✗ Prisma 生成失败
    echo.
    echo 可能原因：
    echo 1. 文件被占用（关闭其他终端和进程）
    echo 2. 权限不足（以管理员身份运行）
    echo.
    echo 手动重试：
    echo   cd backend
    echo   npx prisma generate
    cd ..
    pause
    exit /b 1
)
echo ✓ Prisma 客户端已生成
echo.

echo 步骤 2/2: 推送数据库 Schema 到 Supabase
echo -------------------------------------
timeout /t 1 /nobreak >nul
call npx prisma db push
if errorlevel 1 (
    echo.
    echo ✗ 数据库推送失败
    echo.
    echo 请检查：
    echo 1. Supabase 项目是否正常运行
    echo 2. 网络连接是否正常
    echo 3. 连接字符串是否正确
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
echo 数据库: Supabase PostgreSQL
echo 服务器: db.xidbrgszgwrvqrpckjkw.supabase.co
echo 状态: ✅ 已连接并初始化
echo.
echo ==========================================
echo   测试连接
echo ==========================================
echo.
echo 方式 1 - Prisma Studio (推荐):
echo   cd backend
echo   npx prisma studio
echo   浏览器访问: http://localhost:5555
echo.
echo 方式 2 - 启动后端API:
echo   cd backend
echo   npm run dev
echo   API地址: http://localhost:3000
echo.
echo 方式 3 - 同时启动前后端:
echo   新终端1: cd backend ^&^& npm run dev
echo   新终端2: cd frontend ^&^& npm run dev
echo   前端: http://localhost:5173
echo.
echo ==========================================
echo   Vercel 部署配置（重要！）
echo ==========================================
echo.
echo 1. 访问: https://vercel.com/dashboard
echo 2. 选择项目: shop-app-ve
echo 3. Settings → Environment Variables → Add
echo.
echo    Name: DATABASE_URL
echo    Value: postgresql://postgres:SpoDa7qk1Y0DIfvU@db.xidbrgszgwrvqrpckjkw.supabase.co:5432/postgres
echo.
echo 4. Environments: 勾选 Production, Preview, Development
echo 5. 点击 Save
echo 6. Deployments → 找到最新部署 → Redeploy
echo.
pause
