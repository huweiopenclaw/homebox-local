Set-Location "C:\Users\1990h\.openclaw\workspace\projects\homebox-local"

Write-Host "Checking git status..." -ForegroundColor Green
git status

Write-Host "`nAdding all files..." -ForegroundColor Green
git add .

Write-Host "`nCreating commit..." -ForegroundColor Green
git commit -m "feat: 优化项目配置 - 依赖更新 + ProGuard规则 + 安全配置" `
    -m "✅ 完成的优化:" `
    -m "1. 更新所有依赖到最新稳定版本 (Gradle 8.2.2, Kotlin 1.9.22)" `
    -m "2. 添加全面的 ProGuard 规则 (Kotlin, Retrofit, Room, Hilt, Glide)" `
    -m "3. 优化 AndroidManifest.xml (权限管理、网络安全、性能优化)" `
    -m "4. 配置小程序 app.json (懒加载、分包、性能优化)" `
    -m "5. 添加 Gradle 构建优化 (缓存、并行构建、配置缓存)" `
    -m "6. 创建网络安全配置和 FileProvider 路径" `
    -m "7. 完善项目文档 (README.md, .gitignore, 配置摘要)"

Write-Host "`nDone!" -ForegroundColor Green
