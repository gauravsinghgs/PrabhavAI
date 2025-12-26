# PrabhavAI - Screen Recording Guide

**For:** Recording demo videos on Android Emulator
**Platform:** macOS

---

## Prerequisites

- Android Emulator running with PrabhavAI app installed
- Terminal access

---

## Simple 5-Step Recording Process

### Step 1: Open Terminal

Open a new Terminal window on your Mac (Cmd + Space, type "Terminal", press Enter).

---

### Step 2: Start Recording

Copy and paste this command:

```bash
/opt/homebrew/share/android-commandlinetools/platform-tools/adb shell screenrecord /sdcard/demo.mp4
```

**Note:** You'll see no output - that means it's recording. The recording will auto-stop after 3 minutes.

---

### Step 3: Perform the Demo on Emulator

While recording runs, go through the app on the emulator:

1. **Open PrabhavAI app** (if not already open)
2. **Login Flow:**
   - Phone: `9876543210`
   - OTP: `123456`
3. **Dashboard:** Show XP, Level, Streak
4. **Interview Tab:** Start a new interview, show setup options
5. **Learn Tab:** Browse learning modules
6. **Profile Tab:** Show profile and settings

Take your time - you have up to 3 minutes.

---

### Step 4: Stop Recording

Press `Ctrl + C` in the Terminal window to stop recording.

---

### Step 5: Save the Video to Your Computer

Copy and paste this command:

```bash
/opt/homebrew/share/android-commandlinetools/platform-tools/adb pull /sdcard/demo.mp4 ~/Desktop/PrabhavAI-demo.mp4
```

Your video will be saved to: `~/Desktop/PrabhavAI-demo.mp4`

---

## Quick Reference Commands

| Action | Command |
|--------|---------|
| Start recording | `adb shell screenrecord /sdcard/demo.mp4` |
| Stop recording | Press `Ctrl + C` |
| Save to Desktop | `adb pull /sdcard/demo.mp4 ~/Desktop/PrabhavAI-demo.mp4` |
| Save to project | `adb pull /sdcard/demo.mp4 demo-distribution/demo.mp4` |

---

## Recording Tips

1. **Clean the app state** - Logout and login fresh for best demo
2. **Close notifications** - Swipe down and clear any notifications on emulator
3. **Move slowly** - Give each screen 3-5 seconds to be visible
4. **Practice first** - Do a dry run without recording
5. **Check audio** - Screen recording does NOT capture audio (record voiceover separately if needed)

---

## Troubleshooting

### "adb: command not found"

Use the full path:
```bash
/opt/homebrew/share/android-commandlinetools/platform-tools/adb
```

### "error: no devices/emulators found"

Make sure the emulator is running:
```bash
/opt/homebrew/share/android-commandlinetools/platform-tools/adb devices
```

### Recording file is empty or corrupted

Wait 2-3 seconds after stopping before pulling the file:
```bash
sleep 3 && /opt/homebrew/share/android-commandlinetools/platform-tools/adb pull /sdcard/demo.mp4 ~/Desktop/demo.mp4
```

---

## Demo Flow Checklist

Use this checklist while recording:

```
[ ] App opens (splash screen)
[ ] Welcome screen visible
[ ] Phone input: 9876543210
[ ] OTP input: 123456
[ ] Dashboard shows (XP, Level, Streak)
[ ] Scroll dashboard to show activity
[ ] Tap Interview tab
[ ] Show "Start New Interview" button
[ ] Select interview type
[ ] Select company
[ ] Tap Learn tab
[ ] Show module cards
[ ] Tap Profile tab
[ ] Show profile details
```

---

## Output Locations

| Destination | Command |
|-------------|---------|
| Desktop | `adb pull /sdcard/demo.mp4 ~/Desktop/PrabhavAI-demo.mp4` |
| Project folder | `adb pull /sdcard/demo.mp4 demo-distribution/prabhav_demo.mp4` |
| Downloads | `adb pull /sdcard/demo.mp4 ~/Downloads/PrabhavAI-demo.mp4` |

---

*Last Updated: December 26, 2024*
