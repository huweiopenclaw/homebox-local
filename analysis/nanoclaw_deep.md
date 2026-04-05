# NanoClaw — Deep Analysis (Phase 3)

## Project Overview
- **Name**: nanoclaw
- **Language**: TypeScript (Node.js)
- **LOC**: ~3,000 lines across `src/` (moderate)
- **Dependencies**: grammy, @onecli-sh/sdk, SQLite3, Docker/container runtime
- **Purpose**: Container-based Claude Code agent with Telegram/Discord channel support

## Architecture
Multi-file TypeScript project with container-based execution:

### 1. Container Runner (`container-runner.ts`)
- Spawns Docker/Podman containers for each agent execution
- Each container runs `agent-runner` (a small Node.js app inside the container)
- **Not sub-agent coordination** — containers are isolated execution environments, not coordinated agents

### 2. Task Scheduler (`task-scheduler.ts`)
- Cron-based task scheduling (one-time and recurring tasks)
- Tasks run sequentially in containers, not in parallel as coordinated agents
- No inter-task communication or delegation

### 3. Channel System
- Multiple channel adapters (Telegram, Discord, etc.)
- Messages routed to container-based agent execution
- No agent-to-agent messaging

### 4. Group System
- `group-folder.ts`, `group-queue.ts` — manage per-group state and message queuing
- Groups are isolated silos, not coordinated agents

## Sub-Agent Analysis
**No sub-agent system exists.** While nanoclaw uses container-based execution for isolation and security:
- Containers are **sandboxed execution environments**, not coordinated agents
- No `agent_spawn`, `agent_send`, `delegate`, or equivalent tools in the core `src/` directory
- Task scheduling is **cron-based**, not agent-driven delegation
- No agent registry, no inter-agent communication protocol
- The `.claude/skills/add-parallel` and similar skills are optional plugins, not core sub-agent features

## Classification
**A. None/Single-agent** — Confirmed. Container-based execution provides isolation, not multi-agent coordination.
