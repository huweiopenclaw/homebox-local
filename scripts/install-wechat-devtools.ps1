# 微信开发者工具安装脚本
# 以管理员权限运行

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  微信开发者工具 自动安装脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查管理员权限
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "请以管理员权限运行此脚本！" -ForegroundColor Red
    exit 1
}

# 下载链接
$downloadUrl = "https://dldir1.qq.com/WechatWebDev/release/be1ec64cf6184b0fa64091919793f068/wechat_devtools_1.06.2307260_x64.exe"
$installerPath = "$env:TEMP\wechat-devtools-installer.exe"

# 下载
Write-Host "[1/3] 正在下载微信开发者工具..." -ForegroundColor Yellow
try {
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath -UseBasicParsing
    Write-Host "下载完成！" -ForegroundColor Green
} catch {
    Write-Host "下载失败: $_" -ForegroundColor Red
    Write-Host "请手动下载: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html" -ForegroundColor Yellow
    exit 1
}

# 安装
Write-Host "[2/3] 正在安装微信开发者工具..." -ForegroundColor Yellow
try {
    $process = Start-Process -FilePath $installerPath -ArgumentList "/S" -Wait -PassThru
    if ($process.ExitCode -eq 0) {
        Write-Host "安装完成！" -ForegroundColor Green
    } else {
        Write-Host "安装返回代码: $($process.ExitCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "安装失败: $_" -ForegroundColor Red
    exit 1
}

# 清理
Write-Host "[3/3] 清理临时文件..." -ForegroundColor Yellow
Remove-Item -Path $installerPath -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  微信开发者工具 安装完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "下一步:" -ForegroundColor Cyan
Write-Host "1. 打开微信开发者工具" -ForegroundColor White
Write-Host "2. 使用微信扫码登录" -ForegroundColor White
Write-Host "3. 导入项目: miniprogram/" -ForegroundColor White
