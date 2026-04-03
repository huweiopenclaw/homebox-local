# Git Setup Script
git config --global credential.helper manager
git config --global user.email "huweiopenclaw@sina.com"
git config --global user.name "huweiopenclaw"

Write-Host "Git configured successfully" -ForegroundColor Green
git config --list --global
