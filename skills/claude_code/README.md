# Claude Code Skill

## 简介
Claude Code 编程助手 Skill，用于代码生成、解释、调试、重构和审查。

## 配置

```json
{
  "baseUrl": "https://open.bigmodel.cn/api/coding/paas/v4",
  "apiKey": "98b8c5a4c32b49c4a14d331daeebcec1.oMmhzzD3iYHjJQps",
  "model": "glm-5"
}
```

## 支持的操作

### 1. 代码生成 (generate)
根据需求生成代码

### 2. 代码解释 (explain)
解释代码的功能和逻辑

### 3. 代码调试 (debug)
分析并修复代码问题

### 4. 代码重构 (refactor)
优化代码结构和质量

### 5. 代码审查 (review)
审查代码并提供改进建议

## API 格式

请求格式：
```json
{
  "model": "glm-5",
  "messages": [
    {"role": "system", "content": "系统提示"},
    {"role": "user", "content": "用户请求"}
  ],
  "temperature": 0.7,
  "max_tokens": 4096
}
```

响应格式：
```json
{
  "choices": [
    {
      "message": {
        "content": "AI 响应内容"
      }
    }
  ]
}
```
