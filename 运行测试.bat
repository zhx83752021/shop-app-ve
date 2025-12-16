@echo off
chcp 65001 > nul
echo ========================================
echo 电商平台自动化测试
echo ========================================
echo.

echo [1/4] 检查服务状态...
echo.

REM 检查后端是否运行
netstat -ano | findstr ":3001" > nul
if %errorlevel% equ 0 (
    echo ✓ 后端服务已运行 (端口 3001^)
) else (
    echo × 后端服务未运行！
    echo 请先在另一个终端运行: cd e:\app3\backend ^&^& npm run dev
    echo.
    pause
    exit /b 1
)

REM 检查数据库是否运行
netstat -ano | findstr ":5432" > nul
if %errorlevel% equ 0 (
    echo ✓ 数据库服务已运行 (端口 5432^)
) else (
    echo × 数据库服务未运行！
    echo 请先启动 PostgreSQL 数据库
    echo.
    pause
    exit /b 1
)

echo.
echo [2/4] 安装测试依赖...
cd /d e:\app3\frontend
call npm install --silent
if %errorlevel% neq 0 (
    echo × 安装依赖失败！
    pause
    exit /b 1
)

echo.
echo [3/4] 安装 Playwright 浏览器...
call npx playwright install chromium --with-deps
if %errorlevel% neq 0 (
    echo × 安装浏览器失败！
    pause
    exit /b 1
)

echo.
echo [4/4] 开始运行测试...
echo.
call npm run test:e2e

echo.
echo ========================================
echo 测试完成！
echo ========================================
echo.
echo 查看测试报告: npm run test:e2e:report
echo.
pause
