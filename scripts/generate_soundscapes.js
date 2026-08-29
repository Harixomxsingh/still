const fs = require('fs');
const path = require('path');

// Generate a 16-bit Stereo PCM WAV file with seamless loop points
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
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
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
  let brownL = 0.0;
  let brownR = 0.0;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const progress = i / numSamples;
    // Crossfade envelope for 100% seamless looping
    let loopFade = 1.0;
    const fadeLen = 0.15; // 15% fade margin
    if (progress < fadeLen) {
      loopFade = 0.5 - 0.5 * Math.cos((progress / fadeLen) * Math.PI);
    } else if (progress > (1 - fadeLen)) {
      loopFade = 0.5 - 0.5 * Math.cos(((1 - progress) / fadeLen) * Math.PI);
    }

    const [leftSample, rightSample] = audioFn(t, loopFade, i);

    const intLeft = Math.max(-32767, Math.min(32767, Math.floor(leftSample * 32767)));
    const intRight = Math.max(-32767, Math.min(32767, Math.floor(rightSample * 32767)));

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
const loopDuration = 12.0; // 12-second seamless continuous loop

// 1. Alpha Wave Sanctuary (432 Hz Solfeggio + 10 Hz Alpha Binaural)
generateWav('alpha_sanctuary.wav', loopDuration, sampleRate, (t, fade) => {
  const f = 432;
  const pad = 0.3 * Math.sin(2 * Math.PI * f * t) + 0.15 * Math.sin(2 * Math.PI * (f / 2) * t) + 0.1 * Math.sin(2 * Math.PI * (f * 1.5) * t);
  const leftBin = 0.25 * Math.sin(2 * Math.PI * (f - 5) * t);
  const rightBin = 0.25 * Math.sin(2 * Math.PI * (f + 5) * t);
  const breathe = 0.8 + 0.2 * Math.sin(2 * Math.PI * 0.1 * t); // 0.1 Hz breathing
  return [(pad + leftBin) * breathe * fade, (pad + rightBin) * breathe * fade];
});

// 2. Deep Delta Sleep (174 Hz + 2.5 Hz Somatic Delta)
generateWav('deep_delta.wav', loopDuration, sampleRate, (t, fade) => {
  const f = 174;
  const sub = 0.4 * Math.sin(2 * Math.PI * (f / 2) * t) + 0.2 * Math.sin(2 * Math.PI * f * t);
  const leftBin = 0.25 * Math.sin(2 * Math.PI * (f - 1.25) * t);
  const rightBin = 0.25 * Math.sin(2 * Math.PI * (f + 1.25) * t);
  const slowWave = 0.85 + 0.15 * Math.sin(2 * Math.PI * 0.08 * t);
  return [(sub + leftBin) * slowWave * fade, (sub + rightBin) * slowWave * fade];
});

// 3. Brownian Rain Shield
let brownStateL = 0;
let brownStateR = 0;
generateWav('brownian_rain.wav', loopDuration, sampleRate, (t, fade) => {
  const whiteL = Math.random() * 2 - 1;
  const whiteR = Math.random() * 2 - 1;
  brownStateL = (brownStateL + 0.02 * whiteL) / 1.02;
  brownStateR = (brownStateR + 0.02 * whiteR) / 1.02;
  const rainL = (Math.random() < 0.005 ? (Math.random() * 0.4) : 0);
  const rainR = (Math.random() < 0.005 ? (Math.random() * 0.4) : 0);
  const outL = (brownStateL * 2.8 + rainL) * 0.5 * fade;
  const outR = (brownStateR * 2.8 + rainR) * 0.5 * fade;
  return [outL, outR];
});

// 4. Theta Deep Focus (256 Hz + 6 Hz Theta)
generateWav('theta_clarity.wav', loopDuration, sampleRate, (t, fade) => {
  const f = 256;
  const pad = 0.3 * Math.sin(2 * Math.PI * f * t) + 0.15 * Math.sin(2 * Math.PI * (f * 1.5) * t);
  const leftBin = 0.25 * Math.sin(2 * Math.PI * (f - 3) * t);
  const rightBin = 0.25 * Math.sin(2 * Math.PI * (f + 3) * t);
  return [(pad + leftBin) * 0.7 * fade, (pad + rightBin) * 0.7 * fade];
});

// 5. Gamma Transcendence (396 Hz + 40 Hz Gamma)
generateWav('gamma_flow.wav', loopDuration, sampleRate, (t, fade) => {
  const f = 396;
  const pad = 0.3 * Math.sin(2 * Math.PI * f * t) + 0.15 * Math.sin(2 * Math.PI * (f / 2) * t);
  const leftBin = 0.25 * Math.sin(2 * Math.PI * (f - 20) * t);
  const rightBin = 0.25 * Math.sin(2 * Math.PI * (f + 20) * t);
  return [(pad + leftBin) * 0.65 * fade, (pad + rightBin) * 0.65 * fade];
});

// 6. Schumann Earth Resonance (108 Hz + 7.83 Hz Pulse)
generateWav('schumann_resonance.wav', loopDuration, sampleRate, (t, fade) => {
  const f = 108;
  const pad = 0.35 * Math.sin(2 * Math.PI * f * t) + 0.2 * Math.sin(2 * Math.PI * (f * 2) * t);
  const leftBin = 0.25 * Math.sin(2 * Math.PI * (f - 3.915) * t);
  const rightBin = 0.25 * Math.sin(2 * Math.PI * (f + 3.915) * t);
  const pulse = 0.8 + 0.2 * Math.sin(2 * Math.PI * 7.83 * t);
  return [(pad + leftBin) * pulse * 0.7 * fade, (pad + rightBin) * pulse * 0.7 * fade];
});

// 7. Solfeggio 528 Hz DNA Repair
generateWav('solfeggio_528.wav', loopDuration, sampleRate, (t, fade) => {
  const f = 528;
  const pad = 0.35 * Math.sin(2 * Math.PI * f * t) + 0.15 * Math.sin(2 * Math.PI * (f / 2) * t) + 0.1 * Math.sin(2 * Math.PI * (f * 1.5) * t);
  return [pad * 0.65 * fade, pad * 0.65 * fade];
});
