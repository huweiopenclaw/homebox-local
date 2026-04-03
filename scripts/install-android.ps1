# Android Studio Installation Script
# Run as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Android Studio Installer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "Please run as Administrator!" -ForegroundColor Red
    exit 1
}

# Download URL
$downloadUrl = "https://redirector.gvt1.com/edgedl/android/studio/install/2023.1.1.26/android-studio-2023.1.1.26-windows.exe"
$installerPath = "$env:TEMP\android-studio-installer.exe"

# Download
Write-Host "[1/3] Downloading Android Studio..." -ForegroundColor Yellow
try {
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath -UseBasicParsing
    Write-Host "Download complete!" -ForegroundColor Green
} catch {
    Write-Host "Download failed: $_" -ForegroundColor Red
    Write-Host "Please download manually: https://developer.android.com/studio" -ForegroundColor Yellow
    exit 1
}

# Install
Write-Host "[2/3] Installing Android Studio..." -ForegroundColor Yellow
Write-Host "This may take several minutes..." -ForegroundColor Gray
try {
    $process = Start-Process -FilePath $installerPath -ArgumentList "/S", "/ALLUSERS" -Wait -PassThru
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
Write-Host "  Android Studio installed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Open Android Studio" -ForegroundColor White
Write-Host "2. Select Standard installation" -ForegroundColor White
Write-Host "3. Wait for SDK download" -ForegroundColor White
Write-Host "4. Create an emulator (AVD)" -ForegroundColor White
