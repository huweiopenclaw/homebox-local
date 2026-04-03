@echo off
REM Mission Control Task Board Startup Script
REM This script starts the task board server

cd /d "%~dp0"

echo Starting Mission Control Task Board...

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Start the server
echo Starting Next.js server on http://localhost:3000
start "" cmd /c "npm run dev"

echo Task Board started!
echo Visit http://localhost:3000 to view the board.
