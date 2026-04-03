import Taro from '@tarojs/taro'

interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
  timeout?: number
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

const DEFAULT_TIMEOUT = 30000

export async function request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
  const { url, method = 'GET', data, header = {}, timeout = DEFAULT_TIMEOUT } = config
  
  try {
    const response = await Taro.request({
      url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      timeout
    })
    
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return {
        success: true,
        data: response.data as T
      }
    } else {
      return {
        success: false,
        error: `HTTP ${response.statusCode}: ${JSON.stringify(response.data)}`
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '网络请求失败'
    }
  }
}

// 带认证的请求
export async function authRequest<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
  // 从存储获取 API Key
  const apiKey = await getApiKey()
  
  if (!apiKey) {
    return {
      success: false,
      error: '请先配置 API Key'
    }
  }
  
  return request<T>({
    ...config,
    header: {
      ...config.header,
      'Authorization': `Bearer ${apiKey}`
    }
  })
}

async function getApiKey(): Promise<string | null> {
  try {
    const res = await Taro.getStorage({ key: 'homebox_api_key' })
    return res.data || null
  } catch {
    return null
  }
}

export async function setApiKey(key: string): Promise<void> {
  await Taro.setStorage({ key: 'homebox_api_key', data: key })
}
