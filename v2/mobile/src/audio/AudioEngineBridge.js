import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const AUDIO_SYNTH_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Still Audio Engine</title>
</head>
<body style="background:transparent; margin:0; padding:0;">
<script>
  let ctx = null;
  let masterGain = null;
  let isPlaying = false;
  let currentTrack = null;

  let padMasterGain = null;
  let brownGain = null;
  let rainGain = null;
  let binauralGain = null;
  let pianoMasterGain = null;

  let padNodes = [];
  let binauralLeft = null;
  let binauralRight = null;
  let brownNoiseNode = null;
  let rainNoiseNode = null;
  let lfoFilter = null;
  let lfoOsc = null;
  let pianoTimeout = null;

  const stems = { pads: 0.8, brownian: 0.4, rain: 0.2, binaural: 0.4, piano: 0.5 };

  function logToNative(msg) {
    try {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ log: msg }));
      }
    } catch(e) {}
  }

  function initAudio() {
    if (ctx) {
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioContextClass();

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.75, ctx.currentTime);
      masterGain.connect(ctx.destination);

      padMasterGain = ctx.createGain();
      padMasterGain.gain.setValueAtTime(stems.pads, ctx.currentTime);
      padMasterGain.connect(masterGain);

      pianoMasterGain = ctx.createGain();
      pianoMasterGain.gain.setValueAtTime(stems.piano, ctx.currentTime);
      pianoMasterGain.connect(masterGain);

      setupBrownNoise();
      setupRainNoise();
      setupBinaural();
      setupPadFilter();
      startGenerativePiano();
      logToNative('AudioContext initialized successfully');
    } catch(err) {
      logToNative('Error initializing AudioContext: ' + err.message);
    }
  }

  function setupBrownNoise() {
    try {
      const bufferSize = ctx.sampleRate * 4;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
      brownNoiseNode = ctx.createBufferSource();
      brownNoiseNode.buffer = noiseBuffer;
      brownNoiseNode.loop = true;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(260, ctx.currentTime);

      brownGain = ctx.createGain();
      brownGain.gain.setValueAtTime(0.001, ctx.currentTime);

      brownNoiseNode.connect(lowpass);
      lowpass.connect(brownGain);
      brownGain.connect(masterGain);
      brownNoiseNode.start(0);
    } catch(e) {}
  }

  function setupRainNoise() {
    try {
      const bufferSize = ctx.sampleRate * 3;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

      rainNoiseNode = ctx.createBufferSource();
      rainNoiseNode.buffer = noiseBuffer;
      rainNoiseNode.loop = true;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1400, ctx.currentTime);
      bandpass.Q.setValueAtTime(0.7, ctx.currentTime);

      rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(0.001, ctx.currentTime);

      rainNoiseNode.connect(bandpass);
      bandpass.connect(rainGain);
      rainGain.connect(masterGain);
      rainNoiseNode.start(0);
    } catch(e) {}
  }

  function setupBinaural() {
    try {
      const merger = ctx.createChannelMerger(2);
      binauralLeft = ctx.createOscillator();
      binauralRight = ctx.createOscillator();
      binauralLeft.type = 'sine';
      binauralRight.type = 'sine';

      const leftGain = ctx.createGain();
      const rightGain = ctx.createGain();
      leftGain.gain.value = 0.5;
      rightGain.gain.value = 0.5;

      binauralLeft.connect(leftGain);
      binauralRight.connect(rightGain);
      leftGain.connect(merger, 0, 0);
      rightGain.connect(merger, 0, 1);

      binauralGain = ctx.createGain();
      binauralGain.gain.setValueAtTime(0.001, ctx.currentTime);
      merger.connect(binauralGain);
      binauralGain.connect(masterGain);

      binauralLeft.start(0);
      binauralRight.start(0);
    } catch(e) {}
  }

  function setupPadFilter() {
    try {
      lfoFilter = ctx.createBiquadFilter();
      lfoFilter.type = 'lowpass';
      lfoFilter.frequency.setValueAtTime(550, ctx.currentTime);
      lfoFilter.Q.setValueAtTime(2.0, ctx.currentTime);

      lfoOsc = ctx.createOscillator();
      lfoOsc.type = 'sine';
      lfoOsc.frequency.setValueAtTime(0.1, ctx.currentTime); // 0.1 Hz breathing

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(250, ctx.currentTime);
      lfoOsc.connect(lfoGain);
      lfoGain.connect(lfoFilter.frequency);
      lfoOsc.start(0);

      lfoFilter.connect(padMasterGain);
    } catch(e) {}
  }

  function startGenerativePiano() {
    const notes = [216, 256, 288, 324, 384, 432, 512, 576, 648];
    const playNote = () => {
      if (isPlaying && ctx && stems.piano > 0.05) {
        try {
          const freq = notes[Math.floor(Math.random() * notes.length)];
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          g.gain.setValueAtTime(0.0001, now);
          g.gain.linearRampToValueAtTime(0.08 * stems.piano, now + 0.08);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);
          osc.connect(g);
          g.connect(pianoMasterGain);
          osc.start(now);
          osc.stop(now + 4.8);
        } catch(e) {}
      }
      pianoTimeout = setTimeout(playNote, 3500 + Math.random() * 5500);
    };
    pianoTimeout = setTimeout(playNote, 4000);
  }

  function applyTrack(track) {
    initAudio();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    currentTrack = track;
    const now = ctx.currentTime;

    const carrier = track.baseFreq || 432;
    const diff = track.binauralDiff || 10.0;
    binauralLeft.frequency.setTargetAtTime(carrier, now, 1.2);
    binauralRight.frequency.setTargetAtTime(carrier + diff, now, 1.2);

    const effBrown = (track.defaultStems.brownian || 0.4) * stems.brownian;
    const effRain = (track.defaultStems.rain || 0.2) * stems.rain;
    const effBin = (track.defaultStems.binaural || 0.4) * stems.binaural;

    brownGain.gain.setTargetAtTime(isPlaying ? effBrown : 0.001, now, 1.0);
    rainGain.gain.setTargetAtTime(isPlaying ? effRain : 0.001, now, 1.0);
    binauralGain.gain.setTargetAtTime(isPlaying ? effBin : 0.001, now, 1.0);

    padNodes.forEach(node => {
      try {
        node.gainNode.gain.setTargetAtTime(0.0001, now, 0.8);
        setTimeout(() => { node.osc.stop(); node.osc.disconnect(); }, 1500);
      } catch(e) {}
    });
    padNodes = [];

    if (isPlaying && track.chordNotes) {
      track.chordNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gNode = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gNode.gain.setValueAtTime(0.0001, now);
        const target = ((track.defaultStems.pads || 0.8) / track.chordNotes.length) * stems.pads;
        gNode.gain.setTargetAtTime(target, now + 0.2, 1.0);
        osc.connect(gNode);
        gNode.connect(lfoFilter);
        osc.start(now);
        padNodes.push({ osc, gainNode: gNode });
      });
    }

    logToNative('Playing track: ' + track.title);
  }

  // Unified Message Handler
  window.handleAudioMessage = function(data) {
    if (!data) return;
    initAudio();

    if (data.type === 'PLAY') {
      isPlaying = true;
      if (data.track) applyTrack(data.track);
      else if (currentTrack) applyTrack(currentTrack);
    } else if (data.type === 'PAUSE') {
      isPlaying = false;
      if (ctx) {
        const now = ctx.currentTime;
        if (brownGain) brownGain.gain.setTargetAtTime(0.001, now, 0.8);
        if (rainGain) rainGain.gain.setTargetAtTime(0.001, now, 0.8);
        if (binauralGain) binauralGain.gain.setTargetAtTime(0.001, now, 0.8);
        padNodes.forEach(n => {
          try { n.gainNode.gain.setTargetAtTime(0.0001, now, 0.8); } catch(e) {}
        });
      }
      logToNative('Playback paused');
    } else if (data.type === 'SET_TRACK') {
      applyTrack(data.track);
    } else if (data.type === 'SET_STEM') {
      stems[data.stem] = data.value;
      if (isPlaying && currentTrack) applyTrack(currentTrack);
    } else if (data.type === 'SET_VOLUME') {
      if (masterGain && ctx) masterGain.gain.setTargetAtTime(data.value, ctx.currentTime, 0.05);
    }
  };

  // Support postMessage listeners
  window.addEventListener('message', function(event) {
    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      window.handleAudioMessage(data);
    } catch(e) {}
  });

  document.addEventListener('message', function(event) {
    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      window.handleAudioMessage(data);
    } catch(e) {}
  });
</script>
</body>
</html>
`;

export const AudioEngineBridge = forwardRef((props, ref) => {
  const webViewRef = useRef(null);

  const sendMessage = (msg) => {
    try {
      const str = JSON.stringify(msg);
      // Method 1: direct injection (100% reliable on Android)
      webViewRef.current?.injectJavaScript(`window.handleAudioMessage(${str}); true;`);
      // Method 2: postMessage
      webViewRef.current?.postMessage(str);
    } catch(e) {
      console.log('Bridge error:', e);
    }
  };

  useImperativeHandle(ref, () => ({
    play: (track) => {
      sendMessage({ type: 'PLAY', track });
    },
    pause: () => {
      sendMessage({ type: 'PAUSE' });
    },
    setTrack: (track) => {
      sendMessage({ type: 'SET_TRACK', track });
    },
    setStem: (stem, value) => {
      sendMessage({ type: 'SET_STEM', stem, value });
    },
    setVolume: (value) => {
      sendMessage({ type: 'SET_VOLUME', value });
    }
  }));

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.log) {
        console.log('🔊 [AudioEngine]:', data.log);
      }
    } catch(e) {}
  };

  return (
    <View style={styles.bridgeContainer} pointerEvents="none">
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: AUDIO_SYNTH_HTML }}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="always"
        onMessage={handleMessage}
        style={styles.webView}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  bridgeContainer: {
    width: 2,
    height: 2,
    position: 'absolute',
    bottom: 0,
    left: 0,
    opacity: 0.01,
    overflow: 'hidden'
  },
  webView: {
    width: 2,
    height: 2,
    backgroundColor: 'transparent'
  }
});
