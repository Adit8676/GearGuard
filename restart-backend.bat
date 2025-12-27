@echo off
echo Restarting GearGuard Backend Server...
cd /d "c:\Users\adity\Desktop\Odoo\GearGuard\backend"
echo Killing existing Node processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul
echo Starting backend server...
start "GearGuard Backend" cmd /k "npm start"
echo Backend server restarted!
pause