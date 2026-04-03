# 快速安装 MiKTeX 便携版（无需管理员权限）
$downloadUrl = "https://miktex.org/download/ctan/systems/win32/miktex/setup/windows-x64/basic-miktex-24.1-x64.exe"
$downloadPath = "$env:USERPROFILE\Downloads\basic-miktex-24.1-x64.exe"

Write-Host "下载 MiKTeX 便携版..." -ForegroundColor Green
Write-Host "URL: $downloadUrl" -ForegroundColor Cyan
Write-Host "保存到: $downloadPath" -ForegroundColor Cyan
Write-Host ""

# 下载
Invoke-WebRequest -Uri $downloadUrl -OutFile $downloadPath -UseBasicParsing

Write-Host ""
Write-Host "下载完成!" -ForegroundColor Green
Write-Host "文件大小: $((Get-Item $downloadPath).Length / 1MB) MB" -ForegroundColor Cyan
Write-Host ""
Write-Host "安装步骤:" -ForegroundColor Yellow
Write-Host "  1. 双击运行: $downloadPath" -ForegroundColor White
Write-Host "  2. 选择 'Install for current user only'" -ForegroundColor White
Write-Host "  3. 安装路径使用默认" -ForegroundColor White
Write-Host "  4. 等待安装完成（约10分钟）" -ForegroundColor White
Write-Host ""
Write-Host "安装后:" -ForegroundColor Yellow
Write-Host "  - 关闭并重新打开 PowerShell" -ForegroundColor White
Write-Host "  - 运行: pdflatex main.tex" -ForegroundColor White
Write-Host ""

# 打开下载文件夹
explorer "$env:USERPROFILE\Downloads"
