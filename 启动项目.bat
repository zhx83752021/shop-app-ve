@echo off
chcp 65001 > nul
echo ========================================
echo 零售电商平台 - 启动所有服务
echo ========================================
echo.
echo [检查] 检查数据库服务...
netstat -ano | findstr ":5432" > nul
if %errorlevel% neq 0 (
    echo ⚠ PostgreSQL 数据库未运行！
    echo 请先启动 PostgreSQL 数据库服务
    echo.
    pause
    exit /b 1
)
echo ✓ 数据库服务正常运行
echo.
echo [启动] 准备启动所有服务...
echo.
echo 后端服务将运行在: http://localhost:3001
echo 前端应用将运行在: http://localhost:5173
echo 管理后台将运行在: http://localhost:3002
echo.
echo 即将启动所有服务...
timeout /t 2 > nul
echo.
REM 启动后端服务
echo [1/3] 启动后端服务...
start "后端服务 - Port 3001" cmd /k "cd /d e:\app3\backend && npm run dev"
timeout /t 3 > nul
REM 启动前端应用
echo [2/3] 启动前端应用...
start "前端应用 - Port 5173" cmd /k "cd /d e:\app3\frontend && npm run dev"
timeout /t 3 > nul
REM 启动管理后台
echo [3/3] 启动管理后台...
start "管理后台 - Port 3002" cmd /k "cd /d e:\app3\admin && npm run dev"
timeout /t 2 > nul
echo.
echo ========================================
echo ✓ 所有服务已启动！
echo ========================================
echo.
echo 访问地址:
echo - 前端应用: http://localhost:5173
echo - 管理后台: http://localhost:3002
echo - 后端API:  http://localhost:3001
echo.
echo 关闭所有窗口即可停止服务
echo.
