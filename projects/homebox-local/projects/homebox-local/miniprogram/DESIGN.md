# HomeBox Local - 微信小程序版设计

**平台**: 微信小程序
**框架**: Taro 3.x + React
**语言**: TypeScript

---

## 1. 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Taro | 3.6+ |
| 语言 | TypeScript | 5.0+ |
| UI | Taro UI / 自定义 | - |
| 状态管理 | Zustand | Latest |
| HTTP | Taro.request | - |
| 样式 | Sass | - |

---

## 2. 目录结构

```
homebox-miniprogram/
├── src/
│   ├── app.config.ts          # 小程序配置
│   ├── app.ts                 # 入口
│   ├── app.scss               # 全局样式
│   │
│   ├── pages/                 # 页面
│   │   ├── home/
│   │   ├── box/
│   │   ├── item/
│   │   ├── search/
│   │   ├── chat/
│   │   └── settings/
│   │
│   ├── components/            # 组件
│   ├── stores/                # 状态
│   ├── services/              # 服务
│   ├── api/                   # API
│   ├── hooks/                 # Hooks
│   ├── utils/                 # 工具
│   ├── types/                 # 类型
│   └── constants/             # 常量
│
├── project.config.json
└── package.json
```

---

## 3. 页面配置

```typescript
// app.config.ts
export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/box/list/index',
    'pages/box/detail/index',
    'pages/box/add/index',
    'pages/item/list/index',
    'pages/item/add/index',
    'pages/search/index',
    'pages/chat/index',
    'pages/settings/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#4F46E5',
    navigationBarTitleText: 'HomeBox',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#6B7280',
    selectedColor: '#4F46E5',
    backgroundColor: '#FFFFFF',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: 'assets/icons/home.png',
        selectedIconPath: 'assets/icons/home-active.png'
      },
      {
        pagePath: 'pages/box/list/index',
        text: '箱子',
        iconPath: 'assets/icons/box.png',
        selectedIconPath: 'assets/icons/box-active.png'
      },
      {
        pagePath: 'pages/search/index',
        text: '搜索',
        iconPath: 'assets/icons/search.png',
        selectedIconPath: 'assets/icons/search-active.png'
      },
      {
        pagePath: 'pages/settings/index',
        text: '设置',
        iconPath: 'assets/icons/settings.png',
        selectedIconPath: 'assets/icons/settings-active.png'
      }
    ]
  }
})
```

---

## 4. 数据存储

### 4.1 本地存储

```typescript
// 小程序本地存储限制：10MB

// 存储结构
interface StorageSchema {
  'homebox_boxes': Box[]
  'homebox_items': Item[]
  'homebox_locations': Location[]
  'homebox_ai_config': AIConfig
  'homebox_search_history': SearchHistory[]
}

// 容量管理
const MAX_STORAGE_SIZE = 10 * 1024 * 1024  // 10MB
const PHOTO_QUALITY = 0.7  // 压缩质量
const MAX_PHOTO_SIZE = 200 * 1024  // 单张最大 200KB
```

### 4.2 照片存储策略

```typescript
// 1. 拍照/选择照片
const chooseImage = async () => {
  const res = await Taro.chooseMedia({
    count: 1,
    mediaType: ['image'],
    sourceType: ['album', 'camera']
  })
  
  // 2. 压缩
  const compressed = await compressImage(res.tempFiles[0].tempFilePath)
  
  // 3. 转存为持久化文件
  const savedPath = await Taro.saveFile({
    tempFilePath: compressed
  })
  
  return savedPath.savedFilePath
}

// 压缩图片
const compressImage = async (filePath: string): Promise<string> => {
  const info = await Taro.getImageInfo({ src: filePath })
  
  // 计算压缩比例
  let quality = PHOTO_QUALITY
  if (info.width > 1080 || info.height > 1080) {
    // 需要缩放
    const ratio = Math.min(1080 / info.width, 1080 / info.height)
    // ...
  }
  
  return await Taro.compressImage({
    src: filePath,
    quality
  }).then(res => res.tempFilePath)
}
```

---

## 5. 状态管理 (Zustand)

```typescript
// stores/boxStore.ts
import { create } from 'zustand'
import { storageService } from '../services/storageService'

interface BoxState {
  boxes: Box[]
  loading: boolean
  
  // Actions
  loadBoxes: () => Promise<void>
  addBox: (box: Box) => Promise<void>
  updateBox: (box: Box) => Promise<void>
  deleteBox: (id: string) => Promise<void>
}

export const useBoxStore = create<BoxState>((set, get) => ({
  boxes: [],
  loading: false,
  
  loadBoxes: async () => {
    set({ loading: true })
    const boxes = await storageService.getBoxes()
    set({ boxes, loading: false })
  },
  
  addBox: async (box) => {
    await storageService.addBox(box)
    set({ boxes: [...get().boxes, box] })
  },
  
  updateBox: async (box) => {
    await storageService.updateBox(box)
    set({ 
      boxes: get().boxes.map(b => b.id === box.id ? box : b) 
    })
  },
  
  deleteBox: async (id) => {
    await storageService.deleteBox(id)
    set({ boxes: get().boxes.filter(b => b.id !== id) })
  }
}))
```

---

## 6. API 调用封装

```typescript
// api/request.ts
import Taro from '@tarojs/taro'

interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
}

export const request = async <T>(config: RequestConfig): Promise<T> => {
  const { url, method = 'GET', data, header = {} } = config
  
  // 获取 API Key
  const aiConfig = Taro.getStorageSync('homebox_ai_config')
  if (aiConfig?.apiKey) {
    header['Authorization'] = `Bearer ${aiConfig.apiKey}`
  }
  
  try {
    const res = await Taro.request({
      url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header
      }
    })
    
    if (res.statusCode === 200) {
      return res.data as T
    } else {
      throw new Error(`请求失败: ${res.statusCode}`)
    }
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}
```

---

## 7. 核心页面示例

### 7.1 添加箱子页面

```tsx
// pages/box/add/index.tsx
import { View, Text, Input, Button, Image } from '@tarojs/components'
import { useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { useBoxStore } from '../../../stores/boxStore'
import { aiService } from '../../../services/aiService'
import { generateId } from '../../../utils/uuid'
import './index.scss'

export default function AddBoxPage() {
  const [name, setName] = useState('')
  const [photoPath, setPhotoPath] = useState('')
  const [recognizedItems, setRecognizedItems] = useState<RecognizedItem[]>([])
  const [loading, setLoading] = useState(false)
  
  const addBox = useBoxStore(state => state.addBox)
  
  // 拍照识别
  const handleTakePhoto = async () => {
    try {
      const res = await Taro.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['camera']
      })
      
      const tempPath = res.tempFiles[0].tempFilePath
      setPhotoPath(tempPath)
      
      // AI 识别
      setLoading(true)
      const items = await aiService.recognizeItems(tempPath)
      setRecognizedItems(items)
      setLoading(false)
      
    } catch (error) {
      Taro.showToast({ title: '拍照失败', icon: 'error' })
    }
  }
  
  // 保存箱子
  const handleSave = async () => {
    if (!name.trim()) {
      Taro.showToast({ title: '请输入箱子名称', icon: 'none' })
      return
    }
    
    const box: Box = {
      id: generateId(),
      name,
      photoPath,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    
    await addBox(box)
    
    // 保存识别的物品
    for (const item of recognizedItems) {
      await addItem({
        id: generateId(),
        boxId: box.id,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        createdAt: Date.now(),
        updatedAt: Date.now()
      })
    }
    
    Taro.showToast({ title: '保存成功', icon: 'success' })
    Taro.navigateBack()
  }
  
  return (
    <View className="add-box-page">
      {/* 照片区域 */}
      <View className="photo-section">
        {photoPath ? (
          <Image src={photoPath} mode="aspectFill" className="box-photo" />
        ) : (
          <View className="photo-placeholder" onClick={handleTakePhoto}>
            <Text className="icon">📷</Text>
            <Text>点击拍照识别</Text>
          </View>
        )}
      </View>
      
      {/* 箱子名称 */}
      <View className="input-section">
        <Text className="label">箱子名称</Text>
        <Input 
          value={name}
          onInput={e => setName(e.detail.value)}
          placeholder="例如：冬季衣物-1"
          className="input"
        />
      </View>
      
      {/* 识别结果 */}
      {recognizedItems.length > 0 && (
        <View className="recognized-section">
          <Text className="label">识别到的物品</Text>
          {recognizedItems.map((item, index) => (
            <View key={index} className="item-row">
              <Text>{item.name}</Text>
              <Text>x{item.quantity}</Text>
            </View>
          ))}
        </View>
      )}
      
      {/* 保存按钮 */}
      <Button 
        className="save-btn" 
        onClick={handleSave}
        loading={loading}
      >
        保存
      </Button>
    </View>
  )
}
```

### 7.2 AI 对话页面

```tsx
// pages/chat/index.tsx
import { View, Text, Input, ScrollView } from '@tarojs/components'
import { useState, useRef } from 'react'
import Taro from '@tarojs/taro'
import { aiService } from '../../services/aiService'
import { storageService } from '../../services/storageService'
import './index.scss'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  items?: Item[]
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollViewRef = useRef(null)
  
  // 发送消息
  const handleSend = async () => {
    if (!input.trim() || loading) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    
    try {
      // 构建上下文
      const boxes = await storageService.getBoxes()
      const items = await storageService.getItems()
      const context = buildContext(boxes, items)
      
      // 调用 AI
      const answer = await aiService.chatQuery(input, context)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer
      }
      
      setMessages(prev => [...prev, assistantMessage])
      
    } catch (error) {
      Taro.showToast({ title: '查询失败', icon: 'error' })
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <View className="chat-page">
      {/* 消息列表 */}
      <ScrollView 
        className="message-list"
        scrollIntoView={messages.length > 0 ? `msg-${messages.length - 1}` : ''}
        scrollY
      >
        {messages.map((msg, index) => (
          <View 
            key={msg.id}
            id={`msg-${index}`}
            className={`message ${msg.role}`}
          >
            <Text className="content">{msg.content}</Text>
          </View>
        ))}
        
        {loading && (
          <View className="message assistant loading">
            <Text>思考中...</Text>
          </View>
        )}
      </ScrollView>
      
      {/* 输入区域 */}
      <View className="input-area">
        <Input
          value={input}
          onInput={e => setInput(e.detail.value)}
          onConfirm={handleSend}
          placeholder="问问你的物品在哪..."
          className="input"
        />
        <View className="send-btn" onClick={handleSend}>
          <Text>发送</Text>
        </View>
      </View>
    </View>
  )
}
```

---

## 8. 小程序限制与对策

| 限制 | 具体说明 | 对策 |
|------|----------|------|
| 本地存储 10MB | 单个小程序最多 10MB | 图片压缩 + 云存储 |
| 包体积 2MB | 主包不超过 2MB | 分包加载 |
| 无后台运行 | 切后台即停止 | 提示保持前台 |
| 网络请求域名 | 需在小程序后台配置 | 提前配置 AI API 域名 |
| 相机能力 | 无法直接调用系统相机 | 使用 wx.chooseMedia |
| 无生物识别 | 不支持指纹/面容 | 设置密码锁 |

---

## 9. 分包策略

```typescript
// app.config.ts
export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/settings/index'
  ],
  subPackages: [
    {
      root: 'pages/box',
      pages: ['list/index', 'detail/index', 'add/index']
    },
    {
      root: 'pages/item',
      pages: ['list/index', 'add/index']
    },
    {
      root: 'pages/search',
      pages: ['index']
    },
    {
      root: 'pages/chat',
      pages: ['index']
    }
  ]
})
```

---

## 10. 依赖 (package.json)

```json
{
  "dependencies": {
    "@tarojs/components": "^3.6.0",
    "@tarojs/helper": "^3.6.0",
    "@tarojs/plugin-framework-react": "^3.6.0",
    "@tarojs/plugin-platform-weapp": "^3.6.0",
    "@tarojs/react": "^3.6.0",
    "@tarojs/runtime": "^3.6.0",
    "@tarojs/shared": "^3.6.0",
    "@tarojs/taro": "^3.6.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@tarojs/cli": "^3.6.0",
    "@types/react": "^18.2.0",
    "sass": "^1.69.0",
    "typescript": "^5.0.0"
  }
}
```
