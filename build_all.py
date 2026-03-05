"""
SEYTRONS VPN - COMPLETE BUILD SYSTEM
Builds for Windows, Android, and iOS in one command
"""

import os
import sys
import subprocess
import platform
import zipfile
import shutil

def print_header(text):
    print("\n" + "=" * 60)
    print(f" {text}")
    print("=" * 60)

def check_python():
    print_header("CHECKING PYTHON")
    print(f"Python: {sys.executable}")
    print(f"Version: {sys.version}")

def install_requirements():
    print_header("INSTALLING REQUIREMENTS")
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

def build_desktop():
    print_header("BUILDING DESKTOP APP (Windows)")
    
    # Check if build_desktop.py exists
    if os.path.exists("build_desktop.py"):
        subprocess.run([sys.executable, "build_desktop.py"])
    else:
        print("⚠️ build_desktop.py not found - skipping desktop build")

def setup_mobile():
    print_header("SETTING UP MOBILE (Android & iOS)")
    
    # Check Node.js
    try:
        subprocess.run(["node", "--version"], check=True, capture_output=True)
        has_node = True
    except:
        has_node = False
        print("❌ Node.js not found - skipping mobile build")
        print("Download from: https://nodejs.org")
        return
    
    if has_node and os.path.exists("build_mobile.py"):
        subprocess.run([sys.executable, "build_mobile.py"])
    else:
        print("⚠️ build_mobile.py not found - skipping mobile build")

def create_distribution():
    print_header("CREATING DISTRIBUTION PACKAGE")
    
    # Create release folder
    release_folder = "SEYTRONS_Release"
    os.makedirs(release_folder, exist_ok=True)
    
    # Copy desktop build
    if os.path.exists("dist"):
        shutil.copytree("dist", os.path.join(release_folder, "Windows"), dirs_exist_ok=True)
        print("✓ Windows build copied")
    
    # Copy Android build
    android_apk = "android/app/build/outputs/apk/release/app-release.apk"
    if os.path.exists(android_apk):
        os.makedirs(os.path.join(release_folder, "Android"), exist_ok=True)
        shutil.copy2(android_apk, os.path.join(release_folder, "Android", "SEYTRONS_VPN.apk"))
        print("✓ Android APK copied")
    
    # Copy iOS build (if exists)
    if platform.system() == "Darwin" and os.path.exists("ios"):
        print("✓ iOS project available (requires Xcode to build IPA)")
    
    # Create ZIP
    print("\nCreating ZIP archive...")
    with zipfile.ZipFile("SEYTRONS_Complete.zip", "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(release_folder):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, release_folder)
                zipf.write(file_path, arcname)
    
    print(f"✓ Created SEYTRONS_Complete.zip")

def print_next_steps():
    print_header("✅ BUILD COMPLETE - NEXT STEPS")
    
    print("\n📦 YOUR FILES ARE READY:")
    print("   • SEYTRONS_Complete.zip - All platforms")
    print("   • SEYTRONS_Release/ - Unpacked files")
    print("   • dist/ - Windows standalone")
    print("   • android/ - Android project")
    print("   • ios/ - iOS project (Mac only)")
    
    print("\n💰 TO START SELLING:")
    print("1. Go to https://gumroad.com")
    print("2. Create free account")
    print("3. Upload SEYTRONS_VPN_Setup.exe")
    print("4. Set price: $19.99")
    print("5. Share your link!")
    
    print("\n📱 TO PUBLISH ON APP STORES:")
    print("Android (Google Play):")
    print("  - Open Android Studio")
    print("  - Build → Generate Signed Bundle")
    print("  - Upload to Play Console")
    
    print("\niOS (App Store):")
    print("  - Open Xcode on Mac")
    print("  - Product → Archive")
    print("  - Upload to App Store Connect")

def main():
    print("=" * 70)
    print("  SEYTRONS VPN - COMPLETE BUILD SYSTEM")
    print("  Builds for Windows, Android, and iOS")
    print("=" * 70)
    
    # Ask what to build
    print("\nWhat would you like to build?")
    print("1. Everything (Windows + Android + iOS)")
    print("2. Desktop only (Windows .exe)")
    print("3. Mobile only (Android + iOS)")
    print("4. Just prepare files (no build)")
    
    choice = input("\nEnter choice (1-4): ").strip()
    
    if choice == "1":
        check_python()
        install_requirements()
        build_desktop()
        setup_mobile()
        create_distribution()
        print_next_steps()
        
    elif choice == "2":
        check_python()
        install_requirements()
        build_desktop()
        print("\n✅ Desktop build complete! Check 'dist' folder")
        
    elif choice == "3":
        setup_mobile()
        print("\n✅ Mobile setup complete! Check 'android' and 'ios' folders")
        
    elif choice == "4":
        create_distribution()
        print("\n✅ Files prepared in 'SEYTRONS_Release' folder")
        
    else:
        print("❌ Invalid choice")

if __name__ == "__main__":
    main()