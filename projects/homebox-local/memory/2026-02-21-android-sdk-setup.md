# HomeBox APK 编译 - Android SDK 配置

## ⏰ 时间: 2026-02-21 01:03

---

## 🚨 问题：缺少 Android SDK

**错误信息**: `No Android SDK found. Try setting the ANDROID_HOME environment variable.`

---

## 📋 解决方案

### 方案 1: 安装 Android Studio（推荐）
1. 下载 Android Studio: https://developer.android.com/studio
2. 安装后，Android SDK 会自动安装
3. 设置 ANDROID_HOME 环境变量

### 方案 2: 命令行安装 SDK
```powershell
# 下载 command-line tools
Invoke-WebRequest -Uri "https://dl.google.com/android/repository/commandlinetools-win-9477386_latest.zip" -OutFile "cmdline-tools.zip"

# 解压
Expand-Archive cmdline-tools.zip -DestinationPath "C:\Android\cmdline-tools"

# 安装 SDK
C:\Android\cmdline-tools\bin\sdkmanager.bat "platforms;android-34" "build-tools;34.0.0"
```

### 方案 3: 使用 GitHub Actions 编译
创建 `.github/workflows/build.yml`：
```yaml
name: Build APK
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.27.1'
      - run: flutter pub get
        working-directory: app
      - run: flutter build apk
        working-directory: app
      - uses: actions/upload-artifact@v3
        with:
          name: apk
          path: app/build/app/outputs/flutter-apk/app-release.apk
```

---

## 当前状态

| 项目 | 状态 |
|------|------|
| Flutter 代码 | ✅ 完成 |
| 代码分析 | ✅ 0 错误 |
| Android SDK | ❌ 未安装 |
| APK 编译 | ⏳ 阻塞 |

---

## 📝 更新 HEARTBEAT.md
