import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const TASKS_FILE = join(process.cwd(), '..', '..', '..', 'memory', 'tasks.json')

export async function GET() {
  try {
    if (!existsSync(TASKS_FILE)) {
      return NextResponse.json({ tasks: [], metadata: { lastUpdated: Date.now(), version: 1 } })
    }
    const data = readFileSync(TASKS_FILE, 'utf-8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    console.error('Error reading tasks:', error)
    return NextResponse.json({ error: 'Failed to read tasks' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    let currentData = { tasks: [], metadata: { lastUpdated: Date.now(), version: 1 } }
    if (existsSync(TASKS_FILE)) {
      currentData = JSON.parse(readFileSync(TASKS_FILE, 'utf-8'))
    }
    
    if (body.action === 'add') {
      const newTask = {
        id: `task-${Date.now()}`,
        ...body.task,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      currentData.tasks.push(newTask)
    } else if (body.action === 'update') {
      const index = currentData.tasks.findIndex((t: any) => t.id === body.task.id)
      if (index !== -1) {
        currentData.tasks[index] = {
          ...currentData.tasks[index],
          ...body.task,
          updatedAt: Date.now()
        }
      }
    } else if (body.action === 'delete') {
      currentData.tasks = currentData.tasks.filter((t: any) => t.id !== body.taskId)
    } else if (body.action === 'sync') {
      // 完全替换任务列表
      currentData = {
        tasks: body.tasks,
        metadata: {
          lastUpdated: Date.now(),
          version: 1
        }
      }
    }
    
    currentData.metadata.lastUpdated = Date.now()
    writeFileSync(TASKS_FILE, JSON.stringify(currentData, null, 2))
    
    return NextResponse.json(currentData)
  } catch (error) {
    console.error('Error writing tasks:', error)
    return NextResponse.json({ error: 'Failed to write tasks' }, { status: 500 })
  }
}
