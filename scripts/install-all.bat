@echo off
chcp 65001 >nul
echo ========================================
echo   HomeBox Local 开发环境安装
echo ========================================
echo.
echo 此脚本将安装以下工具:
echo 1. Android Studio (~1GB, 15-30分钟)
echo 2. 微信开发者工具 (~200MB, 5分钟)
echo.
echo 请以管理员权限运行此脚本！
echo.
pause

echo.
echo [1/2] 安装 Android Studio...
powershell -ExecutionPolicy Bypass -File "%~dp0install-android-studio.ps1"

echo.
echo [2/2] 安装微信开发者工具...
powershell -ExecutionPolicy Bypass -File "%~dp0install-wechat-devtools.ps1"

echo.
echo ========================================
echo   所有工具安装完成！
echo ========================================
echo.
echo 下一步:
echo 1. 打开 Android Studio，完成初始配置
echo 2. 创建 Android 模拟器 (AVD)
echo 3. 打开微信开发者工具，扫码登录
echo 4. 运行项目测试
echo.
pause
