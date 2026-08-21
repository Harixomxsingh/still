# Still Mobile for Android (v2) 📱🤖

A native React Native & Expo Android application for **Still — Distraction-Free Calm Space**.

---

## 🌟 Why Android-First?
Android allows **direct online distribution**, zero app store fees, free sideloading, and seamless installation via standalone `.apk` files.

---

## ✨ Features on Android

1. **🔒 True Background Audio & Lock-Screen Playback:**
   - Android Foreground Service + Wake Lock integration.
   - Audio continues playing smoothly when your phone screen auto-locks or when using other apps.
2. **🫁 0.1 Hz Resonant Breathing with Haptics:**
   - Visual breathing orb paired with gentle tactile haptic vibrations on inhale and exhale (`expo-haptics`).
3. **🧠 Daily Calm Wisdom + 30-Minute Milestone Shuffle:**
   - Daily anchor quote + rewards 30 continuous minutes of active listening with bonus wisdom unlocks.
4. **🎛️ Physical Tactile Stem Layer Mixer:**
   - Smooth drag sliders with physical vibration feedback for pads, brownian noise, rainfall, binaural beats, and piano drops.
5. **⚡ Over-The-Air (OTA) Instant Updates:**
   - Push new soundscapes and updates directly to all installed phones without requiring users to reinstall.

---

## 🚀 Step 1: Test Live on Android with Expo Go

```bash
cd v2/mobile
npm install
npx expo start
```
- Open **Expo Go** on your Android phone, tap **"Scan QR code"**, and scan the code from `http://localhost:3456/qr.html`.

---

## 📦 Step 2: Build Standalone Android APK (.apk)

To export an installable `.apk` file that anyone can download directly from your website or via link:

```bash
cd v2/mobile

# 1. Install EAS CLI (if not already installed)
npm install -g eas-cli

# 2. Build the Standalone APK:
eas build -p android --profile preview
```

When the build completes, EAS provides a direct download link to your **`Still.apk`**!

When the build finishes, EAS provides a direct download link to your standalone **`Still.apk`**!

---

## ⚡ How to Push Over-The-Air (OTA) Updates Instantly

Whenever you make changes to UI, sound formulas, or new features, you can push them instantly to all installed phones **without requiring users to download or reinstall**:

```bash
cd v2/mobile

# Publish instant OTA update to all phones:
eas update --branch production --message "Added new features"
```

When users open the app on their phone, it automatically downloads the update silently in the background and applies it immediately!
