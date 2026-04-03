# 快速方案：直接使用 Python + PyLaTeX 编译
# 不需要安装 MiKTeX

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "方案选择" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "MiKTeX 安装可能需要10-15分钟" -ForegroundColor Yellow
Write-Host ""
Write-Host "推荐替代方案：" -ForegroundColor Green
Write-Host ""
Write-Host "方案A: 使用 Overleaf 在线编译（1-2分钟）" -ForegroundColor Cyan
Write-Host "  - 文件已准备好: ai-protein-interactions-review-overleaf.zip" -ForegroundColor Gray
Write-Host "  - 无需安装任何软件" -ForegroundColor Gray
Write-Host "  - 访问 https://www.overleaf.com 上传即可" -ForegroundColor Gray
Write-Host ""
Write-Host "方案B: 等待 MiKTeX 安装完成（5-10分钟）" -ForegroundColor Cyan
Write-Host "  - 安装后可本地编译" -ForegroundColor Gray
Write-Host "  - 需要在弹出窗口中点击 Install" -ForegroundColor Gray
Write-Host ""
Write-Host "方案C: 使用 Docker（如果已安装）" -ForegroundColor Cyan
Write-Host "  docker run --rm -v `"${PWD}`":/data blang/latex:ubuntu pdflatex /data/latex/main.tex" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否安装了 Docker
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "[检测到 Docker] 可以使用 Docker 编译" -ForegroundColor Green
}

# 检查安装进度
$pdflatexPaths = @(
    "$env:LOCALAPPDATA\Programs\MiKTeX\miktex\bin\x64\pdflatex.exe",
    "$env:LOCALAPPDATA\Programs\MiKTeX\miktex\bin\pdflatex.exe"
)

foreach ($path in $pdflatexPaths) {
    if (Test-Path $path) {
        Write-Host ""
        Write-Host "[MiKTeX 已安装] $path" -ForegroundColor Green
        Write-Host ""
        Write-Host "现在可以编译:" -ForegroundColor Yellow
        Write-Host "  cd C:\Users\1990h\.openclaw\workspace\projects\ai-protein-interactions-review\latex" -ForegroundColor White
        Write-Host "  & `"$path`" main.tex" -ForegroundColor White
        Write-Host ""
    }
}
