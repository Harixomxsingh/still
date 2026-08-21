import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BackgroundAudioService } from './src/audio/BackgroundAudioService';
import { AudioEngineBridge } from './src/audio/AudioEngineBridge';
import { SOUNDSCAPES, THEMES } from './src/shared/soundscapes';
import { CALM_QUOTES } from './src/shared/quotes';

import { MobileWelcomeModal } from './src/components/MobileWelcomeModal';
import { MobileHomeGateway } from './src/components/MobileHomeGateway';
import { MobileMonolithPlayer } from './src/components/MobileMonolithPlayer';
import { MobileStemMixerModal } from './src/components/MobileStemMixerModal';
import { MobileSoundscapeModal } from './src/components/MobileSoundscapeModal';
import { MobileAboutModal } from './src/components/MobileAboutModal';

export default function App() {
  const bridgeRef = useRef(null);

  // Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [currentThemeIdx, setCurrentThemeIdx] = useState(0);

  // 3-Stage Flow State:
  // Stage 1: isNoteOpen (Top Welcome Card)
  // Stage 2: isHomeOpen (Serene Living Gateway)
  // Stage 3: Monolith Player
  const [isNoteOpen, setIsNoteOpen] = useState(true);
  const [isHomeOpen, setIsHomeOpen] = useState(true);

  // Sleep Timer Countdown (in seconds)
  const [sleepTimerSeconds, setSleepTimerSeconds] = useState(null);

  // Active Listening Session Tracker (30-min quote milestone bonus)
  const [activeListeningSeconds, setActiveListeningSeconds] = useState(0);

  // Stem Mixer Levels
  const [stems, setStems] = useState({
    pads: 0.8,
    brownian: 0.4,
    rain: 0.2,
    binaural: 0.4,
    piano: 0.5
  });

  // Modal Views
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isMixerOpen, setIsMixerOpen] = useState(false);

  // Initialize native background audio service
  useEffect(() => {
    BackgroundAudioService.init();

    // 2-minute fallback auto-dismiss for Welcome Card
    const timer = setTimeout(() => {
      setIsNoteOpen(false);
    }, 120000);

    return () => clearTimeout(timer);
  }, []);

  // Sleep Timer Countdown Loop
  useEffect(() => {
    let interval;
    if (sleepTimerSeconds !== null && sleepTimerSeconds > 0 && isPlaying) {
      interval = setInterval(() => {
        setSleepTimerSeconds((prev) => {
          if (prev <= 1) {
            bridgeRef.current?.pause();
            setIsPlaying(false);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sleepTimerSeconds, isPlaying]);

  // Active Listening Tracker Loop
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveListeningSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Daily Quote + 30-Min Milestone Bonus
  const baseDailyIndex = Math.floor(Date.now() / 86400000) % CALM_QUOTES.length;
  const milestoneOffset = Math.floor(activeListeningSeconds / 1800); // changes every 30 mins
  const currentQuote = CALM_QUOTES[(baseDailyIndex + milestoneOffset) % CALM_QUOTES.length];

  const activeTrack = SOUNDSCAPES[currentTrackIndex];
  const activeTheme = THEMES[currentThemeIdx];

  // Stage Transitions
  const handleEnterCalmSpace = () => {
    setIsNoteOpen(false);
    setIsHomeOpen(false);
    bridgeRef.current?.play(activeTrack);
    BackgroundAudioService.startNativeSession();
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (isHomeOpen) {
      handleEnterCalmSpace();
      return;
    }

    if (!isPlaying) {
      bridgeRef.current?.play(activeTrack);
      BackgroundAudioService.startNativeSession();
      setIsPlaying(true);
    } else {
      bridgeRef.current?.pause();
      BackgroundAudioService.pauseNativeSession();
      setIsPlaying(false);
    }
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % SOUNDSCAPES.length;
    setCurrentTrackIndex(nextIdx);
    if (isPlaying) {
      bridgeRef.current?.play(SOUNDSCAPES[nextIdx]);
      BackgroundAudioService.startNativeSession();
    }
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + SOUNDSCAPES.length) % SOUNDSCAPES.length;
    setCurrentTrackIndex(prevIdx);
    if (isPlaying) {
      bridgeRef.current?.play(SOUNDSCAPES[prevIdx]);
      BackgroundAudioService.startNativeSession();
    }
  };

  const handleSelectTrack = (idx) => {
    setCurrentTrackIndex(idx);
    if (isHomeOpen) setIsHomeOpen(false);
    bridgeRef.current?.play(SOUNDSCAPES[idx]);
    BackgroundAudioService.startNativeSession();
    setIsPlaying(true);
  };

  const handleStemChange = (stem, value) => {
    setStems((prev) => ({ ...prev, [stem]: value }));
    bridgeRef.current?.setStem(stem, value);
  };

  const handleResetStems = () => {
    const def = { pads: 0.8, brownian: 0.4, rain: 0.2, binaural: 0.4, piano: 0.5 };
    setStems(def);
    Object.entries(def).forEach(([k, v]) => bridgeRef.current?.setStem(k, v));
  };

  const handleCycleTimer = () => {
    try { Haptics.selectionAsync(); } catch(e) {}
    const options = [null, 15, 30, 45, 60];
    const curMins = sleepTimerSeconds !== null ? Math.ceil(sleepTimerSeconds / 60) : null;
    let curIdx = 0;
    if (curMins !== null) {
      const idx = options.indexOf(curMins);
      curIdx = idx >= 0 ? idx : 0;
    }
    const nextVal = options[(curIdx + 1) % options.length];
    setSleepTimerSeconds(nextVal ? nextVal * 60 : null);
  };

  const handleCycleTheme = () => {
    try { Haptics.selectionAsync(); } catch(e) {}
    setCurrentThemeIdx((prev) => (prev + 1) % THEMES.length);
  };

  return (
    <View style={[styles.appContainer, { backgroundColor: activeTheme?.bg || '#05070d' }]}>
      <StatusBar barStyle="light-content" backgroundColor={activeTheme?.bg || '#05070d'} />

      {/* Hidden Procedural Web Audio Engine Bridge */}
      <AudioEngineBridge ref={bridgeRef} />

      {/* Stage 1: Welcome Greeting Modal */}
      <MobileWelcomeModal 
        visible={isNoteOpen} 
        onClose={() => setIsNoteOpen(false)} 
      />

      {/* Stage 2: Serene Living Gateway Screen */}
      {isHomeOpen ? (
        <MobileHomeGateway 
          onEnter={handleEnterCalmSpace}
          onOpenAbout={() => setIsAboutOpen(true)}
        />
      ) : (
        /* Stage 3: Monolith Player Console */
        <MobileMonolithPlayer
          track={activeTrack}
          quote={currentQuote}
          isPlaying={isPlaying}
          sleepTimer={sleepTimerSeconds}
          theme={THEMES[currentThemeIdx]}
          onTogglePlay={handleTogglePlay}
          onNext={handleNextTrack}
          onPrev={handlePrevTrack}
          onCycleTimer={handleCycleTimer}
          onCycleTheme={handleCycleTheme}
          onOpenLibrary={() => setIsLibraryOpen(true)}
          onOpenMixer={() => setIsMixerOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenNote={() => setIsNoteOpen(true)}
        />
      )}

      {/* Soundscape Library Modal */}
      <MobileSoundscapeModal
        visible={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        currentIndex={currentTrackIndex}
        isPlaying={isPlaying}
        onSelect={handleSelectTrack}
        theme={activeTheme}
      />

      {/* Stem Layer Mixer Modal */}
      <MobileStemMixerModal
        visible={isMixerOpen}
        onClose={() => setIsMixerOpen(false)}
        stems={stems}
        onStemChange={handleStemChange}
        onResetStems={handleResetStems}
        theme={activeTheme}
      />

      {/* About & Science Modal */}
      <MobileAboutModal
        visible={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        theme={activeTheme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#05070d'
  }
});
