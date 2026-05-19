@echo off
REM Firebase deployment script for Windows

setlocal enabledelayedexpansion

echo.
echo ========================================
echo  Alcura Firebase Deployment
echo ========================================
echo.

REM Check if firebase-config.json exists
if not exist "firebase-config.json" (
    echo ERROR: firebase-config.json not found!
    echo This file is required for deployment.
    exit /b 1
)

REM Set environment variable
set "GOOGLE_APPLICATION_CREDENTIALS=%CD%\firebase-config.json"
echo [+] Environment: GOOGLE_APPLICATION_CREDENTIALS set

REM Install dependencies if needed
if not exist "node_modules" (
    echo [*] Installing dependencies...
    call npm install
    if !errorlevel! neq 0 (
        echo ERROR: npm install failed
        exit /b 1
    )
)

REM Run setup check
echo [*] Checking setup...
call node scripts/check-setup.js
if !errorlevel! neq 0 (
    echo ERROR: Setup check failed
    exit /b 1
)

REM Deploy
echo.
echo [*] Deploying to Firebase...
echo     Project: alcura-id
echo.

call npx firebase-tools deploy
if !errorlevel! neq 0 (
    echo ERROR: Deployment failed
    exit /b 1
)

echo.
echo ========================================
echo  Deployment Complete!
echo ========================================
echo.
echo Live at: https://alcura-id.web.app
echo.
pause
