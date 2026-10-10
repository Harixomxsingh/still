import TrackPlayer, { Event } from 'react-native-track-player';

let isServiceRegistered = false;
let activeWebview = null;
let lastDispatchedIndex = -1;

export function setMediaBridgeWebview(ref) {
  activeWebview = ref;
  global.__stillWebviewRef = ref;
  console.log('🔗 [MEDIA_BRIDGE] Active WebView ref registered');
}

export function getMediaBridgeWebview() {
  return activeWebview || global.__stillWebviewRef || null;
}

export function setLastDispatchedTrackIndex(index) {
  lastDispatchedIndex = index;
}

function dispatchToWebView(script) {
  try {
    const wv = getMediaBridgeWebview();
    if (wv && typeof wv.injectJavaScript === 'function') {
      console.log('📲 [MEDIA_BRIDGE] Dispatching script to WebView:', script);
      wv.injectJavaScript(`(function() {
        try {
          ${script}
        } catch (err) {
          console.error('WebView execution error:', err);
        }
      })(); true;`);
    } else {
      console.warn('⚠️ [MEDIA_BRIDGE] WebView ref not available for dispatch:', script);
    }
  } catch (e) {
    console.error('❌ [MEDIA_BRIDGE] dispatchToWebView error:', e);
  }
}

/**
 * Native Android Playback Service for react-native-track-player.
 * Handles OS-level remote events from the Android System Media notification,
 * lock screen controls, Bluetooth headsets, Android Auto, and hardware buttons.
 * Pure fundamental controls: Previous (⏮), Play (▶), Pause (⏸), Next (⏭).
 */
export async function TrackPlayerService() {
  if (isServiceRegistered) {
    console.log('🎧 TrackPlayerService listeners already registered');
    return;
  }
  isServiceRegistered = true;
  console.log('🎧 Registering TrackPlayerService OS remote media event listeners...');

  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    console.log('▶ [REMOTE_PLAY] Received from notification/lockscreen');
    try {
      await TrackPlayer.play();
    } catch (e) {
      console.log('TrackPlayer play error:', e);
    }
    dispatchToWebView('if (window.__mediaSetPlaying) { window.__mediaSetPlaying(true); } else if (window.__mediaTogglePlay) { window.__mediaTogglePlay(); }');
  });

  TrackPlayer.addEventListener(Event.RemotePause, async () => {
    console.log('⏸ [REMOTE_PAUSE] Received from notification/lockscreen');
    try {
      await TrackPlayer.pause();
    } catch (e) {
      console.log('TrackPlayer pause error:', e);
    }
    dispatchToWebView('if (window.__mediaSetPlaying) { window.__mediaSetPlaying(false); } else if (window.__mediaTogglePlay) { window.__mediaTogglePlay(); }');
  });

  TrackPlayer.addEventListener(Event.RemoteStop, async () => {
    console.log('⏹ [REMOTE_STOP] Received from notification/lockscreen');
    try {
      await TrackPlayer.stop();
    } catch (e) {
      console.log('TrackPlayer stop error:', e);
    }
    dispatchToWebView('if (window.__mediaSetPlaying) { window.__mediaSetPlaying(false); }');
  });

  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    console.log('⏭ [REMOTE_NEXT] Received from notification/lockscreen');
    try {
      await TrackPlayer.skipToNext();
    } catch (e) {
      console.log('TrackPlayer skipToNext error:', e);
    }
    dispatchToWebView('if (window.__mediaNextTrack) { window.__mediaNextTrack(); }');
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    console.log('⏮ [REMOTE_PREVIOUS] Received from notification/lockscreen');
    try {
      await TrackPlayer.skipToPrevious();
    } catch (e) {
      console.log('TrackPlayer skipToPrevious error:', e);
    }
    dispatchToWebView('if (window.__mediaPrevTrack) { window.__mediaPrevTrack(); }');
  });

  TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
    if (typeof event?.index === 'number' && event.index >= 0) {
      if (event.index !== lastDispatchedIndex) {
        lastDispatchedIndex = event.index;
        console.log('🎵 [TRACK_CHANGED] Active track index:', event.index);
        dispatchToWebView(`if (window.__mediaSelectTrack) { window.__mediaSelectTrack(${event.index}); }`);
      }
    }
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, async (event) => {
    if (event?.position != null) {
      console.log('⏩ [REMOTE_SEEK] Position:', event.position);
      try {
        await TrackPlayer.seekTo(event.position);
      } catch (e) {}
      dispatchToWebView(`if (window.__syncSanctuarySeconds) { window.__syncSanctuarySeconds(${Math.round(event.position)}); }`);
    }
  });

  TrackPlayer.addEventListener(Event.RemoteDuck, async (event) => {
    try {
      if (event.paused) {
        await TrackPlayer.pause();
        dispatchToWebView('if (window.__mediaSetPlaying) { window.__mediaSetPlaying(false); }');
      } else if (event.ducking) {
        await TrackPlayer.setVolume(0.3);
      } else {
        await TrackPlayer.setVolume(1.0);
      }
    } catch (e) {
      console.log('TrackPlayer remote duck error:', e);
    }
  });
}
