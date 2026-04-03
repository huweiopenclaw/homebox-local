import { request, setApiKey, authRequest } from './request'
import { RecognizedItem } from '../types'

interface AIConfig {
  provider: string
  model: string
  apiKey: string
  baseUrl: string
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | ChatContent[]
}

interface ChatContent {
  type: 'text' | 'image_url'
  text?: string
  image_url?: { url: string }
}

class AIApiService {
  private config: AIConfig | null = null
  
  async configure(config: AIConfig): Promise<void> {
    this.config = config
    await setApiKey(config.apiKey)
    
    // 保存完整配置
    await Taro.setStorage({
      key: 'homebox_ai_config',
      data: JSON.stringify(config)
    })
  }
  
  async loadConfig(): Promise<AIConfig | null> {
    try {
      const res = await Taro.getStorage({ key: 'homebox_ai_config' })
      this.config = JSON.parse(res.data)
      return this.config
    } catch {
      return null
    }
  }
  
  async recognizeItems(imageBase64: string): Promise<RecognizedItem[]> {
    const config = this.config || await this.loadConfig()
    if (!config) {
      throw new Error('请先配置 AI 服务')
    }
    
    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: RECOGNIZE_PROMPT
          },
          {
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
          }
        ]
      }
    ]
    
    const response = await this.chat(config, messages)
    return this.parseItems(response)
  }
  
  async chatQuery(query: string, context: string): Promise<string> {
    const config = this.config || await this.loadConfig()
    if (!config) {
      throw new Error('请先配置 AI 服务')
    }
    
    const messages: ChatMessage[] = [
      { role: 'system', content: CHAT_SYSTEM_PROMPT },
      { role: 'user', content: `上下文信息:\n${context}\n\n用户问题: ${query}` }
    ]
    
    return await this.chat(config, messages)
  }
  
  private async chat(config: AIConfig, messages: ChatMessage[]): Promise<string> {
    const response = await request({
      url: `${config.baseUrl}/chat/completions`,
      method: 'POST',
      data: {
        model: config.model,
        messages,
        max_tokens: 2000
      },
      header: {
        'Authorization': `Bearer ${config.apiKey}`
      }
    })
    
    if (!response.success) {
      throw new Error(response.error || 'AI 请求失败')
    }
    
    // 解析 OpenAI 格式响应
    const choices = (response.data as any)?.choices
    if (choices && choices.length > 0) {
      return choices[0].message?.content || ''
    }
    
    return ''
  }
  
  private parseItems(content: string): RecognizedItem[] {
    const items: RecognizedItem[] = []
    
    // 尝试解析 JSON
    try {
      const jsonMatch = content.match(/\{[\s\S]*"items"[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        if (Array.isArray(parsed.items)) {
          return parsed.items.map((item: any) => ({
            name: item.name || '未知物品',
            quantity: item.quantity || 1,
            category: item.category || '其他'
          }))
        }
      }
    } catch {}
    
    // 正则匹配
    const itemRegex = /"name"\s*:\s*"([^"]+)"/g
    let match
    while ((match = itemRegex.exec(content)) !== null) {
      items.push({
        name: match[1],
        quantity: 1,
        category: '其他'
      })
    }
    
    return items
  }
}

export const aiApi = new AIApiService()

const RECOGNIZE_PROMPT = `请仔细识别图片中的所有物品，返回JSON格式的物品列表。
格式要求：
{"items": [{"name": "物品名称", "quantity": 数量, "category": "类别"}]}

类别选项：衣物、电子产品、书籍、厨具、玩具、文具、工具、食品、其他`

const CHAT_SYSTEM_PROMPT = `你是一个家庭收纳助手。用户会询问物品的位置，你需要根据提供的上下文信息回答。

上下文信息包含：
- 箱子列表（带位置信息）
- 物品列表（带所属箱子）

回答要求：
1. 直接回答用户的问题
2. 如果找到物品，说明在哪个箱子和位置
3. 如果没找到，友好地告知
4. 可以提供相关建议`
