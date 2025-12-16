@echo off
echo ========================================
echo 检查Admin配置
echo ========================================
echo.
echo 1. 检查http.ts文件内容:
type src\api\http.ts | findstr "baseURL"
echo.
echo 2. 检查是否有缓存文件:
if exist "node_modules\.vite" (
    echo [警告] 发现Vite缓存目录
) else (
    echo [正常] 无Vite缓存
)
echo.
echo 3. 检查服务端口:
netstat -ano | findstr "3005 3001"
echo.
echo ========================================
pause
