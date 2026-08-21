/**
 * Still v2 — Neuro-Acoustic Soundscapes Database
 * Shared across Web (React) and Mobile (React Native)
 */

export const SOUNDSCAPES = [
  {
    id: "alpha_sanctuary",
    title: "Alpha Wave Sanctuary",
    purpose: "Room Tranquility & Stress Relief",
    science: "432 Hz Solfeggio • 10 Hz Alpha",
    description: "Warm acoustic pads with gentle alpha oscillations designed to quiet the nervous system and ease racing thoughts.",
    icon: "fa-infinity",
    baseFreq: 432,
    binauralDiff: 10.0,
    chordNotes: [216, 288, 324, 432, 540],
    defaultStems: {
      pads: 0.8,
      brownian: 0.35,
      rain: 0.1,
      binaural: 0.45,
      piano: 0.6
    }
  },
  {
    id: "deep_delta",
    title: "Deep Delta Sleep",
    purpose: "Deep Sleep & Night Wind-Down",
    science: "2.5 Hz Delta • Somatic Rest",
    description: "Sub-bass resonance paired with 2.5 Hz delta waves to trigger somatic parasympathetic relaxation and natural sleep onset.",
    icon: "fa-moon",
    baseFreq: 174,
    binauralDiff: 2.5,
    chordNotes: [87, 130.5, 174, 261],
    defaultStems: {
      pads: 0.9,
      brownian: 0.5,
      rain: 0.05,
      binaural: 0.65,
      piano: 0.3
    }
  },
  {
    id: "brownian_rain",
    title: "Brownian Rain Shield",
    purpose: "ADHD & Noise Masking Shield",
    science: "1/f² Brownian Noise • Rain",
    description: "Deep brownian noise fused with steady raindrops to form an acoustic privacy shield against sudden room noises and ADHD distraction.",
    icon: "fa-cloud-rain",
    baseFreq: 256,
    binauralDiff: 8.0,
    chordNotes: [128, 192, 256, 384],
    defaultStems: {
      pads: 0.4,
      brownian: 0.85,
      rain: 0.65,
      binaural: 0.3,
      piano: 0.4
    }
  },
  {
    id: "zen_garden",
    title: "Zen Garden Harmonics",
    purpose: "0.1 Hz Breathing & HRV Reset",
    science: "528 Hz Transformation • 0.1 Hz LFO",
    description: "Solfeggio 528 Hz harmonic chords with slow 0.1 Hz LFO breathing cycles that match optimal Heart Rate Variability (HRV).",
    icon: "fa-spa",
    baseFreq: 528,
    binauralDiff: 7.83,
    chordNotes: [264, 396, 528, 660],
    defaultStems: {
      pads: 0.75,
      brownian: 0.3,
      rain: 0.15,
      binaural: 0.4,
      piano: 0.7
    }
  },
  {
    id: "forest_dusk",
    title: "Forest Dusk & Hearth",
    purpose: "Anxiety Relief & Cozy Calm",
    science: "Biophilic 396 Hz • Hearth",
    description: "Night forest crickets, crackling fireplace embers, and evening breezes proven to lower stress hormones.",
    icon: "fa-tree",
    baseFreq: 396,
    binauralDiff: 6.0,
    chordNotes: [198, 297, 396, 495],
    defaultStems: {
      pads: 0.5,
      brownian: 0.4,
      rain: 0.25,
      binaural: 0.35,
      piano: 0.5
    }
  },
  {
    id: "cosmic_float",
    title: "Cosmic Float & Stillness",
    purpose: "Overthinking Reset & Mental Rest",
    science: "288 Hz Non-Predictive Drones",
    description: "Zero-gravity ambient drone pads that flow without repetitive hooks, allowing the brain to stop predicting and rest.",
    icon: "fa-meteor",
    baseFreq: 288,
    binauralDiff: 9.0,
    chordNotes: [144, 216, 288, 432, 576],
    defaultStems: {
      pads: 0.85,
      brownian: 0.3,
      rain: 0.05,
      binaural: 0.5,
      piano: 0.65
    }
  },
  {
    id: "flow_state",
    title: "Deep Flow & Study",
    purpose: "Deep Work, Focus & Study Blocks",
    science: "6 Hz Theta Focus • 320 Hz",
    description: "Isochronic theta waves and smooth analog warmth to anchor focus, stop mind-wandering, and promote deep flow.",
    icon: "fa-fire-flame-curved",
    baseFreq: 320,
    binauralDiff: 6.0,
    chordNotes: [160, 240, 320, 480],
    defaultStems: {
      pads: 0.6,
      brownian: 0.6,
      rain: 0.2,
      binaural: 0.5,
      piano: 0.5
    }
  }
];

export const THEMES = [
  {
    id: "midnight",
    name: "Midnight Obsidian",
    icon: "🌙",
    bg: "#05070d",
    cardBg: "rgba(13, 19, 33, 0.92)",
    accent: "#38bdf8",
    accentGlow: "rgba(56, 189, 248, 0.4)",
    border: "rgba(56, 189, 248, 0.2)"
  },
  {
    id: "sunrise",
    name: "Sunrise Amber",
    icon: "☀️",
    bg: "#0d0805",
    cardBg: "rgba(33, 20, 13, 0.92)",
    accent: "#f59e0b",
    accentGlow: "rgba(245, 158, 11, 0.4)",
    border: "rgba(245, 158, 11, 0.25)"
  },
  {
    id: "forest",
    name: "Forest Biophilic",
    icon: "🍃",
    bg: "#050d08",
    cardBg: "rgba(13, 33, 20, 0.92)",
    accent: "#10b981",
    accentGlow: "rgba(16, 185, 129, 0.4)",
    border: "rgba(16, 185, 129, 0.25)"
  },
  {
    id: "lavender",
    name: "Lavender Dusk",
    icon: "✨",
    bg: "#0a0612",
    cardBg: "rgba(26, 15, 42, 0.92)",
    accent: "#a855f7",
    accentGlow: "rgba(168, 85, 247, 0.4)",
    border: "rgba(168, 85, 247, 0.25)"
  }
];
