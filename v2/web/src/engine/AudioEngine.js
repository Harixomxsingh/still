/**
 * Still v2 — Modular Web Audio Synthesis Engine
 * Pure procedural synthesis with dynamic stem mixing
 */

const SILENT_AUDIO_URI = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.currentTrack = null;
    this.mediaAnchor = null;

    // Stem Gain Nodes
    this.padMasterGain = null;
    this.brownGain = null;
    this.rainGain = null;
    this.binauralGain = null;
    this.pianoMasterGain = null;

    // Active Nodes
    this.padNodes = [];
    this.binauralLeft = null;
    this.binauralRight = null;
    this.brownNoiseNode = null;
    this.rainNoiseNode = null;
    this.lfoFilter = null;
    this.lfoOsc = null;

    // Piano timer
    this.pianoTimeout = null;

    // Stems configuration (0.0 to 1.0)
    this.stems = {
      pads: 0.8,
      brownian: 0.4,
      rain: 0.2,
      binaural: 0.4,
      piano: 0.5
    };
  }

  init() {
    if (this.ctx) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Initialize Stem Sub-Master Gain Nodes
    this.padMasterGain = this.ctx.createGain();
    this.padMasterGain.gain.setValueAtTime(this.stems.pads, this.ctx.currentTime);
    this.padMasterGain.connect(this.masterGain);

    this.pianoMasterGain = this.ctx.createGain();
    this.pianoMasterGain.gain.setValueAtTime(this.stems.piano, this.ctx.currentTime);
    this.pianoMasterGain.connect(this.masterGain);

    this._setupBrownNoise();
    this._setupRainNoise();
    this._setupBinaural();
    this._setupPadFilter();
    this._startGenerativePiano();
  }

  _setupBrownNoise() {
    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    this.brownNoiseNode = this.ctx.createBufferSource();
    this.brownNoiseNode.buffer = noiseBuffer;
    this.brownNoiseNode.loop = true;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(260, this.ctx.currentTime);

    this.brownGain = this.ctx.createGain();
    this.brownGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

    this.brownNoiseNode.connect(lowpass);
    lowpass.connect(this.brownGain);
    this.brownGain.connect(this.masterGain);

    this.brownNoiseNode.start(0);
  }

  _setupRainNoise() {
    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    this.rainNoiseNode = this.ctx.createBufferSource();
    this.rainNoiseNode.buffer = noiseBuffer;
    this.rainNoiseNode.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1400, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(0.7, this.ctx.currentTime);

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

    this.rainNoiseNode.connect(bandpass);
    bandpass.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);

    this.rainNoiseNode.start(0);
  }

  _setupBinaural() {
    const merger = this.ctx.createChannelMerger(2);

    this.binauralLeft = this.ctx.createOscillator();
    this.binauralRight = this.ctx.createOscillator();
    this.binauralLeft.type = 'sine';
    this.binauralRight.type = 'sine';

    const leftGain = this.ctx.createGain();
    const rightGain = this.ctx.createGain();
    leftGain.gain.value = 0.5;
    rightGain.gain.value = 0.5;

    this.binauralLeft.connect(leftGain);
    this.binauralRight.connect(rightGain);
    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);

    this.binauralGain = this.ctx.createGain();
    this.binauralGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

    merger.connect(this.binauralGain);
    this.binauralGain.connect(this.masterGain);

    this.binauralLeft.start(0);
    this.binauralRight.start(0);
  }

  _setupPadFilter() {
    this.lfoFilter = this.ctx.createBiquadFilter();
    this.lfoFilter.type = 'lowpass';
    this.lfoFilter.frequency.setValueAtTime(550, this.ctx.currentTime);
    this.lfoFilter.Q.setValueAtTime(2.0, this.ctx.currentTime);

    this.lfoOsc = this.ctx.createOscillator();
    this.lfoOsc.type = 'sine';
    this.lfoOsc.frequency.setValueAtTime(0.1, this.ctx.currentTime); // 0.1 Hz breathing resonance

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);

    this.lfoOsc.connect(lfoGain);
    lfoGain.connect(this.lfoFilter.frequency);
    this.lfoOsc.start(0);

    this.lfoFilter.connect(this.padMasterGain);
  }

  _startGenerativePiano() {
    const pentatonicNotes = [216, 256, 288, 324, 384, 432, 512, 576, 648];

    const playNote = () => {
      if (this.isPlaying && this.ctx && this.stems.piano > 0.05) {
        const freq = pentatonicNotes[Math.floor(Math.random() * pentatonicNotes.length)];
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Acoustic decay envelope
        const targetPeak = 0.08 * this.stems.piano;
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(targetPeak, now + 0.08);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

        osc.connect(g);
        g.connect(this.pianoMasterGain);

        osc.start(now);
        osc.stop(now + 4.8);
      }

      const nextDelay = 3500 + Math.random() * 5500;
      this.pianoTimeout = setTimeout(playNote, nextDelay);
    };

    this.pianoTimeout = setTimeout(playNote, 4000);
  }

  playCelebrationChime() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const harmonics = [528, 792, 1056, 1320]; // 528 Hz Solfeggio Golden Ratio Transformation Chime
      harmonics.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const peak = 0.12 / (idx + 1);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(peak, now + 0.05);
        g.gain.exponentialRampToValueAtTime(0.00001, now + 3.8);

        osc.connect(g);
        g.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 4.0);
      });
    } catch (e) {}
  }

  async applySoundscape(track, crossfadeDuration = 2.0) {
    this.init();
    this.isPlaying = true;
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (e) {}
    }
    this._startMediaAnchor();

    this.currentTrack = track;
    const now = this.ctx.currentTime;

    // Binaural Beats Frequency Tuning
    const carrier = track.baseFreq || 432;
    const diff = track.binauralDiff || 10.0;
    this.binauralLeft.frequency.setValueAtTime(carrier, now);
    this.binauralRight.frequency.setValueAtTime(carrier + diff, now);

    // Apply Stems immediately
    const effectiveBrown = (track.defaultStems.brownian || 0.4) * this.stems.brownian;
    const effectiveRain = (track.defaultStems.rain || 0.2) * this.stems.rain;
    const effectiveBinaural = (track.defaultStems.binaural || 0.4) * this.stems.binaural;

    this.brownGain.gain.setValueAtTime(effectiveBrown, now);
    this.rainGain.gain.setValueAtTime(effectiveRain, now);
    this.binauralGain.gain.setValueAtTime(effectiveBinaural, now);

    // Fade out previous pad nodes
    this.padNodes.forEach(node => {
      try {
        node.gainNode.gain.setValueAtTime(0.0001, now);
        setTimeout(() => {
          try {
            node.osc.stop();
            node.osc.disconnect();
          } catch (e) {}
        }, 400);
      } catch (e) {}
    });
    this.padNodes = [];

    // Synthesize new chord harmonics immediately
    track.chordNotes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gNode = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime((Math.random() * 8) - 4, now);

      const targetGain = ((track.defaultStems.pads || 0.8) / track.chordNotes.length) * this.stems.pads;
      gNode.gain.setValueAtTime(targetGain, now);

      osc.connect(gNode);
      gNode.connect(this.lfoFilter);
      osc.start(now);

      this.padNodes.push({ osc, gainNode: gNode });
    });
  }

  setStemGain(stemName, value) {
    this.stems[stemName] = Math.max(0, Math.min(1, value));
    if (!this.ctx || !this.isPlaying || !this.currentTrack) return;

    const now = this.ctx.currentTime;
    if (stemName === 'pads') {
      this.padMasterGain.gain.setTargetAtTime(this.stems.pads, now, 0.2);
    } else if (stemName === 'brownian') {
      const target = (this.currentTrack.defaultStems.brownian || 0.4) * this.stems.brownian;
      this.brownGain.gain.setTargetAtTime(target, now, 0.2);
    } else if (stemName === 'rain') {
      const target = (this.currentTrack.defaultStems.rain || 0.2) * this.stems.rain;
      this.rainGain.gain.setTargetAtTime(target, now, 0.2);
    } else if (stemName === 'binaural') {
      const target = (this.currentTrack.defaultStems.binaural || 0.4) * this.stems.binaural;
      this.binauralGain.gain.setTargetAtTime(target, now, 0.2);
    } else if (stemName === 'piano') {
      this.pianoMasterGain.gain.setTargetAtTime(this.stems.piano, now, 0.2);
    }
  }

  setMasterVolume(val) {
    if (!this.ctx || !this.masterGain) return;
    this.masterGain.gain.setTargetAtTime(val, this.ctx.currentTime, 0.05);
  }

  _startMediaAnchor() {
    if (typeof window === 'undefined') return;
    try {
      if (!this.mediaAnchor) {
        let existing = document.getElementById('still_media_anchor');
        if (existing) {
          this.mediaAnchor = existing;
        } else {
          this.mediaAnchor = document.createElement('audio');
          this.mediaAnchor.id = 'still_media_anchor';
          this.mediaAnchor.src = './ambient_carrier.wav';
          this.mediaAnchor.loop = true;
          this.mediaAnchor.volume = 0.01;
          this.mediaAnchor.setAttribute('playsinline', 'true');
          this.mediaAnchor.setAttribute('webkit-playsinline', 'true');
          if (document.body) {
            document.body.appendChild(this.mediaAnchor);
          }
        }
      }
      this.mediaAnchor.play().catch(() => {});
    } catch (e) {}
  }

  _pauseMediaAnchor() {
    if (this.mediaAnchor) {
      try {
        this.mediaAnchor.pause();
      } catch (e) {}
    }
  }

  pause() {
    this.isPlaying = false;
    this._pauseMediaAnchor();
    if (!this.ctx) return;
    try {
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(0.00001, this.ctx.currentTime);
      }
      this.brownGain?.gain.setValueAtTime(0.00001, this.ctx.currentTime);
      this.rainGain?.gain.setValueAtTime(0.00001, this.ctx.currentTime);
      this.binauralGain?.gain.setValueAtTime(0.00001, this.ctx.currentTime);
      this.pianoMasterGain?.gain.setValueAtTime(0.00001, this.ctx.currentTime);
      this.ctx.suspend();
    } catch (e) {}
  }

  resume() {
    this.isPlaying = true;
    this._startMediaAnchor();
    if (!this.ctx) return;
    try {
      this.ctx.resume();
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
      }
    } catch (e) {}
    if (this.currentTrack) {
      this.applySoundscape(this.currentTrack, 1.5);
    }
  }
}
