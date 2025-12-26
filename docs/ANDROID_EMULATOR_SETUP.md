# Running PrabhavAI on Android Emulator (Mac)

**Last Updated:** December 25, 2024
**Platform:** macOS (Apple Silicon / M1/M2/M3)

---

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Java 17** (OpenJDK)
- **Android SDK Command Line Tools**

If you don't have Java and Android SDK, install them via Homebrew:

```bash
# Install Java 17
brew install openjdk@17

# Install Android Command Line Tools
brew install --cask android-commandlinetools
```

---

## Step 1: Configure Environment Variables

Add the following to your shell profile (`~/.zshrc` for Zsh or `~/.bash_profile` for Bash):

```bash
# Java Home
export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"

# Android SDK
export ANDROID_HOME="/opt/homebrew/share/android-commandlinetools"

# Add tools to PATH
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH"
```

Reload your shell configuration:

```bash
source ~/.zshrc
# or
source ~/.bash_profile
```

Verify the setup:

```bash
java -version          # Should show Java 17
sdkmanager --version   # Should show SDK Manager version
```

---

## Step 2: Install Android SDK Components

### Accept Licenses

```bash
sdkmanager --licenses
```

Type `y` to accept all licenses when prompted.

### Install Required Components

```bash
# Install platform tools, build tools, and platform
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# Install emulator and system image for Apple Silicon Mac
sdkmanager "emulator" "system-images;android-34;google_apis;arm64-v8a"
```

> **Note:** The system image download is approximately 1.5GB and may take several minutes.

---

## Step 3: Create an Android Virtual Device (AVD)

Create a virtual device using the Pixel 7 profile:

```bash
avdmanager create avd \
  -n Pixel_7_API_34 \
  -k "system-images;android-34;google_apis;arm64-v8a" \
  -d "pixel_7"
```

When prompted "Do you wish to create a custom hardware profile?", type `no` and press Enter.

### Verify AVD Creation

```bash
avdmanager list avd
```

You should see `Pixel_7_API_34` in the list.

---

## Step 4: Start the Emulator

### Option A: Command Line

```bash
emulator -avd Pixel_7_API_34
```

### Option B: With Additional Options (Recommended)

```bash
# Start with GPU acceleration and more RAM
emulator -avd Pixel_7_API_34 -gpu host -memory 4096
```

> **Note:** The emulator window will open. Wait for the Android device to fully boot (you'll see the home screen or lock screen).

### Verify Emulator is Running

In a new terminal:

```bash
adb devices
```

You should see something like:
```
List of devices attached
emulator-5554   device
```

---

## Step 5: Run PrabhavAI App

### Navigate to Project Directory

```bash
cd "/Users/gauravsingh/Documents/Gaurav/Facctum/Personal/SG/AI App for Personality Development/PrabhavAI"
```

### Install Dependencies (if not already done)

```bash
npm install --legacy-peer-deps
```

### Start Metro Bundler

Open a terminal and run:

```bash
npm start
```

Keep this terminal running.

### Run on Android Emulator

In a **new terminal** (while Metro is running):

```bash
npm run android
```

This will:
1. Build the debug APK
2. Install it on the emulator
3. Launch the app

---

## Alternative: Install Pre-Built APK

If you already have a built APK, you can install it directly:

```bash
# Install the demo APK
adb install "/Users/gauravsingh/Documents/Gaurav/Facctum/Personal/SG/AI App for Personality Development/PrabhavAI/PrabhavAI-demo.apk"
```

To launch the app after installation:

```bash
adb shell am start -n com.prabhavai/.MainActivity
```

---

## Quick Reference Commands

| Task | Command |
|------|---------|
| Start emulator | `emulator -avd Pixel_7_API_34` |
| List connected devices | `adb devices` |
| Install APK | `adb install <path-to-apk>` |
| Uninstall app | `adb uninstall com.prabhavai` |
| View logs | `adb logcat` |
| Clear app data | `adb shell pm clear com.prabhavai` |
| Take screenshot | `adb exec-out screencap -p > screenshot.png` |
| Restart ADB | `adb kill-server && adb start-server` |

---

## Troubleshooting

### Emulator Won't Start

1. **Check if AVD exists:**
   ```bash
   avdmanager list avd
   ```

2. **Delete and recreate AVD:**
   ```bash
   avdmanager delete avd -n Pixel_7_API_34
   avdmanager create avd -n Pixel_7_API_34 -k "system-images;android-34;google_apis;arm64-v8a" -d "pixel_7"
   ```

3. **Check for port conflicts:**
   ```bash
   lsof -i :5554
   ```

### App Not Installing

1. **Check emulator is running:**
   ```bash
   adb devices
   ```

2. **Uninstall existing version:**
   ```bash
   adb uninstall com.prabhavai
   ```

3. **Restart ADB:**
   ```bash
   adb kill-server
   adb start-server
   ```

### Metro Bundler Issues

1. **Clear Metro cache:**
   ```bash
   npm start -- --reset-cache
   ```

2. **Clear watchman:**
   ```bash
   watchman watch-del-all
   ```

### Build Errors

1. **Clean Android build:**
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

2. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules
   npm install --legacy-peer-deps
   ```

---

## Performance Tips

1. **Use Hardware Acceleration:**
   ```bash
   emulator -avd Pixel_7_API_34 -gpu host
   ```

2. **Allocate More RAM:**
   ```bash
   emulator -avd Pixel_7_API_34 -memory 4096
   ```

3. **Cold Boot (if emulator is slow):**
   ```bash
   emulator -avd Pixel_7_API_34 -no-snapshot-load
   ```

4. **Headless Mode (for CI/testing):**
   ```bash
   emulator -avd Pixel_7_API_34 -no-window -no-audio
   ```

---

## Full Setup Script

Save this as `setup-emulator.sh` and run with `bash setup-emulator.sh`:

```bash
#!/bin/bash

# Set environment variables
export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
export ANDROID_HOME="/opt/homebrew/share/android-commandlinetools"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH"

echo "=== Accepting SDK Licenses ==="
yes | sdkmanager --licenses

echo "=== Installing SDK Components ==="
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
sdkmanager "emulator" "system-images;android-34;google_apis;arm64-v8a"

echo "=== Creating AVD ==="
echo "no" | avdmanager create avd -n Pixel_7_API_34 -k "system-images;android-34;google_apis;arm64-v8a" -d "pixel_7" --force

echo "=== Setup Complete ==="
echo "Run 'emulator -avd Pixel_7_API_34' to start the emulator"
```

---

## Running for Demo

For investor demos, follow these steps:

1. **Start emulator early** (5 minutes before demo):
   ```bash
   emulator -avd Pixel_7_API_34 -gpu host
   ```

2. **Wait for full boot** - You should see the Android home screen

3. **Start Metro bundler:**
   ```bash
   cd "/Users/gauravsingh/Documents/Gaurav/Facctum/Personal/SG/AI App for Personality Development/PrabhavAI"
   npm start
   ```

4. **Run the app:**
   ```bash
   npm run android
   ```

5. **Demo credentials:**
   - Phone: `9876543210`
   - OTP: `123456` (any 6 digits except `000000`)

---

*For demo script and talking points, see [DEMO_SCRIPT.md](./DEMO_SCRIPT.md)*
