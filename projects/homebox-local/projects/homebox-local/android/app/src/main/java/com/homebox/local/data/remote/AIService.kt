package com.homebox.local.data.remote

import com.homebox.local.core.security.EncryptedPrefs
import io.ktor.client.*
import io.ktor.client.engine.okhttp.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.logging.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json
import javax.inject.Inject
import javax.inject.Singleton

/**
 * AI 服务接口
 */
interface AIService {
    suspend fun recognizeItems(imageBase64: String): Result<AIRecognizeResponse>
    suspend fun chatQuery(query: String, context: String): Result<AIChatResponse>
}

/**
 * AI 服务实现
 */
@Singleton
class AIServiceImpl @Inject constructor(
    private val encryptedPrefs: EncryptedPrefs
) : AIService {

    private val client = HttpClient(OkHttp) {
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
                isLenient = true
            })
        }
        install(Logging) {
            level = LogLevel.INFO
        }
    }

    private var config: AIConfig? = null

    suspend fun updateConfig(newConfig: AIConfig) {
        config = newConfig
        encryptedPrefs.saveAIConfig(newConfig)
    }

    override suspend fun recognizeItems(imageBase64: String): Result<AIRecognizeResponse> = withContext(Dispatchers.IO) {
        runCatching {
            val cfg = config ?: encryptedPrefs.loadAIConfig() ?: return@withContext Result.failure(Exception("AI 未配置"))
            
            val response = client.post("${cfg.baseUrl}/chat/completions") {
                header("Authorization", "Bearer ${cfg.apiKey}")
                contentType(ContentType.Application.Json)
                setBody(buildRecognizeRequest(cfg, imageBase64))
            }
            
            parseRecognizeResponse(response.bodyAsText())
        }
    }

    override suspend fun chatQuery(query: String, context: String): Result<AIChatResponse> = withContext(Dispatchers.IO) {
        runCatching {
            val cfg = config ?: encryptedPrefs.loadAIConfig() ?: return@withContext Result.failure(Exception("AI 未配置"))
            
            val response = client.post("${cfg.baseUrl}/chat/completions") {
                header("Authorization", "Bearer ${cfg.apiKey}")
                contentType(ContentType.Application.Json)
                setBody(buildChatRequest(cfg, query, context))
            }
            
            parseChatResponse(response.bodyAsText())
        }
    }

    private fun buildRecognizeRequest(config: AIConfig, imageBase64: String): Map<String, Any> = mapOf(
        "model" to config.model,
        "messages" to listOf(
            mapOf(
                "role" to "user",
                "content" to listOf(
                    mapOf("type" to "text", "text" to RECOGNIZE_PROMPT),
                    mapOf(
                        "type" to "image_url",
                        "image_url" to mapOf("url" to "data:image/jpeg;base64,$imageBase64")
                    )
                )
            )
        ),
        "max_tokens" to 1000
    )

    private fun buildChatRequest(config: AIConfig, query: String, context: String): Map<String, Any> = mapOf(
        "model" to config.model,
        "messages" to listOf(
            mapOf("role" to "system", "content" to CHAT_SYSTEM_PROMPT),
            mapOf("role" to "user", "content" to "上下文信息:\n$context\n\n用户问题: $query")
        ),
        "max_tokens" to 2000
    )

    private fun parseRecognizeResponse(responseText: String): AIRecognizeResponse {
        // 解析 OpenAI 格式的响应
        val content = extractContent(responseText)
        // 从 content 中提取 JSON 列表
        val items = parseItemsFromContent(content)
        return AIRecognizeResponse(items)
    }

    private fun parseChatResponse(responseText: String): AIChatResponse {
        val content = extractContent(responseText)
        return AIChatResponse(answer = content)
    }

    private fun extractContent(responseText: String): String {
        // 简单的 JSON 解析，实际应使用 kotlinx.serialization
        val contentRegex = """"content"\s*:\s*"(.*?)"""".toRegex(RegexOption.DOT_MATCHES_ALL)
        return contentRegex.find(responseText)?.groupValues?.get(1)?.replace("\\n", "\n") ?: ""
    }

    private fun parseItemsFromContent(content: String): List<RecognizedItem> {
        // 从 AI 返回的内容中解析物品列表
        val items = mutableListOf<RecognizedItem>()
        // 简单的正则匹配
        val itemRegex = """"name"\s*:\s*"(.*?)".*?"quantity"\s*:\s*(\d+).*?"category"\s*:\s*"(.*?)"""".toRegex(RegexOption.DOT_MATCHES_ALL)
        itemRegex.findAll(content).forEach { match ->
            items.add(RecognizedItem(
                name = match.groupValues[1],
                quantity = match.groupValues[2].toIntOrNull() ?: 1,
                category = match.groupValues[3]
            ))
        }
        return items
    }

    companion object {
        private const val RECOGNIZE_PROMPT = """
请仔细识别图片中的所有物品，返回JSON格式的物品列表。
格式要求：
{"items": [{"name": "物品名称", "quantity": 数量, "category": "类别"}]}

类别选项：衣物、电子产品、书籍、厨具、玩具、文具、工具、食品、其他
"""

        private const val CHAT_SYSTEM_PROMPT = """
你是一个家庭收纳助手。用户会询问物品的位置，你需要根据提供的上下文信息回答。

上下文信息包含：
- 箱子列表（带位置信息）
- 物品列表（带所属箱子）

回答要求：
1. 直接回答用户的问题
2. 如果找到物品，说明在哪个箱子和位置
3. 如果没找到，友好地告知
4. 可以提供相关建议
"""
    }
}

/**
 * AI 配置
 */
data class AIConfig(
    val provider: String = "openai",
    val model: String = "gpt-4-vision-preview",
    val apiKey: String = "",
    val baseUrl: String = "https://api.openai.com/v1"
)
