#!/usr/bin/env node
/**
 * 任务同步工具
 * 用于从命令行更新任务看板的任务数据
 * 
 * 用法:
 *   node sync-task.js add "任务标题" --status "进行中" --priority "高"
 *   node sync-task.js update task-001 --status "已完成"
 *   node sync-task.js list
 */

const fs = require('fs');
const path = require('path');

const TASKS_FILE = path.join(__dirname, '..', '..', 'memory', 'tasks.json');

function loadTasks() {
  if (!fs.existsSync(TASKS_FILE)) {
    return { tasks: [], metadata: { lastUpdated: Date.now(), version: 1 } };
  }
  return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
}

function saveTasks(data) {
  data.metadata.lastUpdated = Date.now();
  fs.writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2));
}

function addTask(title, options = {}) {
  const data = loadTasks();
  const task = {
    id: `task-${Date.now()}`,
    title,
    description: options.description || '',
    status: options.status || '待办',
    assignee: options.assignee || 'HOC',
    priority: options.priority || '中',
    taskType: options.taskType || '普通',
    project: options.project || '',
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  data.tasks.push(task);
  saveTasks(data);
  console.log(`✅ 任务已添加: ${task.id} - ${title}`);
  return task;
}

function updateTask(taskId, updates) {
  const data = loadTasks();
  const index = data.tasks.findIndex(t => t.id === taskId);
  if (index === -1) {
    console.error(`❌ 任务不存在: ${taskId}`);
    return null;
  }
  data.tasks[index] = {
    ...data.tasks[index],
    ...updates,
    updatedAt: Date.now()
  };
  if (updates.status === '已完成') {
    data.tasks[index].completedAt = Date.now();
  }
  saveTasks(data);
  console.log(`✅ 任务已更新: ${taskId}`);
  return data.tasks[index];
}

function listTasks() {
  const data = loadTasks();
  console.log('\n📋 任务列表:\n');
  data.tasks.forEach(task => {
    const statusIcon = {
      '待办': '📋',
      '进行中': '🔄',
      '已完成': '✅',
      '已取消': '❌'
    }[task.status] || '❓';
    console.log(`${statusIcon} [${task.id}] ${task.title} (${task.status})`);
  });
  console.log(`\n共 ${data.tasks.length} 个任务`);
}

// 命令行参数解析
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'add':
    const title = args[1];
    const options = {};
    for (let i = 2; i < args.length; i += 2) {
      const key = args[i].replace('--', '');
      options[key] = args[i + 1];
    }
    addTask(title, options);
    break;
  case 'update':
    const taskId = args[1];
    const updates = {};
    for (let i = 2; i < args.length; i += 2) {
      const key = args[i].replace('--', '');
      updates[key] = args[i + 1];
    }
    updateTask(taskId, updates);
    break;
  case 'list':
    listTasks();
    break;
  default:
    console.log('用法:');
    console.log('  node sync-task.js add "任务标题" --status "进行中" --priority "高"');
    console.log('  node sync-task.js update task-001 --status "已完成"');
    console.log('  node sync-task.js list');
}
