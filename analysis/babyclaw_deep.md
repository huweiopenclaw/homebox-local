# BabyClaw — Deep Analysis (Phase 3)

## Project Overview
- **Name**: babyclaw
- **Language**: JavaScript (Node.js, ES Modules)
- **LOC**: ~400 lines (single file: `index.js`)
- **Dependencies**: `@anthropic-ai/claude-agent-sdk`, `grammy` (Telegram bot framework)
- **Purpose**: Lightweight Telegram bot that wraps Claude Code for VPS deployment

## Architecture
Single-file Telegram bot (`index.js`) with the following components:

### 1. Message Handling
- Grammy-based Telegram bot polling for messages
- Simple message queue (`messageQueue[]`) for follow-up messages while Claude is busy
- No multi-agent orchestration — single linear processing pipeline

### 2. Claude Integration
- Uses `@anthropic-ai/claude-agent-sdk`'s `query()` async generator
- Single session at a time, persisted to `state.json`
- Session resume via `options.resume = sessionId`
- Model switching, thinking toggle — all single-agent features

### 3. Memory System
- File-based conversation history in `~/workspace/history/`
- Rolling `recent.md` (last 50 entries) loaded into every session
- Mood log and thread tracking — passive file writes, no agent coordination
- No inter-agent memory sharing

### 4. Media Handling
- Photo download and forwarding to Claude
- Voice transcription via OpenAI Whisper API
- File delivery via `[SEND_IMAGE: path]` and `[SEND_FILE: path]` markers

### 5. Cron Jobs
- External shell scripts (not agent-coordinated): pattern detector, skills suggester, personality updater, daily digest
- These are OS cron jobs, not agent-driven tasks

## Sub-Agent Analysis
**No sub-agent system exists.** The entire codebase is a single process:
- One bot instance handles one user
- One Claude session at a time
- Message queue is a simple array with `drainQueue()` — not agent delegation
- No `agent_spawn`, `agent_send`, `subagent`, or equivalent concepts
- No tool delegation to other agents
- No agent registry or supervisor

## Classification
**A. None/Single-agent** — Confirmed. The project is a straightforward Telegram → Claude Code wrapper with no multi-agent capabilities whatsoever.
