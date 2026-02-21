@echo off
REM OpenClaw + Mission Control Combined Startup Script
REM This script starts both OpenClaw Gateway and Task Board

echo ========================================
echo   Starting OpenClaw System
echo ========================================
echo.

REM Start Task Board in background
echo [1/2] Starting Mission Control Task Board...
cd /d "%~dp0projects\task-board"
if not exist "node_modules" (
    echo Installing task board dependencies...
    call npm install
)
start "Mission Control" cmd /c "npm run dev"
echo Task Board starting on http://localhost:3000
echo.

REM Wait a moment for task board to start
timeout /t 3 /nobreak > nul

REM Start OpenClaw Gateway
echo [2/2] Starting OpenClaw Gateway...
cd /d "%~dp0"
start "OpenClaw Gateway" cmd /c "openclaw gateway start"
echo.

echo ========================================
echo   System Started!
echo ========================================
echo.
echo   Task Board:  http://localhost:3000
echo   Gateway API: http://localhost:18789
echo.
echo   Close this window to keep services running.
echo   Use 'openclaw gateway stop' to stop gateway.
echo.
pause
