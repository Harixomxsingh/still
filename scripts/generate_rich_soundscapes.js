const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Still v2 — High-Fidelity Generative Neuro-Acoustic Studio Synthesizer
 * Produces organic, warm, multi-layered 20-minute master soundscapes:
 * - 0.1 Hz HRV breathing resonance filter
 * - Detuned analog pad chords (Triangle + Sine chorus)
 * - Deep 1/f² Brownian ocean rumble
 * - Biophilic bandpassed rain textures
 * - Stereoscopic binaural wave integration
 * - Generative stochastic pentatonic piano droplets
 * - Analog tanh soft-saturation for warm master tone
 */

const SAMPLE_RATE = 44100;
const DURATION_SEC = 1200; // Exact 20 minutes (1200s) matching daily stillness streak

// Audio EQ Cookbook 2-Pole Biquad Filter
class BiquadFilter {
  constructor(sampleRate) {
    this.fs = sampleRate;
    this.x1 = 0;
    this.x2 = 0;
    this.y1 = 0;
    this.y2 = 0;
    this.b0 = 1;
    this.b1 = 0;
    this.b2 = 0;
    this.a1 = 0;
    this.a2 = 0;
  }

  setLowpass(cutoff, q = 1.0) {
    const f = Math.max(20, Math.min(cutoff, this.fs * 0.45));
    const w0 = 2 * Math.PI * f / this.fs;
    const cosW = Math.cos(w0);
    const sinW = Math.sin(w0);
    const alpha = sinW / (2 * q);
    const a0 = 1 + alpha;

    this.b0 = ((1 - cosW) / 2) / a0;
    this.b1 = (1 - cosW) / a0;
    this.b2 = ((1 - cosW) / 2) / a0;
    this.a1 = (-2 * cosW) / a0;
    this.a2 = (1 - alpha) / a0;
  }

  setBandpass(centerFreq, q = 1.0) {
    const f = Math.max(20, Math.min(centerFreq, this.fs * 0.45));
    const w0 = 2 * Math.PI * f / this.fs;
    const cosW = Math.cos(w0);
    const sinW = Math.sin(w0);
    const alpha = sinW / (2 * q);
    const a0 = 1 + alpha;

    this.b0 = (sinW / 2) / a0;
    this.b1 = 0;
    this.b2 = (-sinW / 2) / a0;
    this.a1 = (-2 * cosW) / a0;
    this.a2 = (1 - alpha) / a0;
  }

  process(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1;
    this.x1 = x;
    this.y2 = this.y1;
    this.y1 = y;
    return isNaN(y) ? 0 : y;
  }
}

// Bandlimited-like warm triangle wave oscillator
function warmTriangle(phase) {
  const p = phase - Math.floor(phase);
  return p < 0.5 ? 4 * p - 1 : 3 - 4 * p;
}

// Active Piano Note representation
class PianoNote {
  constructor(freq, startTime, velocity, pan) {
    this.freq = freq;
    this.startTime = startTime;
    this.velocity = velocity;
    this.pan = pan; // 0 (left) to 1 (right)
    this.duration = 4.8;
  }

  sample(t) {
    const age = t - this.startTime;
    if (age < 0 || age > this.duration) return [0, 0];

    // Envelope: 60ms soft attack, natural exponential acoustic decay
    let env = 0;
    if (age < 0.06) {
      env = (age / 0.06) * this.velocity;
    } else {
      env = this.velocity * Math.exp(-(age - 0.06) / 1.55);
    }

    // Rich acoustic harmonic timbre: fundamental + octave overtone + 5th overtone
    const p1 = (this.freq * age) % 1.0;
    const p2 = (this.freq * 2.0 * age) % 1.0;
    const p3 = (this.freq * 3.0 * age) % 1.0;

    const wave = 0.65 * warmTriangle(p1) +
                 0.25 * Math.sin(2 * Math.PI * p2) +
                 0.10 * Math.sin(2 * Math.PI * p3);

    const s = wave * env;
    const left = s * Math.cos(this.pan * (Math.PI / 2));
    const right = s * Math.sin(this.pan * (Math.PI / 2));
    return [left, right];
  }
}

// Soundscape catalog configuration
const SOUNDSCAPES_CONFIG = [
  {
    id: 'alpha_sanctuary',
    title: 'Alpha Wave Sanctuary',
    baseFreq: 432,
    binauralDiff: 10.0,
    chordNotes: [216, 288, 324, 432, 540],
    pianoNotes: [216, 256, 288, 324, 384, 432, 512, 576, 648],
    stems: { pads: 0.8, brownian: 0.35, rain: 0.1, binaural: 0.35, piano: 0.65 }
  },
  {
    id: 'deep_delta',
    title: 'Deep Delta Sleep',
    baseFreq: 174,
    binauralDiff: 2.5,
    chordNotes: [87, 130.5, 174, 261],
    pianoNotes: [87, 130.5, 174, 196, 220, 261, 348],
    stems: { pads: 0.9, brownian: 0.55, rain: 0.04, binaural: 0.45, piano: 0.35 }
  },
  {
    id: 'brownian_rain',
    title: 'Brownian Rain Shield',
    baseFreq: 256,
    binauralDiff: 8.0,
    chordNotes: [128, 192, 256, 384],
    pianoNotes: [128, 160, 192, 256, 320, 384, 512],
    stems: { pads: 0.45, brownian: 0.85, rain: 0.60, binaural: 0.25, piano: 0.45 }
  },
  {
    id: 'zen_garden',
    title: 'Zen Garden Harmonics',
    baseFreq: 528,
    binauralDiff: 7.83,
    chordNotes: [264, 396, 528, 660],
    pianoNotes: [264, 330, 396, 528, 660, 792],
    stems: { pads: 0.75, brownian: 0.3, rain: 0.12, binaural: 0.35, piano: 0.70 }
  },
  {
    id: 'forest_dusk',
    title: 'Forest Dusk & Hearth',
    baseFreq: 396,
    binauralDiff: 6.0,
    chordNotes: [198, 297, 396, 495],
    pianoNotes: [198, 247.5, 297, 396, 445.5, 495, 594],
    stems: { pads: 0.55, brownian: 0.45, rain: 0.25, binaural: 0.30, piano: 0.55 }
  },
  {
    id: 'cosmic_float',
    title: 'Cosmic Float & Stillness',
    baseFreq: 288,
    binauralDiff: 9.0,
    chordNotes: [144, 216, 288, 432, 576],
    pianoNotes: [144, 216, 288, 360, 432, 504, 576, 648],
    stems: { pads: 0.85, brownian: 0.3, rain: 0.05, binaural: 0.40, piano: 0.65 }
  },
  {
    id: 'flow_state',
    title: 'Deep Flow & Study',
    baseFreq: 320,
    binauralDiff: 6.0,
    chordNotes: [160, 240, 320, 480],
    pianoNotes: [160, 200, 240, 320, 400, 480, 560],
    stems: { pads: 0.60, brownian: 0.60, rain: 0.18, binaural: 0.40, piano: 0.50 }
  }
];

function generateTrack(cfg, outputPathM4A) {
  console.log(`\n========================================`);
  console.log(`Synthesizing: ${cfg.title} (${cfg.id}) [1200s / 20m]`);
  console.log(`========================================`);

  const tmpWav = path.join(__dirname, `../v2/mobile/assets/audio_20m/_tmp_${cfg.id}.wav`);
  const outDir = path.dirname(outputPathM4A);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const numChannels = 2;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = SAMPLE_RATE * blockAlign;
  const numSamples = Math.floor(DURATION_SEC * SAMPLE_RATE);
  const dataSize = numSamples * blockAlign;

  const wavFd = fs.openSync(tmpWav, 'w');

  // Write WAV Header
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bytesPerSample * 8, 34); // 16-bit
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);
  fs.writeSync(wavFd, header, 0, 44);

  // Initialize DSP Filters
  const padFilterL = new BiquadFilter(SAMPLE_RATE);
  const padFilterR = new BiquadFilter(SAMPLE_RATE);
  const brownFilterL = new BiquadFilter(SAMPLE_RATE);
  const brownFilterR = new BiquadFilter(SAMPLE_RATE);
  const rainFilterL = new BiquadFilter(SAMPLE_RATE);
  const rainFilterR = new BiquadFilter(SAMPLE_RATE);

  brownFilterL.setLowpass(260, 0.8);
  brownFilterR.setLowpass(260, 0.8);
  rainFilterL.setBandpass(1400, 0.7);
  rainFilterR.setBandpass(1400, 0.7);

  // Pad chord phases & slight frequency detuning for analog warmth
  const padPhasesL = cfg.chordNotes.map(() => Math.random());
  const padPhasesR = cfg.chordNotes.map(() => Math.random());
  const padFreqsL = cfg.chordNotes.map(f => f * (1 - 0.0008 - Math.random() * 0.0004));
  const padFreqsR = cfg.chordNotes.map(f => f * (1 + 0.0008 + Math.random() * 0.0004));

  // Generative Piano scheduler
  let nextPianoTime = 2.5 + Math.random() * 3.0;
  const activePianoNotes = [];

  // Brownian noise integrators
  let brownL = 0;
  let brownR = 0;

  // Stream processing in chunks (1 second = 44100 samples per chunk)
  const chunkSize = SAMPLE_RATE;
  const chunkBuffer = Buffer.alloc(chunkSize * blockAlign);
  const totalChunks = Math.ceil(numSamples / chunkSize);

  const tStart = Date.now();

  for (let c = 0; c < totalChunks; c++) {
    const chunkStartSample = c * chunkSize;
    const currentChunkSamples = Math.min(chunkSize, numSamples - chunkStartSample);
    let bufOffset = 0;

    for (let s = 0; s < currentChunkSamples; s++) {
      const globalSample = chunkStartSample + s;
      const t = globalSample / SAMPLE_RATE;

      // 1. Update 0.1 Hz Breathing LFO Filter every 64 samples for smooth respiratory swell
      if (globalSample % 64 === 0) {
        // 0.1 Hz breathing sine cycle (10 seconds per breath)
        const breatheLfo = Math.sin(2 * Math.PI * 0.1 * t);
        const cutoff = 550 + 260 * breatheLfo; // Sweeps 290 Hz -> 810 Hz
        padFilterL.setLowpass(cutoff, 1.8);
        padFilterR.setLowpass(cutoff, 1.8);
      }

      // 2. Analog Pad Chord Oscillators
      let rawPadL = 0;
      let rawPadR = 0;
      for (let n = 0; n < cfg.chordNotes.length; n++) {
        padPhasesL[n] = (padPhasesL[n] + padFreqsL[n] / SAMPLE_RATE) % 1.0;
        padPhasesR[n] = (padPhasesR[n] + padFreqsR[n] / SAMPLE_RATE) % 1.0;

        const isEven = n % 2 === 0;
        // Warm blend of triangle + sine for soft acoustic harmonic richness
        const voiceL = isEven
          ? 0.7 * warmTriangle(padPhasesL[n]) + 0.3 * Math.sin(2 * Math.PI * padPhasesL[n])
          : 0.5 * warmTriangle(padPhasesL[n]) + 0.5 * Math.sin(2 * Math.PI * padPhasesL[n]);
        const voiceR = isEven
          ? 0.7 * warmTriangle(padPhasesR[n]) + 0.3 * Math.sin(2 * Math.PI * padPhasesR[n])
          : 0.5 * warmTriangle(padPhasesR[n]) + 0.5 * Math.sin(2 * Math.PI * padPhasesR[n]);

        rawPadL += voiceL;
        rawPadR += voiceR;
      }
      rawPadL /= cfg.chordNotes.length;
      rawPadR /= cfg.chordNotes.length;

      // Pad breath envelope: 0.1 Hz breathing amplitude modulation
      const padBreatheGain = 0.85 + 0.15 * Math.sin(2 * Math.PI * 0.1 * t);
      const padL = padFilterL.process(rawPadL) * padBreatheGain * cfg.stems.pads;
      const padR = padFilterR.process(rawPadR) * padBreatheGain * cfg.stems.pads;

      // 3. True 1/f² Brownian Noise Rumble
      const whiteL = Math.random() * 2 - 1;
      const whiteR = Math.random() * 2 - 1;
      brownL = (brownL + 0.02 * whiteL) / 1.02;
      brownR = (brownR + 0.02 * whiteR) / 1.02;
      const oceanL = brownFilterL.process(brownL * 3.5) * cfg.stems.brownian * 0.45;
      const oceanR = brownFilterR.process(brownR * 3.5) * cfg.stems.brownian * 0.45;

      // 4. Bandpassed Rain & Biophilic Mist
      const rainNoiseL = Math.random() * 2 - 1;
      const rainNoiseR = Math.random() * 2 - 1;
      const rainDropL = Math.random() < 0.003 ? Math.random() * 0.25 : 0;
      const rainDropR = Math.random() < 0.003 ? Math.random() * 0.25 : 0;
      const rainL = (rainFilterL.process(rainNoiseL) * 1.8 + rainDropL) * cfg.stems.rain * 0.4;
      const rainR = (rainFilterR.process(rainNoiseR) * 1.8 + rainDropR) * cfg.stems.rain * 0.4;

      // 5. Binaural Beats Stereo Waveform
      const carrier = cfg.baseFreq;
      const diff = cfg.binauralDiff;
      const binL = Math.sin(2 * Math.PI * carrier * t) * cfg.stems.binaural * 0.18;
      const binR = Math.sin(2 * Math.PI * (carrier + diff) * t) * cfg.stems.binaural * 0.18;

      // 6. Generative Stochastic Piano Drops
      if (t >= nextPianoTime) {
        const noteFreq = cfg.pianoNotes[Math.floor(Math.random() * cfg.pianoNotes.length)];
        const vel = 0.15 + Math.random() * 0.12;
        const pan = 0.3 + Math.random() * 0.4; // Soft centered stereo pan
        activePianoNotes.push(new PianoNote(noteFreq, t, vel, pan));

        // Schedule next contemplative note in 3.5 to 7.8 seconds
        nextPianoTime = t + 3.5 + Math.random() * 4.3;
      }

      let pianoL = 0;
      let pianoR = 0;
      for (let pIdx = activePianoNotes.length - 1; pIdx >= 0; pIdx--) {
        const note = activePianoNotes[pIdx];
        const [nL, nR] = note.sample(t);
        pianoL += nL;
        pianoR += nR;
        if (t - note.startTime > note.duration) {
          activePianoNotes.splice(pIdx, 1);
        }
      }
      pianoL *= cfg.stems.piano;
      pianoR *= cfg.stems.piano;

      // Master Stem Mix
      let masterL = padL + oceanL + rainL + binL + pianoL;
      let masterR = padR + oceanR + rainR + binR + pianoR;

      // Smooth Edge Fade-In (first 4s) and Fade-Out (last 4s)
      let edgeFade = 1.0;
      const fadeSamples = SAMPLE_RATE * 4.0;
      if (globalSample < fadeSamples) {
        edgeFade = globalSample / fadeSamples;
      } else if (globalSample > numSamples - fadeSamples) {
        edgeFade = (numSamples - globalSample) / fadeSamples;
      }
      masterL *= edgeFade;
      masterR *= edgeFade;

      // Analog Soft-Saturation Limiter (Warm Tanh Curve)
      masterL = Math.tanh(masterL * 1.15) * 0.90;
      masterR = Math.tanh(masterR * 1.15) * 0.90;

      const intL = Math.max(-32767, Math.min(32767, Math.floor(masterL * 32767)));
      const intR = Math.max(-32767, Math.min(32767, Math.floor(masterR * 32767)));

      chunkBuffer.writeInt16LE(intL, bufOffset);
      chunkBuffer.writeInt16LE(intR, bufOffset + 2);
      bufOffset += 4;
    }

    fs.writeSync(wavFd, chunkBuffer, 0, bufOffset);

    if (c % 100 === 0 || c === totalChunks - 1) {
      const pct = Math.floor((c / totalChunks) * 100);
      process.stdout.write(`\r  Progress: ${pct}% (${c}/${totalChunks} chunks)`);
    }
  }

  fs.closeSync(wavFd);
  const dSec = ((Date.now() - tStart) / 1000).toFixed(1);
  console.log(`\n  WAV generated in ${dSec}s. Encoding to high-fidelity AAC M4A...`);

  // Convert via Apple CoreAudio afconvert: 128kbps stereo AAC in MPEG-4 Audio (.m4a)
  try {
    const afCmd = `afconvert -f m4af -d aac -b 128000 -q 127 "${tmpWav}" -o "${outputPathM4A}"`;
    execSync(afCmd, { stdio: 'inherit' });
    fs.unlinkSync(tmpWav);
    const stat = fs.statSync(outputPathM4A);
    const sizeMb = (stat.size / 1024 / 1024).toFixed(2);
    console.log(`  ✓ Successfully mastered: ${path.basename(outputPathM4A)} (${sizeMb} MB)`);
  } catch (err) {
    console.error(`  Error converting to M4A:`, err.message);
  }
}

// Generate all soundscapes or a specific target
const targetId = process.argv[2];
const targets = targetId
  ? SOUNDSCAPES_CONFIG.filter(c => c.id === targetId)
  : SOUNDSCAPES_CONFIG;

if (targets.length === 0) {
  console.error(`Unknown target soundscape: ${targetId}`);
  process.exit(1);
}

const outDir = path.join(__dirname, '../v2/mobile/assets/audio_20m');
console.log(`Still Studio Synthesizer initializing...`);
console.log(`Target soundscapes: ${targets.map(t => t.id).join(', ')}`);

for (const cfg of targets) {
  const outFile = path.join(outDir, `${cfg.id}_20m.m4a`);
  generateTrack(cfg, outFile);
}

console.log(`\nAll target soundscapes generated and mastered successfully!`);
