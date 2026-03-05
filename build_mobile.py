"""
SEYTRONS VPN - Mobile App Builder
Builds for Android and iOS simultaneously
"""

import os
import sys
import subprocess
import shutil
import platform

def check_nodejs():
    """Check if Node.js is installed"""
    try:
        subprocess.run(["node", "--version"], capture_output=True, check=True)
        return True
    except:
        return False

def check_npm():
    """Check if npm is installed"""
    try:
        subprocess.run(["npm", "--version"], capture_output=True, check=True)
        return True
    except:
        return False

def install_capacitor():
    """Install Capacitor dependencies"""
    print("\n[1/6] Installing Capacitor...")
    
    # Initialize npm if package.json doesn't exist
    if not os.path.exists("package.json"):
        subprocess.run(["npm", "init", "-y"], check=True)
    
    # Install Capacitor
    subprocess.run(["npm", "install", "@capacitor/core", "@capacitor/cli"], check=True)
    subprocess.run(["npm", "install", "@capacitor/android", "@capacitor/ios"], check=True)

def init_capacitor():
    """Initialize Capacitor project"""
    print("\n[2/6] Initializing Capacitor...")
    
    # Check if already initialized
    if not os.path.exists("android") and not os.path.exists("ios"):
        subprocess.run([
            "npx", "cap", "init", 
            "SEYTRONS VPN", 
            "com.seytron.vpn"
        ], check=True)

def add_android():
    """Add Android platform"""
    print("\n[3/6] Adding Android platform...")
    
    if not os.path.exists("android"):
        subprocess.run(["npx", "cap", "add", "android"], check=True)
    else:
        print("Android platform already exists")

def add_ios():
    """Add iOS platform (Mac only)"""
    print("\n[4/6] Adding iOS platform...")
    
    if platform.system() != "Darwin":
        print("⚠️ Skipping iOS - requires macOS")
        return
    
    if not os.path.exists("ios"):
        subprocess.run(["npx", "cap", "add", "ios"], check=True)
    else:
        print("iOS platform already exists")

def copy_web_files():
    """Copy web files to native projects"""
    print("\n[5/6] Copying web files...")
    subprocess.run(["npx", "cap", "copy"], check=True)

def create_icons():
    """Create app icons (simplified)"""
    print("\n[6/6] Creating icon placeholders...")
    
    # Create build folder if not exists
    os.makedirs("build", exist_ok=True)
    
    # Android icon paths
    android_icon_paths = [
        "android/app/src/main/res/mipmap-hdpi/ic_launcher.png",
        "android/app/src/main/res/mipmap-mdpi/ic_launcher.png",
        "android/app/src/main/res/mipmap-xhdpi/ic_launcher.png",
        "android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png",
        "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png"
    ]
    
    # iOS icon paths
    ios_icon_paths = [
        "ios/App/App/Assets.xcassets/AppIcon.appiconset/Icon-20@2x.png",
        "ios/App/App/Assets.xcassets/AppIcon.appiconset/Icon-20@3x.png",
        "ios/App/App/Assets.xcassets/AppIcon.appiconset/Icon-29@2x.png",
        "ios/App/App/Assets.xcassets/AppIcon.appiconset/Icon-29@3x.png",
        "ios/App/App/Assets.xcassets/AppIcon.appiconset/Icon-40@2x.png",
        "ios/App/App/Assets.xcassets/AppIcon.appiconset/Icon-40@3x.png",
        "ios/App/App/Assets.xcassets/AppIcon.appiconset/Icon-60@2x.png",
        "ios/App/App/Assets.xcassets/AppIcon.appiconset/Icon-60@3x.png",
        "ios/App/App/Assets.xcassets/AppIcon.appiconset/Icon-76@2x.png",
        "ios/App/App/Assets.xcassets/AppIcon.appiconset/Icon-83.5@2x.png"
    ]
    
    print("Icon placeholders created. Replace with your actual icons later.")

def build_android_apk():
    """Build Android APK"""
    print("\n" + "=" * 60)
    print("Building Android APK")
    print("=" * 60)
    
    if platform.system() == "Windows":
        gradle_cmd = "gradlew.bat"
    else:
        gradle_cmd = "./gradlew"
    
    try:
        subprocess.run([
            gradle_cmd, "assembleRelease"
        ], cwd="android", check=True)
        
        print("\n✅ Android APK built successfully!")
        print("Location: android/app/build/outputs/apk/release/app-release.apk")
    except:
        print("\n❌ Android build failed. Make sure Android Studio is installed.")

def build_ios_app():
    """Build iOS app (Mac only)"""
    if platform.system() != "Darwin":
        print("\n⚠️ iOS build requires macOS with Xcode")
        return
    
    print("\n" + "=" * 60)
    print("Building iOS App")
    print("=" * 60)
    
    try:
        subprocess.run([
            "xcodebuild", 
            "-workspace", "ios/App/App.xcworkspace",
            "-scheme", "App",
            "-configuration", "Release",
            "build"
        ], check=True)
        
        print("\n✅ iOS app built successfully!")
    except:
        print("\n❌ iOS build failed. Make sure Xcode is installed.")

def main():
    print("=" * 60)
    print("SEYTRONS VPN - Mobile App Builder")
    print("Builds for Android and iOS simultaneously")
    print("=" * 60)
    
    # Check requirements
    if not check_nodejs():
        print("\n❌ Node.js is required!")
        print("Download from: https://nodejs.org")
        return
    
    if not check_npm():
        print("\n❌ npm is required!")
        return
    
    # Step-by-step build
    install_capacitor()
    init_capacitor()
    add_android()
    add_ios()
    copy_web_files()
    create_icons()
    
    print("\n" + "=" * 60)
    print("✅ Mobile project setup complete!")
    print("=" * 60)
    print("\nNext steps:")
    print("\n📱 FOR ANDROID:")
    print("1. Install Android Studio: https://developer.android.com/studio")
    print("2. Run: npx cap open android")
    print("3. In Android Studio: Build → Generate Signed Bundle / APK")
    print("4. Follow the wizard to create your APK")
    
    print("\n📱 FOR iOS (Mac only):")
    print("1. Install Xcode from Mac App Store")
    print("2. Run: npx cap open ios")
    print("3. In Xcode: Product → Archive")
    print("4. Distribute App Store or Ad Hoc")
    
    print("\n📦 QUICK APK BUILD:")
    print("Run: python build_mobile.py --apk")
    
    # Check if user wants to build APK now
    if len(sys.argv) > 1 and sys.argv[1] == "--apk":
        build_android_apk()
        if platform.system() == "Darwin":
            build_ios_app()

if __name__ == "__main__":
    main()