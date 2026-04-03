# Android Studio 安装脚本
# 以管理员权限运行

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Android Studio 自动安装脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查管理员权限
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "请以管理员权限运行此脚本！" -ForegroundColor Red
    exit 1
}

# 下载链接
$downloadUrl = "https://redirector.gvt1.com/edgedl/android/studio/install/2023.1.1.26/android-studio-2023.1.1.26-windows.exe"
$installerPath = "$env:TEMP\android-studio-installer.exe"

# 下载
Write-Host "[1/3] 正在下载 Android Studio..." -ForegroundColor Yellow
try {
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath -UseBasicParsing
    Write-Host "下载完成！" -ForegroundColor Green
} catch {
    Write-Host "下载失败: $_" -ForegroundColor Red
    Write-Host "请手动下载: https://developer.android.com/studio" -ForegroundColor Yellow
    exit 1
}

# 安装
Write-Host "[2/3] 正在安装 Android Studio..." -ForegroundColor Yellow
Write-Host "这可能需要几分钟，请耐心等待..." -ForegroundColor Gray
try {
    $process = Start-Process -FilePath $installerPath -ArgumentList "/S", "/ALLUSERS" -Wait -PassThru
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
Write-Host "  Android Studio 安装完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "下一步:" -ForegroundColor Cyan
Write-Host "1. 打开 Android Studio" -ForegroundColor White
Write-Host "2. 选择 Standard 安装" -ForegroundColor White
Write-Host "3. 等待 SDK 下载完成" -ForegroundColor White
Write-Host "4. 创建模拟器 (AVD)" -ForegroundColor White
