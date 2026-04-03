// utils/ai-recognition.js
// AI 识别服务

const aiConfig = require('./ai-config')

/**
 * 调用 VLM API 识别图片中的物品
 * @param {string} imagePath 图片临时路径
 * @returns {Promise<Array>} 识别到的物品列表
 */
async function recognizeItems(imagePath) {
  const config = aiConfig.getConfig()
  
  if (!config.enabled || !config.apiUrl || !config.apiKey) {
    throw new Error('AI 识别未配置，请先在设置中配置 API')
  }

  // 读取图片并转为 base64
  const base64Image = await new Promise((resolve, reject) => {
    wx.getFileSystemManager().readFile({
      filePath: imagePath,
      encoding: 'base64',
      success: (res) => resolve(res.data),
      fail: reject
    })
  })

  // 获取图片 MIME 类型
  const ext = imagePath.split('.').pop().toLowerCase()
  const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg'

  // 构建请求
  const prompt = `请分析这张图片，识别出箱子/容器中的所有物品。

对于每个物品，请提供：
1. name: 物品名称（简洁准确）
2. category: 分类（电子产品/衣物/书籍/厨具/工具/文具/玩具/运动器材/食品/药品/文件/其他）
3. quantity: 数量（数字）
4. description: 简短描述（可选）

请以 JSON 数组格式返回，格式如下：
[
  {"name": "物品名称", "category": "分类", "quantity": 1, "description": "描述"},
  ...
]

如果无法识别或图片不清晰，请返回空数组 []
只返回 JSON 数组，不要有其他文字说明。`

  try {
    const response = await new Promise((resolve, reject) => {
      wx.request({
        url: config.apiUrl,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        data: {
          model: config.model || 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompt
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${mimeType};base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          max_tokens: 2000,
          temperature: 0.3
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else {
            reject(new Error(`API 返回错误: ${res.statusCode}`))
          }
        },
        fail: reject,
        timeout: 60000
      })
    })

    // 解析响应
    const content = response.choices?.[0]?.message?.content || '[]'
    
    // 提取 JSON 数组
    let jsonStr = content
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      jsonStr = jsonMatch[0]
    }
    
    const items = JSON.parse(jsonStr)
    
    // 验证并格式化物品
    return items.map((item, index) => ({
      id: `ai_${Date.now()}_${index}`,
      name: item.name || `物品 ${index + 1}`,
      category: item.category || '其他',
      quantity: parseInt(item.quantity) || 1,
      description: item.description || '',
      confidence: item.confidence || 0.8
    }))
    
  } catch (error) {
    console.error('AI 识别失败:', error)
    throw new Error(`识别失败: ${error.message}`)
  }
}

/**
 * 测试 API 连接
 */
async function testConnection() {
  const config = aiConfig.getConfig()
  
  if (!config.apiUrl || !config.apiKey) {
    throw new Error('请先配置 API URL 和 Key')
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: config.apiUrl.replace('/chat/completions', '/models'),
      method: 'GET',
      header: {
        'Authorization': `Bearer ${config.apiKey}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(true)
        } else {
          reject(new Error(`连接失败: ${res.statusCode}`))
        }
      },
      fail: (error) => {
        reject(new Error(`连接失败: ${error.errMsg}`))
      },
      timeout: 10000
    })
  })
}

module.exports = {
  recognizeItems,
  testConnection
}
