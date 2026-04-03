// utils/ai-chat.js
// AI 对话式搜索服务

const aiConfig = require('./ai-config')

// 请求队列和节流
let lastRequestTime = 0
const MIN_INTERVAL = 2000 // 最小请求间隔 2 秒

/**
 * 延迟函数
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 带重试的请求
 */
async function requestWithRetry(url, options, maxRetries = 3) {
  let lastError = null
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      // 节流：确保请求间隔
      const now = Date.now()
      const elapsed = now - lastRequestTime
      if (elapsed < MIN_INTERVAL) {
        await delay(MIN_INTERVAL - elapsed)
      }
      lastRequestTime = Date.now()

      const response = await new Promise((resolve, reject) => {
        wx.request({
          url: url,
          method: 'POST',
          header: options.header,
          data: options.data,
          success: (res) => resolve(res),
          fail: reject,
          timeout: 60000
        })
      })

      // 处理响应
      if (response.statusCode === 200) {
        return response.data
      } else if (response.statusCode === 429) {
        // 速率限制，等待后重试
        const waitTime = Math.min(1000 * Math.pow(2, i), 10000) // 指数退避，最大 10 秒
        console.log(`API 限流，${waitTime/1000}秒后重试 (${i+1}/${maxRetries})`)
        await delay(waitTime)
        continue
      } else if (response.statusCode === 401) {
        throw new Error('API 密钥无效，请检查配置')
      } else if (response.statusCode === 402) {
        throw new Error('API 余额不足，请充值后重试')
      } else {
        throw new Error(`API 错误 (${response.statusCode})`)
      }
    } catch (error) {
      lastError = error
      if (i < maxRetries - 1) {
        await delay(1000 * (i + 1))
      }
    }
  }
  
  throw lastError || new Error('请求失败，请稍后重试')
}

/**
 * AI 对话式搜索
 * @param {string} query 用户自然语言查询
 * @param {Array} items 所有物品数据
 * @param {Array} locations 所有位置数据
 * @returns {Promise<Object>} AI 回复结果
 */
async function chatSearch(query, items, locations) {
  const config = aiConfig.getConfig()
  
  if (!config.enabled || !config.apiUrl || !config.apiKey) {
    throw new Error('AI 功能未配置，请先在设置中配置 API')
  }

  // 构建数据摘要
  const dataSummary = buildDataSummary(items, locations)

  const systemPrompt = `你是一个家庭物品管理助手。用户会问你关于他们物品的问题，你需要根据提供的数据来回答。

## 数据概览
${dataSummary}

## 回答规则
1. 根据用户问题，从数据中找到匹配的物品
2. 用自然、友好的语气回答
3. 如果找到多个相关物品，列出清单
4. 如果需要统计，给出准确数字
5. 如果没找到，告诉用户没有相关物品
6. 回复格式使用 JSON，结构如下：

### 列表类回复
{
  "type": "list",
  "summary": "简短总结（如：找到 3 件相关物品）",
  "items": [
    {"id": "物品ID", "name": "物品名称", "location": "位置", "relevance": "为什么匹配"}
  ]
}

### 统计类回复
{
  "type": "stats",
  "summary": "统计结果描述",
  "details": "详细说明",
  "count": 数字
}

### 问答类回复
{
  "type": "answer",
  "summary": "简短回答",
  "details": "详细回答"
}

### 未找到
{
  "type": "empty",
  "message": "没有找到相关物品的提示"
}

只返回 JSON，不要有其他文字。`

  try {
    const response = await requestWithRetry(
      config.apiUrl,
      {
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        data: {
          model: config.model || 'glm-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query }
          ],
          max_tokens: 2000,
          temperature: 0.3
        }
      },
      3 // 最多重试 3 次
    )

    const content = response.choices?.[0]?.message?.content || '{}'
    
    // 解析 JSON
    let result
    try {
      // 提取 JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        result = { type: 'answer', summary: content }
      }
    } catch (e) {
      result = { type: 'answer', summary: content }
    }

    return result

  } catch (error) {
    // 友好的错误提示
    let message = error.message
    if (message.includes('429') || message.includes('限流')) {
      message = '请求过于频繁，请稍后再试'
    } else if (message.includes('timeout') || message.includes('超时')) {
      message = '请求超时，请检查网络后重试'
    } else if (message.includes('network') || message.includes('网络')) {
      message = '网络错误，请检查网络连接'
    }
    throw new Error(message)
  }
}

/**
 * 构建数据摘要
 */
function buildDataSummary(items, locations) {
  let summary = `### 物品数据 (共 ${items.length} 件)\n`
  
  // 按分类统计
  const categories = {}
  items.forEach(item => {
    const cat = item.category || '其他'
    categories[cat] = (categories[cat] || 0) + 1
  })
  
  summary += '分类统计:\n'
  Object.entries(categories).forEach(([cat, count]) => {
    summary += `- ${cat}: ${count}件\n`
  })
  
  // 位置统计
  summary += `\n### 位置数据 (共 ${locations.length} 个房间)\n`
  locations.forEach(room => {
    summary += `- ${room.name}`
    if (room.furniture && room.furniture.length > 0) {
      summary += ` (${room.furniture.length}个家具)`
    }
    summary += '\n'
  })
  
  // 物品详情（限制数量避免过长）
  summary += `\n### 物品详情\n`
  const displayItems = items.slice(0, 50) // 限制 50 个，减少 token
  displayItems.forEach(item => {
    summary += `- ID:${item.id} | ${item.name} | ${item.category} | ${item.location || '未设置位置'} | 数量:${item.quantity || 1}\n`
  })
  
  if (items.length > 50) {
    summary += `... 还有 ${items.length - 50} 件物品\n`
  }

  return summary
}

module.exports = {
  chatSearch
}
