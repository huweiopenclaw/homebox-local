@echo off
REM Setup PM2 for Mission Control
REM This script sets up PM2 to manage the task board and start on boot

echo ========================================
echo   Mission Control PM2 Setup
echo ========================================
echo.

REM Check if PM2 is installed
where pm2 >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing PM2 globally...
    call npm install -g pm2
)

REM Navigate to task board directory
cd /d "%~dp0projects\task-board"

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing task board dependencies...
    call npm install
)

REM Start with PM2
echo Starting Mission Control with PM2...
call pm2 start ecosystem.config.js

REM Save PM2 process list
call pm2 save

REM Setup PM2 startup for Windows
echo.
echo Setting up PM2 startup...
call pm2-startup install

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo   Mission Control is now managed by PM2.
echo   It will start automatically on Windows boot.
echo.
echo   Commands:
echo     pm2 status          - Check status
echo     pm2 logs mission-control - View logs
echo     pm2 restart mission-control - Restart
echo     pm2 stop mission-control     - Stop
echo.
pause
