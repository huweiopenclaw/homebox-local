# HomeBox Local - Android 原生版设计

**平台**: Android
**语言**: Kotlin
**最低版本**: Android 8.0 (API 26)

---

## 1. 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 语言 | Kotlin | 1.9+ |
| UI | Jetpack Compose | Latest |
| 架构 | MVVM + Clean Architecture | - |
| 依赖注入 | Hilt | Latest |
| 数据库 | Room | Latest |
| 配置存储 | DataStore | Latest |
| 网络 | Retrofit + OkHttp | Latest |
| 图片 | Coil | Latest |
| 序列化 | Kotlinx Serialization | Latest |

---

## 2. 模块结构

```
app/
├── src/main/java/com/homebox/local/
│   ├── HomeBoxApp.kt
│   ├── MainActivity.kt
│   │
│   ├── ui/                    # 表现层
│   │   ├── theme/
│   │   ├── components/
│   │   ├── screens/
│   │   └── navigation/
│   │
│   ├── domain/                # 领域层
│   │   ├── model/
│   │   ├── usecase/
│   │   └── repository/
│   │
│   ├── data/                  # 数据层
│   │   ├── local/
│   │   ├── remote/
│   │   └── repository/
│   │
│   └── core/                  # 核心层
│       ├── di/
│       ├── security/
│       └── util/
```

---

## 3. 页面导航

```
NavHost
├── home           # 首页
├── box/
│   ├── list       # 箱子列表
│   ├── detail     # 箱子详情
│   └── add        # 添加箱子
├── item/
│   ├── detail     # 物品详情
│   └── add        # 添加物品
├── search         # 搜索
├── chat           # AI 对话
└── settings       # 设置
    ├── ai_config  # AI 配置
    ├── backup     # 备份恢复
    └── about      # 关于
```

---

## 4. 数据存储策略

### 4.1 Room 数据库

```kotlin
@Database(
    entities = [Box::class, Item::class, Location::class, SearchHistory::class],
    version = 1
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun boxDao(): BoxDao
    abstract fun itemDao(): ItemDao
    abstract fun locationDao(): LocationDao
    abstract fun searchHistoryDao(): SearchHistoryDao
}
```

### 4.2 DataStore 配置

```kotlin
// AI 配置
object PreferencesKeys {
    val AI_PROVIDER = stringPreferencesKey("ai_provider")
    val AI_MODEL = stringPreferencesKey("ai_model")
    val API_KEY = stringPreferencesKey("api_key")  // 加密存储
    val BASE_URL = stringPreferencesKey("base_url")
}
```

### 4.3 照片存储

```
路径: /data/data/com.homebox.local/files/photos/
命名: {timestamp}_{random}.jpg
策略: 压缩至 1080p，质量 80%
```

---

## 5. 核心功能实现

### 5.1 拍照识别流程

```kotlin
// 1. 启动相机
val takePicture = rememberLauncherForActivityResult(
    ActivityResultContracts.TakePicture()
) { uri ->
    if (it) {
        viewModel.recognizeItems(uri)
    }
}

// 2. AI 识别
fun recognizeItems(uri: Uri) {
    viewModelScope.launch {
        val base64 = imageUtils.uriToBase64(uri)
        aiRepository.recognizeItems(base64)
            .onSuccess { items ->
                _state.update { it.copy(recognizedItems = items) }
            }
    }
}

// 3. 用户确认后保存
fun saveBox(name: String, items: List<Item>) {
    viewModelScope.launch {
        boxRepository.addBox(name, items)
        _state.update { it.copy(saved = true) }
    }
}
```

### 5.2 对话查询

```kotlin
// ChatViewModel.kt
fun sendMessage(query: String) {
    viewModelScope.launch {
        // 获取上下文数据
        val context = buildContext()
        
        // 调用 AI
        chatRepository.query(query, context)
            .onSuccess { response ->
                _messages.update { 
                    it + ChatMessage.assistant(response) 
                }
            }
    }
}

private suspend fun buildContext(): String {
    val boxes = boxRepository.getAllBoxes()
    val items = itemRepository.getAllItems()
    
    return """
        箱子列表:
        ${boxes.joinToString("\n") { "- ${it.name} (位置: ${it.location})" }}
        
        物品列表:
        ${items.groupBy { it.boxId }.map { (boxId, items) ->
            val box = boxes.find { it.id == boxId }
            "- ${box?.name ?: "未知箱子"}: ${items.joinToString(", ") { it.name }}"
        }.joinToString("\n")}
    """.trimIndent()
}
```

---

## 6. 权限

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.INTERNET" />
```

---

## 7. 依赖 (build.gradle.kts)

```kotlin
dependencies {
    // Compose
    implementation("androidx.compose.ui:ui:$composeVersion")
    implementation("androidx.compose.material3:material3:$material3Version")
    implementation("androidx.compose.ui:ui-tooling-preview:$composeVersion")
    implementation("androidx.activity:activity-compose:$activityComposeVersion")
    implementation("androidx.navigation:navigation-compose:$navVersion")
    
    // Hilt
    implementation("com.google.dagger:hilt-android:$hiltVersion")
    kapt("com.google.dagger:hilt-compiler:$hiltVersion")
    implementation("androidx.hilt:hilt-navigation-compose:$hiltNavVersion")
    
    // Room
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    ksp("androidx.room:room-compiler:$roomVersion")
    
    // DataStore
    implementation("androidx.datastore:datastore-preferences:$dataStoreVersion")
    
    // Network
    implementation("com.squareup.retrofit2:retrofit:$retrofitVersion")
    implementation("com.jakewharton.retrofit:retrofit2-kotlinx-serialization-converter:$kotlinxConverterVersion")
    implementation("com.squareup.okhttp3:okhttp:$okhttpVersion")
    implementation("com.squareup.okhttp3:logging-interceptor:$okhttpVersion")
    
    // Image
    implementation("io.coil-kt:coil-compose:$coilVersion")
    
    // Security
    implementation("androidx.security:security-crypto:$securityVersion")
    
    // Testing
    testImplementation("junit:junit:$junitVersion")
    testImplementation("org.mockito.kotlin:mockito-kotlin:$mockitoVersion")
    androidTestImplementation("androidx.test.ext:junit:$androidJunitVersion")
    androidTestImplementation("androidx.compose.ui:ui-test-junit4:$composeVersion")
}
```

---

## 8. 构建配置

```kotlin
android {
    namespace = "com.homebox.local"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.homebox.local"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    buildFeatures {
        compose = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
}
```
