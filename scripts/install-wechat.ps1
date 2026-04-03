# WeChat Developer Tools Installation Script
# Run as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  WeChat DevTools Installer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "Please run as Administrator!" -ForegroundColor Red
    exit 1
}

# Download URL
$downloadUrl = "https://dldir1.qq.com/WechatWebDev/release/be1ec64cf6184b0fa64091919793f068/wechat_devtools_1.06.2307260_x64.exe"
$installerPath = "$env:TEMP\wechat-devtools-installer.exe"

# Download
Write-Host "[1/3] Downloading WeChat DevTools..." -ForegroundColor Yellow
try {
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath -UseBasicParsing
    Write-Host "Download complete!" -ForegroundColor Green
} catch {
    Write-Host "Download failed: $_" -ForegroundColor Red
    Write-Host "Please download manually: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html" -ForegroundColor Yellow
    exit 1
}

# Install
Write-Host "[2/3] Installing WeChat DevTools..." -ForegroundColor Yellow
try {
    $process = Start-Process -FilePath $installerPath -ArgumentList "/S" -Wait -PassThru
    if ($process.ExitCode -eq 0) {
        Write-Host "Installation complete!" -ForegroundColor Green
    } else {
        Write-Host "Exit code: $($process.ExitCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Installation failed: $_" -ForegroundColor Red
    exit 1
}

# Cleanup
Write-Host "[3/3] Cleaning up..." -ForegroundColor Yellow
Remove-Item -Path $installerPath -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  WeChat DevTools installed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Open WeChat DevTools" -ForegroundColor White
Write-Host "2. Scan QR code with WeChat" -ForegroundColor White
Write-Host "3. Import project: miniprogram/" -ForegroundColor White
