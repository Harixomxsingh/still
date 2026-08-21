/**
 * Still v2 — Neuro-Acoustic Soundscapes Database
 * Shared across Web (React) and Mobile (React Native)
 */

export const SOUNDSCAPES = [
  {
    id: "alpha_sanctuary",
    title: "Alpha Wave Sanctuary",
    science: "432 Hz Solfeggio • 10 Hz Alpha Entrainment",
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
    science: "2.5 Hz Delta • Non-REM Somatic Rest",
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
    science: "1/f² Noise • Auditory Cortex Masking",
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
    science: "528 Hz Transformation • 0.1 Hz Modulation",
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
    science: "Biophilic Frequency • Sympathetic Reset",
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
    science: "Non-Predictive Ambient Swells",
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
    science: "6 Hz Theta Focus • Noise Masking",
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
  { id: "midnight", name: "Midnight Obsidian", icon: "fa-moon" },
  { id: "sunrise", name: "Sunrise Amber", icon: "fa-sun" },
  { id: "forest", name: "Forest Biophilic", icon: "fa-leaf" },
  { id: "lavender", name: "Lavender Dusk", icon: "fa-wand-magic-sparkles" }
];
