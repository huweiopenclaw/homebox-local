"use client";

import { useState, useEffect, useMemo } from "react";

// ============ 类型定义 ============
type TaskStatus = "待办" | "进行中" | "已完成" | "已取消";
type Assignee = "HOC" | "主人";
type Priority = "低" | "中" | "高" | "紧急";
type TaskType = "普通" | "计划任务" | "Cron任务";
type RepeatType = "不重复" | "每天" | "每周" | "每月" | "自定义";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee: Assignee;
  priority: Priority;
  taskType: TaskType;
  scheduledDate?: string;
  scheduledTime?: string;
  repeatType: RepeatType;
  cronExpression?: string;
  createdAt: number;
  updatedAt: number;
}

type MemoryCategory = "人物" | "项目" | "偏好" | "决策" | "知识" | "日常" | "其他";

interface Memory {
  id: string;
  title: string;
  content: string;
  category: MemoryCategory;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

type ViewMode = "看板" | "日历" | "记忆" | "团队" | "办公室";

type AgentRole = "指挥" | "开发" | "写作" | "设计" | "研究" | "运营";
type AgentStatus = "空闲" | "工作中" | "离线";

interface TeamAgent {
  id: string;
  name: string;
  emoji: string;
  role: AgentRole;
  title: string;
  description: string;
  skills: string[];
  status: AgentStatus;
  currentTask?: string;
  tasksCompleted: number;
  color: string;
  deskPosition: { row: number; col: number };
}

// ============ 存储 ============
const TASKS_KEY = "mission-control-tasks";
const MEMORIES_KEY = "mission-control-memories";

// API 调用
const API_URL = "/api/tasks";

const loadTasksFromAPI = async (): Promise<Task[]> => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    return data.tasks || [];
  } catch (error) {
    console.error("Failed to load tasks from API:", error);
    return [];
  }
};

const saveTasksToAPI = async (tasks: Task[]): Promise<boolean> => {
  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "sync", tasks })
    });
    return true;
  } catch (error) {
    console.error("Failed to save tasks to API:", error);
    return false;
  }
};

const loadTasks = (): Task[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(TASKS_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  // 同时保存到 API
  saveTasksToAPI(tasks);
};

const loadMemories = (): Memory[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(MEMORIES_KEY);
  return stored ? JSON.parse(stored) : [];
};
const saveMemories = (memories: Memory[]) => localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories));

// ============ 团队成员（带座位位置） ============
const teamMembers: TeamAgent[] = [
  { id: "hoc", name: "HOC", emoji: "🤖", role: "指挥", title: "总指挥", description: "主代理，负责协调所有子代理工作", skills: ["任务分配", "进度跟踪"], status: "工作中", currentTask: "管理 Mission Control", tasksCompleted: 127, color: "from-indigo-500 to-purple-600", deskPosition: { row: 0, col: 1 } },
  { id: "codedev", name: "CodeDev", emoji: "💻", role: "开发", title: "高级开发工程师", description: "专注于代码开发", skills: ["TypeScript", "React", "Node.js"], status: "空闲", tasksCompleted: 45, color: "from-green-500 to-emerald-600", deskPosition: { row: 1, col: 0 } },
  { id: "bughunter", name: "BugHunter", emoji: "🐛", role: "开发", title: "调试专家", description: "专门负责代码调试", skills: ["调试", "日志分析"], status: "空闲", tasksCompleted: 32, color: "from-orange-500 to-red-600", deskPosition: { row: 1, col: 1 } },
  { id: "testrunner", name: "TestRunner", emoji: "🧪", role: "开发", title: "测试工程师", description: "负责测试", skills: ["单元测试", "E2E测试"], status: "空闲", tasksCompleted: 28, color: "from-cyan-500 to-blue-600", deskPosition: { row: 1, col: 2 } },
  { id: "contentwriter", name: "ContentWriter", emoji: "✍️", role: "写作", title: "内容创作专家", description: "负责内容创作", skills: ["文章写作", "SEO"], status: "空闲", tasksCompleted: 23, color: "from-pink-500 to-rose-600", deskPosition: { row: 2, col: 0 } },
  { id: "docmaster", name: "DocMaster", emoji: "📚", role: "写作", title: "技术文档专家", description: "负责文档编写", skills: ["API文档", "Markdown"], status: "空闲", tasksCompleted: 18, color: "from-violet-500 to-purple-600", deskPosition: { row: 2, col: 1 } },
  { id: "uidesigner", name: "UIDesigner", emoji: "🎨", role: "设计", title: "UI/UX 设计师", description: "负责界面设计", skills: ["UI设计", "Figma"], status: "空闲", tasksCompleted: 15, color: "from-fuchsia-500 to-pink-600", deskPosition: { row: 2, col: 2 } },
  { id: "dataviz", name: "DataViz", emoji: "📊", role: "设计", title: "数据可视化专家", description: "负责数据可视化", skills: ["D3.js", "图表设计"], status: "空闲", tasksCompleted: 12, color: "from-amber-500 to-orange-600", deskPosition: { row: 3, col: 0 } },
  { id: "websearcher", name: "WebSearcher", emoji: "🔍", role: "研究", title: "网络搜索专家", description: "负责网络搜索", skills: ["搜索", "调研"], status: "空闲", tasksCompleted: 56, color: "from-sky-500 to-blue-600", deskPosition: { row: 3, col: 1 } },
  { id: "dataanalyst", name: "DataAnalyst", emoji: "📈", role: "研究", title: "数据分析师", description: "负责数据分析", skills: ["Python", "SQL"], status: "空闲", tasksCompleted: 21, color: "from-teal-500 to-green-600", deskPosition: { row: 3, col: 2 } },
  { id: "taskmanager", name: "TaskManager", emoji: "📋", role: "运营", title: "任务管理专家", description: "负责任务管理", skills: ["任务分配", "进度管理"], status: "空闲", tasksCompleted: 34, color: "from-slate-500 to-gray-600", deskPosition: { row: 4, col: 0 } },
  { id: "scheduler", name: "Scheduler", emoji: "⏰", role: "运营", title: "日程管理专家", description: "负责日程安排", skills: ["日程", "提醒"], status: "空闲", tasksCompleted: 89, color: "from-lime-500 to-green-600", deskPosition: { row: 4, col: 1 } },
];

const initialTasks: Task[] = [
  { id: "1", title: "完成任务看板开发", status: "进行中", assignee: "HOC", priority: "高", taskType: "普通", repeatType: "不重复", createdAt: Date.now(), updatedAt: Date.now() },
  { id: "2", title: "每日心跳检查", status: "待办", assignee: "HOC", priority: "中", taskType: "Cron任务", repeatType: "每天", scheduledTime: "06:00", createdAt: Date.now(), updatedAt: Date.now() },
];

const initialMemories: Memory[] = [
  { id: "1", title: "主人身份信息", content: "# 主人信息\n\n- **称呼**: 主人\n- **时区**: Asia/Shanghai", category: "人物", tags: ["主人"], createdAt: Date.now() - 86400000, updatedAt: Date.now() - 86400000 },
  { id: "2", title: "HOC 身份定义", content: "# HOC\n\n- **名称**: HOC\n- **类型**: AI机器人助理", category: "人物", tags: ["HOC"], createdAt: Date.now() - 72000000, updatedAt: Date.now() - 72000000 },
];

// ============ 颜色配置 ============
const statusColors: Record<TaskStatus, string> = { 待办: "bg-gray-100 text-gray-800", 进行中: "bg-blue-100 text-blue-800", 已完成: "bg-green-100 text-green-800", 已取消: "bg-red-100 text-red-800" };
const priorityColors: Record<Priority, string> = { 低: "bg-gray-50 text-gray-600", 中: "bg-yellow-50 text-yellow-700", 高: "bg-orange-50 text-orange-700", 紧急: "bg-red-50 text-red-700" };
const assigneeColors: Record<Assignee, string> = { HOC: "bg-purple-100 text-purple-800", 主人: "bg-indigo-100 text-indigo-800" };
const taskTypeColors: Record<TaskType, string> = { 普通: "bg-slate-100 text-slate-700", 计划任务: "bg-cyan-100 text-cyan-700", Cron任务: "bg-amber-100 text-amber-700" };
const categoryColors: Record<MemoryCategory, string> = { 人物: "bg-pink-100 text-pink-800", 项目: "bg-blue-100 text-blue-800", 偏好: "bg-green-100 text-green-800", 决策: "bg-orange-100 text-orange-800", 知识: "bg-purple-100 text-purple-800", 日常: "bg-cyan-100 text-cyan-800", 其他: "bg-gray-100 text-gray-800" };
const categoryIcons: Record<MemoryCategory, string> = { 人物: "👤", 项目: "📁", 偏好: "❤️", 决策: "💡", 知识: "📚", 日常: "🏠", 其他: "📝" };
const roleColors: Record<AgentRole, string> = { 指挥: "bg-indigo-500", 开发: "bg-green-500", 写作: "bg-pink-500", 设计: "bg-purple-500", 研究: "bg-blue-500", 运营: "bg-amber-500" };

// ============ 工具函数 ============
const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();
const getTodayString = () => new Date().toISOString().split("T")[0];

// ============ 办公室工位组件 ============
function DeskCard({ agent, onClick }: { agent: TeamAgent; onClick: () => void }) {
  const isWorking = agent.status === "工作中";
  const isOffline = agent.status === "离线";
  
  return (
    <div
      onClick={onClick}
      className={`relative bg-slate-800/80 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
        isWorking ? "border-green-500/50 shadow-lg shadow-green-500/20" : 
        isOffline ? "border-gray-600/30 opacity-60" : 
        "border-slate-600/50 hover:border-slate-500"
      }`}
    >
      {/* 状态指示灯 */}
      <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${
        isWorking ? "bg-green-500 animate-pulse" : 
        isOffline ? "bg-gray-500" : 
        "bg-yellow-500"
      }`}></div>
      
      {/* 电脑显示器 */}
      <div className="bg-slate-900 rounded-lg p-3 mb-3 relative">
        <div className="bg-slate-700 rounded h-16 flex items-center justify-center overflow-hidden">
          {isWorking ? (
            <div className="text-center">
              <div className="text-2xl animate-bounce">{agent.emoji}</div>
              <div className="flex justify-center gap-1 mt-1">
                <span className="w-1 h-3 bg-green-400 rounded animate-pulse"></span>
                <span className="w-1 h-4 bg-green-400 rounded animate-pulse" style={{animationDelay: "0.1s"}}></span>
                <span className="w-1 h-2 bg-green-400 rounded animate-pulse" style={{animationDelay: "0.2s"}}></span>
                <span className="w-1 h-5 bg-green-400 rounded animate-pulse" style={{animationDelay: "0.3s"}}></span>
              </div>
            </div>
          ) : isOffline ? (
            <div className="text-slate-600 text-2xl">💤</div>
          ) : (
            <div className="text-slate-500 text-2xl">🖼️</div>
          )}
        </div>
        {/* 显示器支架 */}
        <div className="w-4 h-2 bg-slate-600 mx-auto mt-1 rounded-b"></div>
      </div>
      
      {/* 桌面和头像 */}
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-2xl shadow-lg ${isWorking ? "ring-2 ring-green-400/50" : ""}`}>
          {agent.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-white truncate">{agent.name}</div>
          <div className="text-xs text-slate-400 truncate">{agent.title}</div>
          <div className="flex items-center gap-1 mt-1">
            <span className={`w-2 h-2 rounded-full ${roleColors[agent.role]}`}></span>
            <span className="text-xs text-slate-500">{agent.role}</span>
          </div>
        </div>
      </div>
      
      {/* 当前任务 */}
      {isWorking && agent.currentTask && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <div className="text-xs text-green-400 mb-1">正在处理:</div>
          <div className="text-sm text-slate-300 truncate">{agent.currentTask}</div>
        </div>
      )}
      
      {/* 任务完成数 */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-slate-500">已完成</span>
        <span className="text-slate-300 font-medium">{agent.tasksCompleted} 个任务</span>
      </div>
    </div>
  );
}

// ============ 主组件 ============
export default function MissionControl() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("办公室");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<TeamAgent | null>(null);
  
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [memorySearch, setMemorySearch] = useState("");
  const [memoryCategoryFilter, setMemoryCategoryFilter] = useState<MemoryCategory | "全部">("全部");
  
  const [formData, setFormData] = useState({
    title: "", description: "", status: "待办" as TaskStatus, assignee: "HOC" as Assignee,
    priority: "中" as Priority, taskType: "普通" as TaskType, scheduledDate: getTodayString(),
    scheduledTime: "", repeatType: "不重复" as RepeatType, cronExpression: "",
  });
  const [memoryFormData, setMemoryFormData] = useState({ title: "", content: "", category: "其他" as MemoryCategory, tags: "" });

  useEffect(() => {
    // 从 API 加载任务
    loadTasksFromAPI().then(apiTasks => {
      if (apiTasks.length > 0) {
        setTasks(apiTasks);
        // 同步到 localStorage
        localStorage.setItem(TASKS_KEY, JSON.stringify(apiTasks));
      } else {
        // API 无数据，从 localStorage 加载
        const t = loadTasks();
        setTasks(t.length === 0 ? initialTasks : t);
        if (t.length === 0) saveTasks(initialTasks);
      }
      setIsLoaded(true);
    });
    
    const m = loadMemories();
    setMemories(m.length === 0 ? initialMemories : m);
    if (m.length === 0) saveMemories(initialMemories);
  }, []);

  useEffect(() => { if (isLoaded) saveTasks(tasks); }, [tasks, isLoaded]);
  useEffect(() => { if (isLoaded) saveMemories(memories); }, [memories, isLoaded]);

  const filteredMemories = useMemo(() => memories.filter(m => {
    const s = memorySearch === "" || m.title.toLowerCase().includes(memorySearch.toLowerCase()) || m.content.toLowerCase().includes(memorySearch.toLowerCase());
    const c = memoryCategoryFilter === "全部" || m.category === memoryCategoryFilter;
    return s && c;
  }), [memories, memorySearch, memoryCategoryFilter]);

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    if (editingTask) setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...formData, updatedAt: Date.now() } : t));
    else setTasks(prev => [{ id: Date.now().toString(), ...formData, createdAt: Date.now(), updatedAt: Date.now() }, ...prev]);
    setIsModalOpen(false);
    setFormData({ title: "", description: "", status: "待办", assignee: "HOC", priority: "中", taskType: "普通", scheduledDate: getTodayString(), scheduledTime: "", repeatType: "不重复", cronExpression: "" });
    setEditingTask(null);
  };

  const handleMemorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoryFormData.title.trim()) return;
    const tags = memoryFormData.tags.split(",").map(t => t.trim()).filter(t => t);
    setMemories(prev => [{ id: Date.now().toString(), ...memoryFormData, tags, createdAt: Date.now(), updatedAt: Date.now() }, ...prev]);
    setIsMemoryModalOpen(false);
    setMemoryFormData({ title: "", content: "", category: "其他", tags: "" });
  };

  const renderCalendar = () => {
    const days = [];
    for (let i = 0; i < getFirstDayOfMonth(currentYear, currentMonth); i++) days.push(<div key={`e${i}`} className="h-12 bg-slate-800/30 rounded" />);
    for (let d = 1; d <= getDaysInMonth(currentYear, currentMonth); d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push(<div key={d} className="h-12 bg-slate-800/50 rounded p-1 text-slate-400 text-xs">{d}</div>);
    }
    return days;
  };

  if (!isLoaded) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xl">加载中...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">🚀 Mission Control</h1>
            <p className="text-slate-400">{tasks.length} 任务 · {memories.length} 记忆 · {teamMembers.length} 成员</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-700 rounded-lg p-1">
              {(["办公室", "看板", "日历", "记忆", "团队"] as ViewMode[]).map(m => (
                <button key={m} onClick={() => setViewMode(m)}
                  className={`px-3 py-2 rounded text-sm font-medium transition ${viewMode === m ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>
                  {m === "办公室" && "🏢 "}{m === "看板" && "📋 "}{m === "日历" && "📅 "}{m === "记忆" && "🧠 "}{m === "团队" && "👥 "}{m}
                </button>
              ))}
            </div>
            {viewMode !== "团队" && viewMode !== "办公室" && (
              <button onClick={() => viewMode === "记忆" ? setIsMemoryModalOpen(true) : setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                + {viewMode === "记忆" ? "新建记忆" : "新建任务"}
              </button>
            )}
          </div>
        </div>

        {/* ============ 办公室视图 ============ */}
        {viewMode === "办公室" && (
          <div className="space-y-6">
            {/* 办公室标题栏 */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🏢</div>
                <div>
                  <h2 className="text-xl font-bold text-white">数字办公室</h2>
                  <p className="text-slate-400 text-sm">实时查看团队成员工作状态</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-slate-400 text-sm">工作中: {teamMembers.filter(a => a.status === "工作中").length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="text-slate-400 text-sm">空闲: {teamMembers.filter(a => a.status === "空闲").length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                  <span className="text-slate-400 text-sm">离线: {teamMembers.filter(a => a.status === "离线").length}</span>
                </div>
              </div>
            </div>

            {/* 办公区域 - 按角色分组 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 指挥中心 */}
              <div className="lg:col-span-3">
                <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-500/30">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-indigo-400">🎯</span>
                    <h3 className="text-lg font-semibold text-indigo-300">指挥中心</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {teamMembers.filter(a => a.role === "指挥").map(agent => (
                      <DeskCard key={agent.id} agent={agent} onClick={() => setSelectedAgent(agent)} />
                    ))}
                  </div>
                </div>
              </div>

              {/* 开发区 */}
              <div>
                <div className="bg-green-900/30 rounded-xl p-4 border border-green-500/30 h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-green-400">💻</span>
                    <h3 className="text-lg font-semibold text-green-300">开发区</h3>
                  </div>
                  <div className="space-y-4">
                    {teamMembers.filter(a => a.role === "开发").map(agent => (
                      <DeskCard key={agent.id} agent={agent} onClick={() => setSelectedAgent(agent)} />
                    ))}
                  </div>
                </div>
              </div>

              {/* 写作区 */}
              <div>
                <div className="bg-pink-900/30 rounded-xl p-4 border border-pink-500/30 h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-pink-400">✍️</span>
                    <h3 className="text-lg font-semibold text-pink-300">写作区</h3>
                  </div>
                  <div className="space-y-4">
                    {teamMembers.filter(a => a.role === "写作").map(agent => (
                      <DeskCard key={agent.id} agent={agent} onClick={() => setSelectedAgent(agent)} />
                    ))}
                  </div>
                </div>
              </div>

              {/* 设计区 */}
              <div>
                <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/30 h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-purple-400">🎨</span>
                    <h3 className="text-lg font-semibold text-purple-300">设计区</h3>
                  </div>
                  <div className="space-y-4">
                    {teamMembers.filter(a => a.role === "设计").map(agent => (
                      <DeskCard key={agent.id} agent={agent} onClick={() => setSelectedAgent(agent)} />
                    ))}
                  </div>
                </div>
              </div>

              {/* 研究区 */}
              <div>
                <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/30 h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-blue-400">🔍</span>
                    <h3 className="text-lg font-semibold text-blue-300">研究区</h3>
                  </div>
                  <div className="space-y-4">
                    {teamMembers.filter(a => a.role === "研究").map(agent => (
                      <DeskCard key={agent.id} agent={agent} onClick={() => setSelectedAgent(agent)} />
                    ))}
                  </div>
                </div>
              </div>

              {/* 运营区 */}
              <div>
                <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-500/30 h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-amber-400">📋</span>
                    <h3 className="text-lg font-semibold text-amber-300">运营区</h3>
                  </div>
                  <div className="space-y-4">
                    {teamMembers.filter(a => a.role === "运营").map(agent => (
                      <DeskCard key={agent.id} agent={agent} onClick={() => setSelectedAgent(agent)} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============ 看板视图 ============ */}
        {viewMode === "看板" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {["待办", "进行中", "已完成", "已取消"].map(status => (
              <div key={status} className="bg-slate-800/50 rounded-lg p-4">
                <h3 className={`${statusColors[status as TaskStatus]} px-3 py-2 rounded font-semibold mb-3`}>{status} ({tasks.filter(t => t.status === status).length})</h3>
                <div className="space-y-2">
                  {tasks.filter(t => t.status === status).map(t => (
                    <div key={t.id} onClick={() => { setEditingTask(t); setFormData({...t, scheduledDate: t.scheduledDate || getTodayString(), scheduledTime: t.scheduledTime || "", cronExpression: t.cronExpression || ""}); setIsModalOpen(true); }}
                      className="bg-slate-700/80 rounded-lg p-3 cursor-pointer hover:bg-slate-700">
                      <div className="text-white text-sm">{t.title}</div>
                      <div className="flex gap-1 mt-2">
                        <span className={`${taskTypeColors[t.taskType]} px-1.5 py-0.5 rounded text-xs`}>{t.taskType}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============ 日历视图 ============ */}
        {viewMode === "日历" && (
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => currentMonth === 0 ? (setCurrentMonth(11), setCurrentYear(currentYear - 1)) : setCurrentMonth(currentMonth - 1)} className="text-slate-400 hover:text-white px-3">←</button>
              <h2 className="text-xl text-white">{currentYear}年 {["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"][currentMonth]}</h2>
              <button onClick={() => currentMonth === 11 ? (setCurrentMonth(0), setCurrentYear(currentYear + 1)) : setCurrentMonth(currentMonth + 1)} className="text-slate-400 hover:text-white px-3">→</button>
            </div>
            <div className="grid grid-cols-7 gap-2">{["日","一","二","三","四","五","六"].map(d => <div key={d} className="text-center text-slate-400 text-sm py-2">{d}</div>)}{renderCalendar()}</div>
          </div>
        )}

        {/* ============ 记忆视图 ============ */}
        {viewMode === "记忆" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <input type="text" value={memorySearch} onChange={e => setMemorySearch(e.target.value)} placeholder="🔍 搜索..." className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600" />
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setMemoryCategoryFilter("全部")} className={`px-2 py-1 rounded text-xs ${memoryCategoryFilter === "全部" ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-400"}`}>全部</button>
                {(Object.keys(categoryColors) as MemoryCategory[]).map(c => (
                  <button key={c} onClick={() => setMemoryCategoryFilter(c)} className={`px-2 py-1 rounded text-xs ${memoryCategoryFilter === c ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-400"}`}>{categoryIcons[c]} {c}</button>
                ))}
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 max-h-[50vh] overflow-y-auto space-y-2">
                {filteredMemories.map(m => (
                  <div key={m.id} onClick={() => setSelectedMemory(m)} className={`p-3 rounded cursor-pointer ${selectedMemory?.id === m.id ? "bg-indigo-600/30 border border-indigo-500" : "bg-slate-700/50 hover:bg-slate-700"}`}>
                    <span className="text-white text-sm">{categoryIcons[m.category]} {m.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2 bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              {selectedMemory ? (
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">{categoryIcons[selectedMemory.category]} {selectedMemory.title}</h2>
                  <div className="text-slate-300 whitespace-pre-wrap">{selectedMemory.content}</div>
                </div>
              ) : <div className="text-center text-slate-500 py-20">选择一条记忆查看</div>}
            </div>
          </div>
        )}

        {/* ============ 团队视图 ============ */}
        {viewMode === "团队" && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {teamMembers.map(agent => (
              <div key={agent.id} className={`bg-gradient-to-br ${agent.color} rounded-xl p-1`}>
                <div className="bg-slate-900/90 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{agent.emoji}</span>
                    <div>
                      <div className="font-bold text-white">{agent.name}</div>
                      <div className="text-xs text-slate-400">{agent.title}</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-400">{agent.description}</div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${agent.status === "工作中" ? "bg-green-500" : agent.status === "离线" ? "bg-gray-500" : "bg-yellow-500"}`}></span>
                    <span className="text-xs text-slate-400">{agent.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">{editingTask ? "编辑任务" : "新建任务"}</h2>
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="任务标题" className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600" required />
              <div className="grid grid-cols-2 gap-4">
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as TaskStatus})} className="bg-slate-700 text-white rounded-lg px-3 py-2">
                  <option value="待办">待办</option><option value="进行中">进行中</option><option value="已完成">已完成</option><option value="已取消">已取消</option>
                </select>
                <select value={formData.assignee} onChange={e => setFormData({...formData, assignee: e.target.value as Assignee})} className="bg-slate-700 text-white rounded-lg px-3 py-2">
                  <option value="HOC">HOC</option><option value="主人">主人</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-600 text-white py-2 rounded-lg">取消</button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg">{editingTask ? "更新" : "创建"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isMemoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsMemoryModalOpen(false)}>
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-slate-700" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">新建记忆</h2>
            <form onSubmit={handleMemorySubmit} className="space-y-4">
              <input type="text" value={memoryFormData.title} onChange={e => setMemoryFormData({...memoryFormData, title: e.target.value})} placeholder="记忆标题" className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600" required />
              <textarea value={memoryFormData.content} onChange={e => setMemoryFormData({...memoryFormData, content: e.target.value})} placeholder="记忆内容" rows={6} className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600" required />
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsMemoryModalOpen(false)} className="flex-1 bg-slate-600 text-white py-2 rounded-lg">取消</button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg">创建</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
