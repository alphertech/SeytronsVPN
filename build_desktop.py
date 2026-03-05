"""
SEYTRONS VPN - Desktop Build Script
Run this to create a standalone .exe file
"""

import os
import sys
import subprocess
import shutil

def create_desktop_app():
    print("=" * 60)
    print("SEYTRONS VPN - Desktop App Builder")
    print("=" * 60)
    
    # Step 1: Check if we're in the right directory
    current_dir = os.getcwd()
    print(f"\n[1/5] Working directory: {current_dir}")
    
    # Step 2: Install requirements
    print("\n[2/5] Installing requirements...")
    subprocess.run([sys.executable, "-m", "pip", "install", "pyinstaller"])
    
    # Step 3: Create backend executable
    print("\n[3/5] Building backend executable...")
    
    # Check if server/app.py exists
    if not os.path.exists("server/app.py"):
        print("❌ ERROR: server/app.py not found!")
        print("Make sure you're in the correct directory")
        return
    
    subprocess.run([
        sys.executable,
        "-m", "PyInstaller",
        "--onefile",
        "--name", "SEYTRONS-Backend",
        "--hidden-import", "flask",
        "--hidden-import", "flask_cors",
        "--hidden-import", "cryptography",
        "--hidden-import", "psutil",
        "--hidden-import", "ping3",
        "server/app.py"
    ])
    
    # Step 4: Create launcher script
    print("\n[4/5] Creating launcher...")
    os.makedirs("dist", exist_ok=True)
    
    launcher_code = '''@echo off
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
'''
    with open("dist/START_VPN.bat", "w") as f:
        f.write(launcher_code)
    
    # Step 5: Copy web files
    print("\n[5/5] Copying web files...")
    os.makedirs("dist/web", exist_ok=True)
    
    # Files and folders to copy
    items_to_copy = [
        "index.html",
        "framing",
        "engines",
        "server"
    ]
    
    for item in items_to_copy:
        source = item
        dest = os.path.join("dist", item)
        
        if os.path.isfile(source):
            print(f"  Copying file: {source}")
            shutil.copy2(source, dest)
        elif os.path.isdir(source):
            print(f"  Copying folder: {source}")
            if os.path.exists(dest):
                shutil.rmtree(dest)
            shutil.copytree(source, dest)
    
    # Step 6: Create README
    print("\nCreating README...")
    readme = '''====================================
SEYTRONS VPN - INSTALLATION GUIDE
====================================

QUICK START:
1. Double-click "START_VPN.bat"
2. Your browser will open automatically
3. Click the power button to connect
4. Done!

FILES INCLUDED:
- SEYTRONS-Backend.exe  (VPN engine)
- START_VPN.bat         (Launcher)
- web/                  (User interface)

TROUBLESHOOTING:
- If browser doesn't open, go to: http://localhost:5000
- If you see security warning, click "More info" then "Run anyway"
- Run as Administrator if you have issues

SYSTEM REQUIREMENTS:
- Windows 10 or 11
- 4GB RAM minimum
- Internet connection

SUPPORT:
Email: support@seytron.com
Web: https://seytron.com

Thank you for choosing SEYTRONS VPN!
'''
    with open("dist/README.txt", "w") as f:
        f.write(readme)
    
    print("\n" + "=" * 60)
    print("✅ BUILD COMPLETE!")
    print("=" * 60)
    print("\nYour app is in the 'dist' folder:")
    print("  📁 dist/")
    print("     ├── SEYTRONS-Backend.exe")
    print("     ├── START_VPN.bat")
    print("     ├── README.txt")
    print("     └── web/")
    print("\nTo test:")
    print("1. Open the 'dist' folder")
    print("2. Double-click START_VPN.bat")
    print("3. Your browser will open")
    print("\nTo distribute:")
    print("- ZIP the entire 'dist' folder")
    print("- Or create installer with NSIS")

if __name__ == "__main__":
    create_desktop_app()