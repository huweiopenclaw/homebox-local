# ⚠️ 定时任务诊断报告

## 📅 时间: 2026-02-20 14:15

---

## 🔍 问题诊断

### 1. 定时任务状态

| 属性 | 值 | 问题 |
|------|-----|------|
| TaskName | openclaw | ✅ |
| State | Ready | ✅ |
| **Trigger** | **MSFT_TaskLogonTrigger** | ⚠️ **仅登录时触发** |
| LastRunTime | 2026/2/20 10:21:41 | ✅ |
| NextRunTime | **空** | ❌ **没有下次运行时间** |

### 2. Jobs 配置

```json
{
  "version": 1,
  "jobs": []  // ❌ 空的！没有定时任务配置
}
```

### 3. 任务动作

```
Execute: powershell.exe
Arguments: -WindowStyle Hidden -ExecutionPolicy Bypass -File "C:\openclaw\start-openclaw.ps1"
```

---

## 🚨 问题根源

1. **触发器类型错误**
   - 当前: `LogonTrigger` (登录触发)
   - 需要: `TimeTrigger` (定时触发)

2. **jobs.json 是空的**
   - 没有配置任何定时任务

3. **没有 NextRunTime**
   - 系统不知道何时下次运行

---

## 🔧 解决方案

### 方案 A: 添加定时触发器 (推荐)

```powershell
# 创建每10分钟运行的触发器
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 10)

# 更新任务
Set-ScheduledTask -TaskName "openclaw" -Trigger $trigger
```

### 方案 B: 配置 jobs.json

```json
{
  "version": 1,
  "jobs": [
    {
      "id": "report-10min",
      "name": "每10分钟汇报",
      "schedule": "*/10 * * * *",
      "command": "report-status",
      "enabled": true
    }
  ]
}
```

### 方案 C: 重新创建定时任务

```powershell
# 删除旧任务
Unregister-ScheduledTask -TaskName "openclaw" -Confirm:$false

# 创建新任务 (每10分钟)
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 10) -RepetitionDuration ([TimeSpan]::MaxValue)
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-WindowStyle Hidden -ExecutionPolicy Bypass -File `"C:\openclaw\start-openclaw.ps1`""
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -DontStopOnIdleEnd -AllowStartIfOnBatteries

Register-ScheduledTask -TaskName "openclaw" -Trigger $trigger -Action $action -Settings $settings -RunLevel Highest
```

---

## 📋 立即修复

正在为您修复...

---

**诊断完成时间**: 2026-02-20 14:16
