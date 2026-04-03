# HomeBox Local - Android Application

Optimized Android application with best practices and modern architecture.

## Project Structure

```
homebox-local/
├── app/
│   ├── src/main/
│   │   ├── java/com/homebox/local/
│   │   ├── res/
│   │   └── AndroidManifest.xml
│   ├── build.gradle
│   └── proguard-rules.pro
├── miniprogram/
│   └── app.json
├── gradle.properties
└── settings.gradle
```

## Configuration Overview

### 1. Build Configuration (build.gradle)

**Root build.gradle:**
- Gradle Plugin: 8.2.2
- Kotlin: 1.9.22
- Target SDK: 34
- Min SDK: 24

**App build.gradle:**
- Optimized build types (release with ProGuard/R8)
- View Binding enabled
- Java 17 compatibility
- Comprehensive dependency management

### 2. Dependencies (Latest Stable Versions)

**Core Libraries:**
- AndroidX Core KTX: 1.12.0
- AppCompat: 1.6.1
- Material Design: 1.11.0
- ConstraintLayout: 2.1.4

**Architecture Components:**
- Lifecycle: 2.7.0
- Navigation: 2.7.7
- Room: 2.6.1

**Networking:**
- Retrofit: 2.9.0
- OkHttp: 4.12.0
- Gson: 2.10.1

**DI:**
- Hilt: 2.50

**Image Loading:**
- Glide: 4.16.0

### 3. ProGuard Rules

Comprehensive ProGuard configuration including:
- Kotlin optimizations
- Retrofit & OkHttp rules
- Gson serialization rules
- Room database rules
- Hilt/Dagger rules
- Glide rules
- Logging removal in release
- Custom app-specific rules

### 4. AndroidManifest.xml Optimizations

**Permissions:**
- Network permissions
- Storage permissions (with proper SDK versioning)
- Media permissions (Android 13+)
- Optional permissions (commented out)

**Features:**
- Hardware acceleration enabled
- Network security config
- FileProvider configuration
- Deep linking support
- Multi-window support
- Proper exported flags

### 5. Mini-Program (app.json)

**Features:**
- Lazy code loading
- Skyline renderer
- Subpackages for optimization
- Comprehensive page configuration
- Tab bar setup
- Network timeouts
- Permissions configuration

## Build Types

**Debug:**
- Debuggable
- Debug suffix in package name
- No minification

**Release:**
- Minified with R8
- Resources shrinking
- ProGuard enabled
- Optimized for size and performance

## Security Features

1. **Network Security:**
   - HTTPS enforced
   - Certificate pinning support
   - Network security config

2. **Code Protection:**
   - ProGuard/R8 obfuscation
   - String encryption
   - Unused code removal

3. **Permissions:**
   - Minimal required permissions
   - Runtime permission handling
   - Scoped storage compliance

## Performance Optimizations

1. **Build Performance:**
   - Gradle caching enabled
   - Parallel builds
   - Configuration cache
   - Kotlin incremental compilation

2. **Runtime Performance:**
   - View binding (faster than findViewById)
   - Coroutines for async operations
   - Room for efficient database access
   - Glide for optimized image loading

3. **APK Size:**
   - R8 full mode
   - Resource shrinking
   - Unused resource removal
   - Split APKs by density and ABI

## Getting Started

1. **Clone the repository**
2. **Open in Android Studio**
3. **Sync Gradle files**
4. **Build and run**

## Requirements

- Android Studio Hedgehog or later
- JDK 17
- Android SDK 34
- Gradle 8.2+

## Signing Configuration

For release builds, create `keystore.properties`:

```properties
storeFile=path/to/keystore.jks
storePassword=your_store_password
keyAlias=your_key_alias
keyPassword=your_key_password
```

## Additional Resources

- [Android Developer Guide](https://developer.android.com/guide)
- [Kotlin Documentation](https://kotlinlang.org/docs/)
- [Hilt Dependency Injection](https://dagger.dev/hilt/)
- [Retrofit Documentation](https://square.github.io/retrofit/)
- [Room Persistence Library](https://developer.android.com/training/data-storage/room)

## License

Copyright © 2026 HomeBox. All rights reserved.
