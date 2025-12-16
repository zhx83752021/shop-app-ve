@echo off
chcp 65001 >nul
echo ========================================
echo    修复部署脚本 - Banner API 修复
echo ========================================
echo.
echo 项目信息：
echo - GitHub: https://github.com/zhx83752021/shop-app-ve.git
echo - Vercel: https://shop.hybergy.cn
echo.

echo [1/4] 检查 Git 状态...
git status
echo.

pause
echo.

echo [2/4] 添加所有修改的文件...
git add .
echo ✓ 文件已添加
echo.

echo [3/4] 提交更改...
git commit -m "修复 Banner API 缺失导致页面数据为空的问题 - 新增 Banner Controller 和 Routes - 修复主路由配置 - 优化数据库初始化脚本"
echo ✓ 更改已提交
echo.

echo [4/4] 推送到 GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo.
    echo ⚠ 推送失败，尝试先拉取最新代码...
    git pull origin main --rebase
    echo.
    echo 重新推送...
    git push origin main
)
echo.

if %errorlevel% equ 0 (
    echo ========================================
    echo    ✓ 代码已成功推送到 GitHub
    echo ========================================
    echo.
    echo 接下来的操作：
    echo.
    echo 1. 等待 Vercel 自动部署（2-5分钟）
    echo    访问：https://vercel.com/dashboard
    echo.
    echo 2. 初始化数据库数据（重要！）
    echo    - 登录 Supabase: https://supabase.com/dashboard
    echo    - 打开 SQL Editor
    echo    - 执行 backend/prisma/quick-seed.sql 的内容
    echo.
    echo 3. 验证修复结果
    echo    访问：https://shop.hybergy.cn/home
    echo    应该看到轮播图和商品数据
    echo.
    echo 详细说明请查看：部署指南.md
    echo ========================================
) else (
    echo ========================================
    echo    ✗ 推送失败，请检查错误信息
    echo ========================================
)

echo.
pause
