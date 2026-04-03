# 开发环境安装指南

## 📋 检测结果

| 工具 | 状态 | 操作 |
|------|------|------|
| Android Studio | ❌ 未安装 | 需要安装 |
| 微信开发者工具 | ❌ 未安装 | 需要安装 |
| Node.js | ✅ 已安装 | - |

---

## 🚀 自动安装方案

### 1. Android Studio

**下载地址**: https://developer.android.com/studio

**PowerShell 安装脚本** (保存为 `install-android-studio.ps1`):
```powershell
# 下载 Android Studio
$url = "https://redirector.gvt1.com/edgedl/android/studio/install/2023.1.1.26/android-studio-2023.1.1.26-windows.exe"
$output = "$env:TEMP\android-studio.exe"

Write-Host "正在下载 Android Studio..."
Invoke-WebRequest -Uri $url -OutFile $output

Write-Host "正在安装 Android Studio..."
Start-Process -FilePath $output -ArgumentList "/S" -Wait

Write-Host "Android Studio 安装完成！"
```

**手动安装步骤**:
1. 访问 https://developer.android.com/studio
2. 下载 Windows 版本
3. 运行安装程序
4. 选择 Standard 安装类型
5. 等待 SDK 下载完成

---

### 2. 微信开发者工具

**下载地址**: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

**PowerShell 安装脚本** (保存为 `install-wechat-devtools.ps1`):
```powershell
# 下载微信开发者工具
$url = "https://dldir1.qq.com/WechatWebDev/release/be1ec64cf6184b0fa64091919793f068/wechat_devtools_1.06.2307260_x64.exe"
$output = "$env:TEMP\wechat-devtools.exe"

Write-Host "正在下载微信开发者工具..."
Invoke-WebRequest -Uri $url -OutFile $output

Write-Host "正在安装微信开发者工具..."
Start-Process -FilePath $output -ArgumentList "/S" -Wait

Write-Host "微信开发者工具 安装完成！"
```

**手动安装步骤**:
1. 访问 https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
2. 下载 Windows 64位版本
3. 运行安装程序
4. 使用微信扫码登录

---

## ⏱️ 预计安装时间

| 工具 | 下载大小 | 安装时间 |
|------|---------|---------|
| Android Studio | ~1GB | 15-30分钟 |
| 微信开发者工具 | ~200MB | 5分钟 |

---

## 📝 安装后配置

### Android Studio
1. 打开 Android Studio
2. 选择 "Standard" 安装类型
3. 接受所有许可协议
4. 等待组件下载完成
5. 创建模拟器 (AVD)

### 微信开发者工具
1. 打开工具
2. 微信扫码登录
3. 导入项目: `miniprogram/`

---

*生成时间: 2026-02-22 16:13*
