# Still Mobile (v2) 📱

A native React Native & Expo mobile application for **Still — Distraction-Free Calm Space**.

---

## ✨ Features on Mobile

1. **True Background Audio & Lock-Screen Playback:**
   - Android Foreground Service + iOS Audio background modes.
   - Continues playing seamlessly when the phone screen auto-locks or when switching to other apps.
2. **0.1 Hz Resonant Breathing with Haptics:**
   - Visual breathing orb paired with gentle tactile haptic vibrations on inhale and exhale (`expo-haptics`).
3. **Daily Calm Wisdom + 30-Minute Milestone Shuffle:**
   - Daily anchor quote + rewards 30 continuous minutes of active listening with bonus wisdom unlocks.
4. **Interactive Audio Stem Layer Mixer:**
   - Fine-tune 432 Hz pads, brownian noise, rainfall, binaural beats, and acoustic piano drops.
5. **Standalone Android APK Export:**
   - Pre-configured package `com.hari.still` with custom Still App Icon & Splash screen.

---

## 🚀 How to Run Locally with Expo

```bash
cd v2/mobile
npm install
npx expo start
```
- Scan the QR code using the **Expo Go** app on your Android or iPhone.

---

## 📦 How to Build Standalone Android APK (.apk)

To export an installable `.apk` file that you and your friends can directly install on any Android phone:

```bash
cd v2/mobile

# 1. Install EAS CLI (if not already installed)
npm install -g eas-cli

# 2. Build the Android APK
eas build -p android --profile preview
```

When the build finishes, EAS provides a direct download link to your standalone **`Still.apk`**!
