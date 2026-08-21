# Still — Version 2 (v2) Cross-Platform Architecture

**Still v2** is a modular, high-performance cross-platform neuro-acoustic soundscape engine built for radical simplicity and deep tranquility.

---

## 📁 Directory Structure

```
v2/
├── README.md               # Architecture and documentation
│
├── shared/                 # 🌐 Shared Acoustic Math & Presets
│   └── soundscapes.js      # Solfeggio tuning, noise formulas, chord frequencies
│
├── web/                    # 🖥️ React + Vite Web Application
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── engine/         # Web Audio Synthesizer & Multi-Stem Mixer
│       ├── components/     # Monolith, BreathingHalo, StemMixer, AboutModal
│       └── App.jsx
│
└── mobile/                 # 📱 React Native (Expo) Mobile App
    ├── package.json
    ├── app.json            # Android APK & iOS build configuration
    └── src/
        ├── audio/          # Native background audio daemon service
        └── screens/        # Native mobile interface & haptic feedback
```

---

## 🚀 Quickstart: Web App (`v2/web`)

```bash
cd v2/web
npm install
npm run dev
```

---

## 📱 Quickstart: Mobile App (`v2/mobile`)

```bash
cd v2/mobile
npm install
npx expo start
```

To build a standalone Android `.apk` for friends:
```bash
npx eas build -p android --profile preview
```

---

## 🛡️ License
MIT License • Created with care by [Hari](https://github.com/Harixomxsingh) (2026)
