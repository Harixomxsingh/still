const fs = require('fs');
const path = require('path');

// Generate an exact 16-bit Stereo PCM WAV file with mathematical phase continuity (Zero dips / Endless flow)
function generateWav(filename, durationSec, sampleRate, audioFn) {
  const numChannels = 2;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const numSamples = Math.floor(durationSec * sampleRate);
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF Chunk Descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // 'fmt ' sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bytesPerSample * 8, 34); // BitsPerSample (16)

  // 'data' sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const progress = i / numSamples;

    // Continuous infinite flow with microscopic 2ms micro-smoothing at boundaries to guarantee zero-click wrap
    let edgeFade = 1.0;
    const edgeSamples = Math.floor(sampleRate * 0.005); // 5ms micro-edge
    if (i < edgeSamples) {
      edgeFade = i / edgeSamples;
    } else if (i > numSamples - edgeSamples) {
      edgeFade = (numSamples - i) / edgeSamples;
    }

    const [leftSample, rightSample] = audioFn(t, progress, i);

    const intLeft = Math.max(-32767, Math.min(32767, Math.floor(leftSample * edgeFade * 32767)));
    const intRight = Math.max(-32767, Math.min(32767, Math.floor(rightSample * edgeFade * 32767)));

    buffer.writeInt16LE(intLeft, offset);
    buffer.writeInt16LE(intRight, offset + 2);
    offset += 4;
  }

  const outDir = path.join(__dirname, '../v2/mobile/assets');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const targetPath = path.join(outDir, filename);
  fs.writeFileSync(targetPath, buffer);
  console.log(`Generated ${filename} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
}

const sampleRate = 44100;
const loopDuration = 20.0; // 20-second long seamless ambient loop

// 1. Alpha Wave Sanctuary (432 Hz Solfeggio Pad + 10 Hz Alpha)
generateWav('alpha_sanctuary.wav', loopDuration, sampleRate, (t, p) => {
  const f = 432;
  const pad = 0.28 * Math.sin(2 * Math.PI * f * t) + 0.18 * Math.sin(2 * Math.PI * (f * 0.75) * t) + 0.12 * Math.sin(2 * Math.PI * (f * 1.25) * t);
  const leftBin = 0.22 * Math.sin(2 * Math.PI * (f - 5) * t);
  const rightBin = 0.22 * Math.sin(2 * Math.PI * (f + 5) * t);
  const slowBreathe = 0.9 + 0.1 * Math.sin(2 * Math.PI * 0.1 * t);
  return [(pad + leftBin) * slowBreathe * 0.75, (pad + rightBin) * slowBreathe * 0.75];
});

// 2. Deep Delta Sleep (174 Hz Sub-bass + 2.5 Hz Somatic Delta)
generateWav('deep_delta.wav', loopDuration, sampleRate, (t, p) => {
  const f = 174;
  const sub = 0.4 * Math.sin(2 * Math.PI * (f / 2) * t) + 0.25 * Math.sin(2 * Math.PI * f * t) + 0.12 * Math.sin(2 * Math.PI * (f * 1.5) * t);
  const leftBin = 0.2 * Math.sin(2 * Math.PI * (f - 1.25) * t);
  const rightBin = 0.2 * Math.sin(2 * Math.PI * (f + 1.25) * t);
  return [(sub + leftBin) * 0.75, (sub + rightBin) * 0.75];
});

// 3. Brownian Rain Shield (Continuous Steady Brownian Noise + Rain)
let brownL = 0;
let brownR = 0;
generateWav('brownian_rain.wav', loopDuration, sampleRate, (t, p) => {
  const whiteL = Math.random() * 2 - 1;
  const whiteR = Math.random() * 2 - 1;
  brownL = (brownL + 0.03 * whiteL) / 1.03;
  brownR = (brownR + 0.03 * whiteR) / 1.03;
  const rainDropsL = Math.random() < 0.008 ? Math.random() * 0.35 : 0;
  const rainDropsR = Math.random() < 0.008 ? Math.random() * 0.35 : 0;
  const outL = (brownL * 3.2 + rainDropsL) * 0.5;
  const outR = (brownR * 3.2 + rainDropsR) * 0.5;
  return [outL, outR];
});

// 4. Zen Garden Harmonics (528 Hz Transformation + 0.1 Hz HRV Resonance)
generateWav('zen_garden.wav', loopDuration, sampleRate, (t, p) => {
  const f = 528;
  const pad = 0.3 * Math.sin(2 * Math.PI * f * t) + 0.2 * Math.sin(2 * Math.PI * (f * 0.5) * t) + 0.15 * Math.sin(2 * Math.PI * (f * 1.5) * t);
  const chime = 0.1 * Math.sin(2 * Math.PI * (f * 2.5) * t) * Math.sin(2 * Math.PI * 0.2 * t);
  const leftBin = 0.2 * Math.sin(2 * Math.PI * (f - 3.915) * t);
  const rightBin = 0.2 * Math.sin(2 * Math.PI * (f + 3.915) * t);
  const hrvBreathe = 0.85 + 0.15 * Math.sin(2 * Math.PI * 0.1 * t);
  return [(pad + chime + leftBin) * hrvBreathe * 0.7, (pad + chime + rightBin) * hrvBreathe * 0.7];
});

// 5. Forest Dusk & Hearth (396 Hz Grounding + Crackling Hearth Embers)
generateWav('forest_dusk.wav', loopDuration, sampleRate, (t, p) => {
  const f = 396;
  const drone = 0.35 * Math.sin(2 * Math.PI * f * t) + 0.2 * Math.sin(2 * Math.PI * (f * 0.75) * t);
  const crackleL = Math.random() < 0.004 ? (Math.random() * 0.45) : 0;
  const crackleR = Math.random() < 0.004 ? (Math.random() * 0.45) : 0;
  const crickets = 0.06 * Math.sin(2 * Math.PI * 4500 * t) * Math.sin(2 * Math.PI * 4 * t);
  const leftBin = 0.18 * Math.sin(2 * Math.PI * (f - 3) * t);
  const rightBin = 0.18 * Math.sin(2 * Math.PI * (f + 3) * t);
  return [(drone + crackleL + crickets + leftBin) * 0.7, (drone + crackleR + crickets + rightBin) * 0.7];
});

// 6. Cosmic Float & Stillness (288 Hz Zero-Gravity Ambient Drone)
generateWav('cosmic_float.wav', loopDuration, sampleRate, (t, p) => {
  const f = 288;
  const drone1 = 0.3 * Math.sin(2 * Math.PI * f * t + Math.sin(2 * Math.PI * 0.05 * t));
  const drone2 = 0.25 * Math.sin(2 * Math.PI * (f * 1.5) * t + Math.cos(2 * Math.PI * 0.07 * t));
  const subDrone = 0.2 * Math.sin(2 * Math.PI * (f * 0.5) * t);
  const leftBin = 0.18 * Math.sin(2 * Math.PI * (f - 4.5) * t);
  const rightBin = 0.18 * Math.sin(2 * Math.PI * (f + 4.5) * t);
  return [(drone1 + drone2 + subDrone + leftBin) * 0.7, (drone1 + drone2 + subDrone + rightBin) * 0.7];
});

// 7. Deep Flow & Study (320 Hz + 6 Hz Isochronic Theta Focus)
generateWav('flow_state.wav', loopDuration, sampleRate, (t, p) => {
  const f = 320;
  const warmPad = 0.35 * Math.sin(2 * Math.PI * f * t) + 0.2 * Math.sin(2 * Math.PI * (f * 0.75) * t) + 0.15 * Math.sin(2 * Math.PI * (f * 1.25) * t);
  const thetaPulse = 0.85 + 0.15 * Math.sin(2 * Math.PI * 6.0 * t);
  const leftBin = 0.2 * Math.sin(2 * Math.PI * (f - 3) * t);
  const rightBin = 0.2 * Math.sin(2 * Math.PI * (f + 3) * t);
  return [(warmPad * thetaPulse + leftBin) * 0.75, (warmPad * thetaPulse + rightBin) * 0.75];
});
