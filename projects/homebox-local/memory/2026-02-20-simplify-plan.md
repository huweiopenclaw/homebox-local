# HomeBox Flutter 项目简化方案

## 问题分析

`build_runner` 运行 29+ 分钟，卡在处理 5 个页面文件。

## 解决方案：简化项目

移除复杂的代码生成依赖，使用更简单的方式。

### 步骤 1: 简化 pubspec.yaml

移除不需要的代码生成依赖：
- riverpod_generator (改用 flutter_riverpod 直接)
- freezed (改用普通类)
- json_serializable (改用手动序列化)
- retrofit_generator (改用 dio 直接)

### 步骤 2: 简化页面代码

- 使用 ConsumerWidget 替代生成的 provider
- 使用普通数据类替代 freezed
- 手动实现 JSON 序列化

### 步骤 3: 验证编译

运行 `flutter analyze` 和 `flutter build`

---

## 执行中...
