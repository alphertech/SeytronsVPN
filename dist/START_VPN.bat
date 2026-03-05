@echo off
echo ====================================
echo SEYTRONS VPN - LAUNCHER
echo ====================================
echo.

echo [1/3] Starting VPN backend...
start "" "%~dp0SEYTRONS-Backend.exe"
timeout /t 3 /nobreak >nul

echo [2/3] Opening web interface...
start "" "http://localhost:5000"
timeout /t 2 /nobreak >nul

echo [3/3] SEYTRONS VPN is running!
echo.
echo Your browser should open automatically.
echo If not, go to: http://localhost:5000
echo.
echo Close this window to stop the VPN.
echo.
pause
