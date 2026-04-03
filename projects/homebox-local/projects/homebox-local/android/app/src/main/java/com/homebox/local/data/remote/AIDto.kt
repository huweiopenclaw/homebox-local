package com.homebox.local.data.remote

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/**
 * AI 识别请求
 */
@Serializable
data class AIRecognizeRequest(
    val image: String,  // Base64 编码的图片
    @SerialName("prompt") val prompt: String = "请识别图片中的所有物品，返回物品名称、数量和类别的JSON列表"
)

/**
 * AI 识别结果
 */
@Serializable
data class AIRecognizeResponse(
    val items: List<RecognizedItem>
)

@Serializable
data class RecognizedItem(
    val name: String,
    val quantity: Int = 1,
    val category: String = "其他"
)

/**
 * AI 对话请求
 */
@Serializable
data class AIChatRequest(
    val query: String,
    val context: String
)

/**
 * AI 对话响应
 */
@Serializable
data class AIChatResponse(
    val answer: String,
    val relatedItems: List<String> = emptyList()
)
