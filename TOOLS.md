# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## 网络搜索

使用 **SearchAPI MCP** 进行网络搜索（替代 Brave Search）。

### 调用方式
```bash
npx mcporter call searchapi.search_google q:"搜索内容" --config C:\Users\1990h\.openclaw\config\mcporter.json
```

### 常用工具
- `searchapi.search_google` - Google 网页搜索
- `searchapi.search_google_maps` - 地图/地点搜索
- `searchapi.search_google_flights` - 航班搜索
- `searchapi.search_google_hotels` - 酒店搜索
- `searchapi.search_google_videos` - 视频搜索

### 配置文件
- MCP 服务器: `C:\Users\1990h\.openclaw\tools\searchAPI-mcp`
- mcporter 配置: `C:\Users\1990h\.openclaw\config\mcporter.json`

---

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
