@echo off
echo ==========================================
echo Blockchain Medical Records - Setup
echo ==========================================

cd /d "%~dp0"

echo.
echo Installing blockchain dependencies...
cd blockchain
call npm install

echo.
echo Installing backend dependencies...
cd ..\backend
call npm install

echo.
echo ==========================================
echo Setup complete.
echo ==========================================
pause
