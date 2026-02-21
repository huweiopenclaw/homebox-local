# HomeBox Local - 技术设计文档

**版本**: 1.0
**日期**: 2026-02-21
**作者**: HOC & 主人

---

## 1. 概述

### 1.1 设计目标

为 HomeBox Local 设计两个平台版本：
- **Android 原生版** - Kotlin + Jetpack Compose
- **微信小程序版** - TypeScript + Taro 跨端框架

### 1.2 平台对比

| 维度 | Android 原生版 | 微信小程序版 |
|------|---------------|-------------|
| 开发语言 | Kotlin | TypeScript |
| UI 框架 | Jetpack Compose | Taro + React |
| 数据存储 | Room (SQLite) | 微信本地存储 + 云开发 |
| 照片存储 | 本地文件系统 | 临时目录 + 云存储 |
| AI 调用 | Retrofit + OkHttp | wx.request |
| 分发方式 | APK / 应用商店 | 微信内搜索 |
| 优势 | 完整功能、离线可用 | 无需安装、易分享 |
| 劣势 | 需下载安装 | 功能受限、需网络 |

---

## 2. Android 原生版设计

### 2.1 技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                    HomeBox Local Android                     │
├─────────────────────────────────────────────────────────────┤
│  Presentation Layer (Jetpack Compose)                        │
│  ├── ui/screens/                                            │
│  │   ├── home/          # 首页                               │
│  │   ├── box/           # 箱子管理                           │
│  │   ├── item/          # 物品管理                           │
│  │   ├── search/        # 搜索                               │
│  │   ├── chat/          # AI 对话                            │
│  │   └── settings/      # 设置                               │
│  └── ui/components/     # 通用组件                           │
├─────────────────────────────────────────────────────────────┤
│  Domain Layer                                                │
│  ├── usecases/                                              │
│  │   ├── BoxUseCases.kt      # 箱子业务逻辑                  │
│  │   ├── ItemUseCases.kt     # 物品业务逻辑                  │
│  │   ├── SearchUseCases.kt   # 搜索业务逻辑                  │
│  │   └── AIUseCases.kt       # AI 业务逻辑                   │
│  └── model/                 # 领域模型                       │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                  │
│  ├── local/                                                 │
│  │   ├── database/          # Room 数据库                    │
│  │   ├── datastore/         # 配置存储                       │
│  │   └── file/              # 文件存储                       │
│  ├── remote/                                                │
│  │   ├── api/               # AI API 客户端                  │
│  │   └── dto/               # 数据传输对象                   │
│  └── repository/            # 数据仓库                       │
├─────────────────────────────────────────────────────────────┤
│  Core Layer                                                  │
│  ├── di/                    # 依赖注入 (Hilt)                │
│  ├── network/               # 网络模块                       │
│  ├── security/              # 安全模块                       │
│  └── util/                  # 工具类                         │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 数据模型 (Room)

```kotlin
// 箱子实体
@Entity(tableName = "boxes")
data class Box(
    @PrimaryKey val id: String,
    val name: String,
    val description: String? = null,
    val locationId: String? = null,
    val photoPath: String? = null,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)

// 物品实体
@Entity(tableName = "items", foreignKeys = [
    ForeignKey(
        entity = Box::class,
        parentColumns = ["id"],
        childColumns = ["boxId"],
        onDelete = ForeignKey.CASCADE
    )
])
data class Item(
    @PrimaryKey val id: String,
    val boxId: String,
    val name: String,
    val category: String? = null,
    val quantity: Int = 1,
    val photoPath: String? = null,
    val notes: String? = null,
    val tags: String? = null,  // JSON array
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)

// 位置实体
@Entity(tableName = "locations")
data class Location(
    @PrimaryKey val id: String,
    val room: String,           // 房间
    val furniture: String? = null,  // 家具
    val position: String? = null,   // 位置
    val photoPath: String? = null,
    val notes: String? = null,
    val createdAt: Long = System.currentTimeMillis()
)

// AI 配置
@Entity(tableName = "ai_config")
data class AIConfig(
    @PrimaryKey val id: String = "default",
    val provider: String,       // glm / claude / openai / custom
    val apiKey: String,         // 加密存储
    val baseUrl: String? = null,
    val model: String,
    val updatedAt: Long = System.currentTimeMillis()
)

// 搜索历史
@Entity(tableName = "search_history")
data class SearchHistory(
    @PrimaryKey val id: String,
    val query: String,
    val resultSummary: String? = null,
    val createdAt: Long = System.currentTimeMillis()
)
```

### 2.3 目录结构

```
app/
├── src/main/java/com/homebox/local/
│   ├── HomeBoxApp.kt                 # Application
│   ├── MainActivity.kt               # 主 Activity
│   │
│   ├── ui/                           # 表现层
│   │   ├── theme/                    # 主题
│   │   │   ├── Color.kt
│   │   │   ├── Theme.kt
│   │   │   └── Type.kt
│   │   ├── components/               # 通用组件
│   │   │   ├── BoxCard.kt
│   │   │   ├── ItemRow.kt
│   │   │   ├── SearchBar.kt
│   │   │   ├── AIConfigSheet.kt
│   │   │   └── LoadingState.kt
│   │   ├── screens/                  # 页面
│   │   │   ├── home/
│   │   │   │   ├── HomeScreen.kt
│   │   │   │   └── HomeViewModel.kt
│   │   │   ├── box/
│   │   │   │   ├── BoxListScreen.kt
│   │   │   │   ├── BoxDetailScreen.kt
│   │   │   │   ├── AddBoxScreen.kt
│   │   │   │   └── BoxViewModel.kt
│   │   │   ├── item/
│   │   │   │   ├── ItemListScreen.kt
│   │   │   │   ├── AddItemScreen.kt
│   │   │   │   └── ItemViewModel.kt
│   │   │   ├── search/
│   │   │   │   ├── SearchScreen.kt
│   │   │   │   └── SearchViewModel.kt
│   │   │   ├── chat/
│   │   │   │   ├── ChatScreen.kt
│   │   │   │   └── ChatViewModel.kt
│   │   │   └── settings/
│   │   │       ├── SettingsScreen.kt
│   │   │       └── SettingsViewModel.kt
│   │   └── navigation/
│   │       └── NavGraph.kt
│   │
│   ├── domain/                       # 领域层
│   │   ├── model/                    # 领域模型
│   │   │   ├── Box.kt
│   │   │   ├── Item.kt
│   │   │   ├── Location.kt
│   │   │   └── AIResult.kt
│   │   ├── usecase/                  # 用例
│   │   │   ├── box/
│   │   │   │   ├── GetBoxesUseCase.kt
│   │   │   │   ├── AddBoxUseCase.kt
│   │   │   │   ├── UpdateBoxUseCase.kt
│   │   │   │   └── DeleteBoxUseCase.kt
│   │   │   ├── item/
│   │   │   │   ├── GetItemsUseCase.kt
│   │   │   │   ├── AddItemUseCase.kt
│   │   │   │   └── RecognizeItemUseCase.kt
│   │   │   ├── search/
│   │   │   │   ├── SearchItemsUseCase.kt
│   │   │   │   └── ChatSearchUseCase.kt
│   │   │   └── ai/
│   │   │       ├── RecognizeItemsUseCase.kt
│   │   │       ├── RecognizeLocationUseCase.kt
│   │   │       └── ChatQueryUseCase.kt
│   │   └── repository/               # 仓库接口
│   │       ├── BoxRepository.kt
│   │       ├── ItemRepository.kt
│   │       ├── LocationRepository.kt
│   │       └── AIRepository.kt
│   │
│   ├── data/                         # 数据层
│   │   ├── local/
│   │   │   ├── database/
│   │   │   │   ├── AppDatabase.kt
│   │   │   │   ├── BoxDao.kt
│   │   │   │   ├── ItemDao.kt
│   │   │   │   └── LocationDao.kt
│   │   │   ├── datastore/
│   │   │   │   └── SettingsDataStore.kt
│   │   │   └── file/
│   │   │       └── PhotoStorage.kt
│   │   ├── remote/
│   │   │   ├── api/
│   │   │   │   ├── GLMApi.kt
│   │   │   │   ├── ClaudeApi.kt
│   │   │   │   └── OpenAIApi.kt
│   │   │   ├── dto/
│   │   │   │   ├── ChatRequest.kt
│   │   │   │   └── ChatResponse.kt
│   │   │   └── AIRepositoryImpl.kt
│   │   └── repository/
│   │       ├── BoxRepositoryImpl.kt
│   │       ├── ItemRepositoryImpl.kt
│   │       └── LocationRepositoryImpl.kt
│   │
│   ├── core/                         # 核心模块
│   │   ├── di/
│   │   │   ├── AppModule.kt
│   │   │   ├── DatabaseModule.kt
│   │   │   └── NetworkModule.kt
│   │   ├── security/
│   │   │   └── KeyManager.kt
│   │   ├── network/
│   │   │   └── NetworkMonitor.kt
│   │   └── util/
│   │       ├── ImageUtils.kt
│   │       └── DateUtils.kt
│   │
│   └── widget/                       # 桌面小组件
│       └── QuickSearchWidget.kt
│
├── src/main/res/
│   ├── drawable/
│   ├── values/
│   └── mipmap/
│
├── build.gradle.kts
└── proguard-rules.pro
```

### 2.4 核心功能流程

#### 添加箱子流程

```kotlin
// AddBoxViewModel.kt
@HiltViewModel
class AddBoxViewModel @Inject constructor(
    private val addBoxUseCase: AddBoxUseCase,
    private val recognizeItemsUseCase: RecognizeItemsUseCase,
    private val recognizeLocationUseCase: RecognizeLocationUseCase
) : ViewModel() {
    
    // 拍照识别物品
    fun recognizeItems(photoUri: Uri) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            recognizeItemsUseCase(photoUri)
                .onSuccess { items ->
                    _uiState.update { it.copy(
                        recognizedItems = items,
                        isLoading = false
                    )}
                }
                .onFailure { error ->
                    _uiState.update { it.copy(
                        error = error.message,
                        isLoading = false
                    )}
                }
        }
    }
    
    // 拍照识别位置
    fun recognizeLocation(photoUri: Uri) {
        viewModelScope.launch {
            recognizeLocationUseCase(photoUri)
                .onSuccess { location ->
                    _uiState.update { it.copy(location = location) }
                }
        }
    }
    
    // 保存箱子
    fun saveBox(name: String, items: List<Item>, location: Location?) {
        viewModelScope.launch {
            addBoxUseCase(name, items, location)
                .onSuccess { boxId ->
                    _uiState.update { it.copy(saved = true, boxId = boxId) }
                }
        }
    }
}
```

#### AI 对话搜索

```kotlin
// ChatViewModel.kt
@HiltViewModel
class ChatViewModel @Inject constructor(
    private val chatQueryUseCase: ChatQueryUseCase
) : ViewModel() {
    
    private val _messages = MutableStateFlow<List<ChatMessage>>(emptyList())
    val messages: StateFlow<List<ChatMessage>> = _messages
    
    fun sendMessage(query: String) {
        viewModelScope.launch {
            // 添加用户消息
            _messages.update { it + ChatMessage.user(query) }
            
            // 调用 AI 查询
            chatQueryUseCase(query)
                .onSuccess { response ->
                    _messages.update { 
                        it + ChatMessage.assistant(response.answer, response.matchedItems)
                    }
                }
                .onFailure { error ->
                    _messages.update {
                        it + ChatMessage.error(error.message ?: "查询失败")
                    }
                }
        }
    }
}
```

### 2.5 AI 服务接口

```kotlin
// AIService.kt
interface AIService {
    suspend fun recognizeItems(imageBase64: String): Result<List<RecognizedItem>>
    suspend fun recognizeLocation(imageBase64: String): Result<RecognizedLocation>
    suspend fun chat(query: String, context: String): Result<String>
}

// GLMServiceImpl.kt
class GLMServiceImpl @Inject constructor(
    private val apiKey: String,
    private val okHttpClient: OkHttpClient
) : AIService {
    
    companion object {
        private const val BASE_URL = "https://open.bigmodel.cn/api/paas/v4"
        private const val VISION_MODEL = "glm-4v"
        private const val CHAT_MODEL = "glm-4"
    }
    
    override suspend fun recognizeItems(imageBase64: String): Result<List<RecognizedItem>> {
        val request = ChatRequest(
            model = VISION_MODEL,
            messages = listOf(
                Message(
                    role = "user",
                    content = listOf(
                        Content.text("请识别这张照片中的所有物品，以 JSON 格式返回：[{\"name\":\"物品名\",\"quantity\":数量,\"category\":\"分类\"}]"),
                        Content.image("data:image/jpeg;base64,$imageBase64")
                    )
                )
            )
        )
        // ... API 调用
    }
}
```

---

## 3. 微信小程序版设计

### 3.1 技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                  HomeBox Local 小程序                        │
├─────────────────────────────────────────────────────────────┤
│  View Layer (Taro + React)                                   │
│  ├── pages/                                                 │
│  │   ├── home/              # 首页                           │
│  │   ├── box/               # 箱子管理                       │
│  │   ├── item/              # 物品管理                       │
│  │   ├── search/            # 搜索                           │
│  │   ├── chat/              # AI 对话                        │
│  │   └── settings/          # 设置                           │
│  └── components/            # 通用组件                       │
├─────────────────────────────────────────────────────────────┤
│  State Layer (Zustand)                                       │
│  ├── stores/                                                │
│  │   ├── boxStore.ts                                        │
│  │   ├── itemStore.ts                                       │
│  │   └── settingsStore.ts                                   │
├─────────────────────────────────────────────────────────────┤
│  Service Layer                                               │
│  ├── services/                                              │
│  │   ├── boxService.ts                                      │
│  │   ├── itemService.ts                                     │
│  │   ├── aiService.ts                                       │
│  │   └── storageService.ts                                  │
│  └── api/                                                   │
│      ├── glmApi.ts                                          │
│      └── request.ts                                         │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                  │
│  ├── storage/                                               │
│  │   ├── localStorage.ts     # wx.setStorage                │
│  │   └── fileStorage.ts      # wx.saveFile                  │
│  └── cloud/ (可选)                                          │
│      └── cloudStorage.ts     # 微信云开发                    │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 数据模型 (TypeScript)

```typescript
// types/index.ts

// 箱子
interface Box {
  id: string
  name: string
  description?: string
  locationId?: string
  photoPath?: string
  createdAt: number
  updatedAt: number
}

// 物品
interface Item {
  id: string
  boxId: string
  name: string
  category?: string
  quantity: number
  photoPath?: string
  notes?: string
  tags?: string[]
  createdAt: number
  updatedAt: number
}

// 位置
interface Location {
  id: string
  room: string
  furniture?: string
  position?: string
  photoPath?: string
  notes?: string
  createdAt: number
}

// AI 识别结果
interface RecognizedItem {
  name: string
  quantity: number
  category?: string
}

// AI 配置
interface AIConfig {
  provider: 'glm' | 'claude' | 'openai' | 'custom'
  apiKey: string
  baseUrl?: string
  model: string
}

// 搜索结果
interface SearchResult {
  items: Item[]
  boxes: Box[]
  answer?: string
}
```

### 3.3 目录结构

```
homebox-miniprogram/
├── src/
│   ├── app.config.ts              # 小程序配置
│   ├── app.ts                     # 入口文件
│   ├── app.scss                   # 全局样式
│   │
│   ├── pages/                     # 页面
│   │   ├── home/
│   │   │   ├── index.tsx
│   │   │   ├── index.config.ts
│   │   │   └── index.scss
│   │   ├── box/
│   │   │   ├── list/
│   │   │   │   └── index.tsx
│   │   │   ├── detail/
│   │   │   │   └── index.tsx
│   │   │   └── add/
│   │   │       └── index.tsx
│   │   ├── item/
│   │   │   ├── list/
│   │   │   │   └── index.tsx
│   │   │   └── add/
│   │   │       └── index.tsx
│   │   ├── search/
│   │   │   └── index.tsx
│   │   ├── chat/
│   │   │   └── index.tsx
│   │   └── settings/
│   │       └── index.tsx
│   │
│   ├── components/                # 组件
│   │   ├── BoxCard/
│   │   │   └── index.tsx
│   │   ├── ItemRow/
│   │   │   └── index.tsx
│   │   ├── SearchBar/
│   │   │   └── index.tsx
│   │   ├── PhotoCapture/
│   │   │   └── index.tsx
│   │   ├── AIConfigSheet/
│   │   │   └── index.tsx
│   │   └── Loading/
│   │       └── index.tsx
│   │
│   ├── stores/                    # 状态管理
│   │   ├── boxStore.ts
│   │   ├── itemStore.ts
│   │   ├── locationStore.ts
│   │   ├── settingsStore.ts
│   │   └── chatStore.ts
│   │
│   ├── services/                  # 服务层
│   │   ├── boxService.ts
│   │   ├── itemService.ts
│   │   ├── locationService.ts
│   │   ├── aiService.ts
│   │   ├── storageService.ts
│   │   └── backupService.ts
│   │
│   ├── api/                       # API 层
│   │   ├── request.ts             # 请求封装
│   │   ├── glmApi.ts              # 智谱 AI
│   │   ├── claudeApi.ts           # Claude
│   │   └── openaiApi.ts           # OpenAI
│   │
│   ├── hooks/                     # 自定义 Hooks
│   │   ├── useBox.ts
│   │   ├── useItem.ts
│   │   ├── useAI.ts
│   │   └── usePhoto.ts
│   │
│   ├── utils/                     # 工具函数
│   │   ├── storage.ts
│   │   ├── image.ts
│   │   ├── uuid.ts
│   │   └── date.ts
│   │
│   ├── types/                     # 类型定义
│   │   ├── index.ts
│   │   ├── box.ts
│   │   ├── item.ts
│   │   └── api.ts
│   │
│   └── constants/                 # 常量
│       └── index.ts
│
├── config/
│   ├── dev.js                     # 开发环境配置
│   └── prod.js                    # 生产环境配置
│
├── project.config.json            # 小程序项目配置
├── package.json
└── tsconfig.json
```

### 3.4 核心服务实现

#### 存储服务

```typescript
// services/storageService.ts
import Taro from '@tarojs/taro'

const STORAGE_KEYS = {
  BOXES: 'homebox_boxes',
  ITEMS: 'homebox_items',
  LOCATIONS: 'homebox_locations',
  AI_CONFIG: 'homebox_ai_config',
  SEARCH_HISTORY: 'homebox_search_history'
}

export const storageService = {
  // 箱子操作
  async getBoxes(): Promise<Box[]> {
    const data = await Taro.getStorage({ key: STORAGE_KEYS.BOXES })
    return data.data || []
  },
  
  async saveBoxes(boxes: Box[]): Promise<void> {
    await Taro.setStorage({ key: STORAGE_KEYS.BOXES, data: boxes })
  },
  
  async addBox(box: Box): Promise<void> {
    const boxes = await this.getBoxes()
    boxes.push(box)
    await this.saveBoxes(boxes)
  },
  
  // 物品操作
  async getItems(): Promise<Item[]> {
    const data = await Taro.getStorage({ key: STORAGE_KEYS.ITEMS })
    return data.data || []
  },
  
  async getItemsByBox(boxId: string): Promise<Item[]> {
    const items = await this.getItems()
    return items.filter(item => item.boxId === boxId)
  },
  
  async addItem(item: Item): Promise<void> {
    const items = await this.getItems()
    items.push(item)
    await Taro.setStorage({ key: STORAGE_KEYS.ITEMS, data: items })
  },
  
  // 数据备份
  async exportData(): Promise<string> {
    const boxes = await this.getBoxes()
    const items = await this.getItems()
    const locations = await this.getLocations()
    
    const backup = {
      version: 1,
      exportedAt: Date.now(),
      data: { boxes, items, locations }
    }
    
    return JSON.stringify(backup)
  },
  
  async importData(jsonString: string): Promise<void> {
    const backup = JSON.parse(jsonString)
    if (backup.version !== 1) throw new Error('不支持的备份版本')
    
    await this.saveBoxes(backup.data.boxes)
    await Taro.setStorage({ key: STORAGE_KEYS.ITEMS, data: backup.data.items })
    await Taro.setStorage({ key: STORAGE_KEYS.LOCATIONS, data: backup.data.locations })
  }
}
```

#### AI 服务

```typescript
// services/aiService.ts
import Taro from '@tarojs/taro'
import { glmApi } from '../api/glmApi'
import { claudeApi } from '../api/claudeApi'
import { openaiApi } from '../api/openaiApi'

export const aiService = {
  // 获取当前配置的 AI 提供商
  getProvider() {
    const config = Taro.getStorageSync('homebox_ai_config')
    return config?.provider || 'glm'
  },
  
  // 识别物品
  async recognizeItems(imagePath: string): Promise<RecognizedItem[]> {
    const provider = this.getProvider()
    
    // 读取图片并转 base64
    const base64 = await this.imageToBase64(imagePath)
    
    switch (provider) {
      case 'glm':
        return glmApi.recognizeItems(base64)
      case 'claude':
        return claudeApi.recognizeItems(base64)
      case 'openai':
        return openaiApi.recognizeItems(base64)
      default:
        throw new Error('未配置 AI 服务')
    }
  },
  
  // 识别位置
  async recognizeLocation(imagePath: string): Promise<Location> {
    const provider = this.getProvider()
    const base64 = await this.imageToBase64(imagePath)
    
    switch (provider) {
      case 'glm':
        return glmApi.recognizeLocation(base64)
      case 'claude':
        return claudeApi.recognizeLocation(base64)
      case 'openai':
        return openaiApi.recognizeLocation(base64)
      default:
        throw new Error('未配置 AI 服务')
    }
  },
  
  // 对话查询
  async chatQuery(query: string, context: string): Promise<string> {
    const provider = this.getProvider()
    
    switch (provider) {
      case 'glm':
        return glmApi.chat(query, context)
      case 'claude':
        return claudeApi.chat(query, context)
      case 'openai':
        return openaiApi.chat(query, context)
      default:
        throw new Error('未配置 AI 服务')
    }
  },
  
  // 图片转 base64
  async imageToBase64(imagePath: string): Promise<string> {
    const fileInfo = await Taro.getFileSystemManager().readFileSync(imagePath)
    return fileInfo.toString('base64')
  }
}
```

#### GLM API 实现

```typescript
// api/glmApi.ts
import Taro from '@tarojs/taro'

const BASE_URL = 'https://open.bigmodel.cn/api/paas/v4'

export const glmApi = {
  getApiKey(): string {
    const config = Taro.getStorageSync('homebox_ai_config')
    return config?.apiKey || ''
  },
  
  async recognizeItems(imageBase64: string): Promise<RecognizedItem[]> {
    const response = await Taro.request({
      url: `${BASE_URL}/chat/completions`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${this.getApiKey()}`,
        'Content-Type': 'application/json'
      },
      data: {
        model: 'glm-4v',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: '请识别这张照片中的所有物品，以 JSON 数组格式返回：[{"name":"物品名","quantity":数量,"category":"分类"}]。只返回 JSON，不要其他说明。' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
          ]
        }]
      }
    })
    
    const content = response.data.choices[0].message.content
    return JSON.parse(content)
  },
  
  async recognizeLocation(imageBase64: string): Promise<Partial<Location>> {
    const response = await Taro.request({
      url: `${BASE_URL}/chat/completions`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${this.getApiKey()}`,
        'Content-Type': 'application/json'
      },
      data: {
        model: 'glm-4v',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: '请识别这张照片中的位置信息，以 JSON 格式返回：{"room":"房间","furniture":"家具","position":"具体位置"}。只返回 JSON。' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
          ]
        }]
      }
    })
    
    const content = response.data.choices[0].message.content
    return JSON.parse(content)
  },
  
  async chat(query: string, context: string): Promise<string> {
    const response = await Taro.request({
      url: `${BASE_URL}/chat/completions`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${this.getApiKey()}`,
        'Content-Type': 'application/json'
      },
      data: {
        model: 'glm-4',
        messages: [
          { role: 'system', content: `你是一个家庭收纳助手。根据以下数据回答用户问题：\n\n${context}` },
          { role: 'user', content: query }
        ]
      }
    })
    
    return response.data.choices[0].message.content
  }
}
```

### 3.5 页面实现示例

#### 首页

```tsx
// pages/home/index.tsx
import { View, Text } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { BoxCard } from '../../components/BoxCard'
import { SearchBar } from '../../components/SearchBar'
import { storageService } from '../../services/storageService'
import './index.scss'

export default function HomePage() {
  const [boxes, setBoxes] = useState<Box[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  
  useDidShow(() => {
    loadData()
  })
  
  const loadData = async () => {
    const [boxData, locationData] = await Promise.all([
      storageService.getBoxes(),
      storageService.getLocations()
    ])
    setBoxes(boxData)
    setLocations(locationData)
  }
  
  const handleSearch = (query: string) => {
    Taro.navigateTo({ url: `/pages/search/index?q=${encodeURIComponent(query)}` })
  }
  
  const handleAddBox = () => {
    Taro.navigateTo({ url: '/pages/box/add/index' })
  }
  
  // 按位置分组
  const groupedBoxes = locations.map(loc => ({
    location: loc,
    boxes: boxes.filter(b => b.locationId === loc.id)
  }))
  
  // 未分配位置的箱子
  const unassignedBoxes = boxes.filter(b => !b.locationId)
  
  return (
    <View className="home-page">
      {/* 搜索栏 */}
      <SearchBar onSearch={handleSearch} />
      
      {/* 快捷操作 */}
      <View className="quick-actions">
        <View className="action-btn" onClick={handleAddBox}>
          <Text className="icon">📦</Text>
          <Text>记录箱子</Text>
        </View>
        <View className="action-btn" onClick={() => Taro.navigateTo({ url: '/pages/chat/index' })}>
          <Text className="icon">💬</Text>
          <Text>AI 查询</Text>
        </View>
      </View>
      
      {/* 按位置展示 */}
      {groupedBoxes.map(group => (
        <View key={group.location.id} className="location-section">
          <View className="location-header">
            <Text className="location-name">{group.location.room} - {group.location.furniture}</Text>
            <Text className="box-count">{group.boxes.length} 个箱子</Text>
          </View>
          <View className="box-list">
            {group.boxes.map(box => (
              <BoxCard key={box.id} box={box} onClick={() => {
                Taro.navigateTo({ url: `/pages/box/detail/index?id=${box.id}` })
              }} />
            ))}
          </View>
        </View>
      ))}
      
      {/* 未分配位置 */}
      {unassignedBoxes.length > 0 && (
        <View className="location-section">
          <View className="location-header">
            <Text className="location-name">未分配位置</Text>
          </View>
          <View className="box-list">
            {unassignedBoxes.map(box => (
              <BoxCard key={box.id} box={box} />
            ))}
          </View>
        </View>
      )}
      
      {/* 添加按钮 */}
      <View className="fab" onClick={handleAddBox}>
        <Text>+</Text>
      </View>
    </View>
  )
}
```

---

## 4. 功能差异对比

### 4.1 功能矩阵

| 功能 | Android 原生 | 微信小程序 | 备注 |
|------|-------------|-----------|------|
| 拍照识别 | ✅ 完整 | ✅ 完整 | 小程序用 wx.chooseMedia |
| 相册选择 | ✅ | ✅ | |
| AI 物品识别 | ✅ | ✅ | |
| AI 位置识别 | ✅ | ✅ | |
| AI 对话查询 | ✅ | ✅ | |
| 箱子管理 | ✅ | ✅ | |
| 物品管理 | ✅ | ✅ | |
| 位置管理 | ✅ | ✅ | |
| 搜索 | ✅ | ✅ | |
| 数据备份 | ✅ 文件导出 | ✅ 复制/分享 | |
| 数据恢复 | ✅ 文件导入 | ✅ 粘贴导入 | |
| 离线使用 | ✅ 完全可用 | ⚠️ 部分可用 | 小程序需网络加载 |
| 桌面小组件 | ✅ 快速搜索 | ❌ | 小程序不支持 |
| 指纹/面容解锁 | ✅ | ❌ | 小程序不支持 |
| 相机直接调用 | ✅ | ⚠️ 受限 | 小程序相机能力受限 |
| 后台运行 | ✅ | ❌ | 小程序切后台即停 |
| 存储空间 | 无限制 | 10MB 限制 | 小程序需控制数据量 |

### 4.2 小程序限制及对策

| 限制 | 对策 |
|------|------|
| 本地存储 10MB 限制 | 照片压缩 + 定期清理 + 云存储 |
| 无法后台运行 | 提示用户保持前台 |
| 相机能力受限 | 引导使用系统相机后选择照片 |
| 无生物识别 | 设置页面密码锁定 |

---

## 5. 共享设计

### 5.1 UI 设计规范

两个版本遵循相同的设计规范：

```
颜色系统
├── Primary: #4F46E5 (Indigo)
├── Secondary: #10B981 (Green)
├── Background: #F9FAFB
├── Surface: #FFFFFF
├── Text Primary: #111827
├── Text Secondary: #6B7280
└── Error: #EF4444

字体
├── 标题: 20-24sp, Bold
├── 正文: 14-16sp, Regular
└── 辅助: 12sp, Regular

圆角
├── 卡片: 12dp
├── 按钮: 8dp
└── 输入框: 8dp

间距
├── xs: 4dp
├── sm: 8dp
├── md: 16dp
├── lg: 24dp
└── xl: 32dp
```

### 5.2 共享资源

以下资源两版本共用：
- 图标设计 (SVG)
- 品牌色值
- 交互流程图
- API 接口文档

---

## 6. 开发计划

### 6.1 整体时间线 (4周)

| 阶段 | 时间 | Android | 小程序 |
|------|------|---------|--------|
| 第1周 | Day 1-7 | 项目搭建 + 数据层 + 首页 | 项目搭建 + 数据层 + 首页 |
| 第2周 | Day 8-14 | 箱子/物品管理 | 箱子/物品管理 |
| 第3周 | Day 15-21 | AI 集成 + 搜索 | AI 集成 + 搜索 |
| 第4周 | Day 22-28 | 测试 + 优化 + 发布 | 测试 + 优化 + 提审 |

### 6.2 里程碑

- [ ] **M1**: 基础数据管理完成
- [ ] **M2**: AI 识别功能完成
- [ ] **M3**: 对话搜索完成
- [ ] **M4**: 测试通过，准备发布

---

## 7. 风险与对策

| 风险 | 平台 | 对策 |
|------|------|------|
| 小程序审核被拒 | 小程序 | 提前阅读审核规范，避免敏感词 |
| API 限流 | 通用 | 请求队列 + 重试机制 |
| 存储空间不足 | 小程序 | 图片压缩 + 云存储 |
| 用户不会配置 API | 通用 | 详细教程 + 默认推荐配置 |

---

**GitHub**: https://github.com/huweiopenclaw/homebox-local

**Made with ❤️ by HOC**
