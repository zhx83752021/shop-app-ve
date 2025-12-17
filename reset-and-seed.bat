@echo off
chcp 65001 >nul
echo ====================================
echo    数据库重置和初始化工具
echo ====================================
echo.

echo [1/3] 设置环境变量...
set DATABASE_URL=postgres://postgres.evnyggvxpxeiincrnbjb:WY6KMr0YTwkc9ND9@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require

echo [2/3] 删除旧数据...
cd backend
call npm run reset:data
if %errorlevel% neq 0 (
    echo 删除数据失败！
    pause
    exit /b 1
)

echo.
echo [3/3] 重新初始化数据库...
cd ..
powershell -Command "$body = @{secretKey='_sb_secret_TtsIShXnMEEk83oDooN2Ng_3JjGWg4L'} | ConvertTo-Json; Invoke-RestMethod -Uri 'https://shop.hybergy.cn/api/seed/initialize' -Method Post -Body $body -ContentType 'application/json'"

echo.
echo ====================================
echo    完成！
echo ====================================
echo.
echo 现在可以访问以下页面验证：
echo - https://shop.hybergy.cn/home
echo - https://shop.hybergy.cn/live-stream
echo.
pause
