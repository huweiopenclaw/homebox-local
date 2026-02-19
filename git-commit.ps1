# Git 提交脚本
# 配置 Git 用户信息
git config user.email "huweiopenclaw@sina.com"
git config user.name "HOC"

# 添加所有更改
git add -A

# 查看状态
Write-Host "Git 状态:" -ForegroundColor Yellow
git status

# 提交
Write-Host "`n提交更改..." -ForegroundColor Yellow
git commit -m "Update workspace files - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

Write-Host "`n完成！" -ForegroundColor Green
