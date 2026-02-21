@echo off
REM Mission Control Task Board Startup Script
REM This script is placed in Windows Startup folder to auto-start with Windows

cd /d "C:\Users\1990h\.openclaw\workspace\projects\task-board"

REM Wait 10 seconds for network to be ready
timeout /t 10 /nobreak > nul

REM Start the server
start "" /min cmd /c "npm run dev"
