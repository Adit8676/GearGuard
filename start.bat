@echo off
echo Starting GearGuard Development Environment...
echo.

echo Starting Backend...
start "GearGuard Backend" cmd /k "cd backend && npm run dev"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend...
start "GearGuard Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both services are starting...
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3000
echo.
pause