@echo off
echo ========================================
echo Building ToolVideo V2 Application
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Check if electron-builder is installed
call npm list electron-builder >nul 2>&1
if errorlevel 1 (
    echo Installing electron-builder...
    call npm install --save-dev electron-builder
    echo.
)

echo Building application for Windows...
echo.

REM Optional: Clear electron-builder cache if needed (uncomment next 2 lines)
REM echo Clearing electron-builder cache...
REM rmdir /s /q "%LOCALAPPDATA%\electron-builder\Cache\winCodeSign" 2>nul

REM Build for Windows
call npm run build:win

if errorlevel 1 (
    echo.
    echo ========================================
    echo Build failed!
    echo ========================================
    pause
    exit /b 1
) else (
    echo.
    echo ========================================
    echo Build completed successfully!
    echo Output directory: dist
    echo ========================================
    pause
)

