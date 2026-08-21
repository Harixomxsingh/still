import React, { useState, useEffect, useRef } from 'react';
import { AudioEngine } from './engine/AudioEngine';
import { SOUNDSCAPES, THEMES } from '../../shared/soundscapes';
import { CALM_QUOTES } from '../../shared/quotes';
import { HomeGateway } from './components/HomeGateway';
import { MonolithPlayer } from './components/MonolithPlayer';
import { StemMixer } from './components/StemMixer';
import { SoundscapeModal } from './components/SoundscapeModal';
import { AboutModal } from './components/AboutModal';
import { WelcomeCard } from './components/WelcomeCard';
import { DownloadModal } from './components/DownloadModal';

export const App = () => {
  const engineRef = useRef(null);
  const canvasRef = useRef(null);

  // Core Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [sleepTimerSeconds, setSleepTimerSeconds] = useState(null);
  const [currentThemeIdx, setCurrentThemeIdx] = useState(0);

  // Sleep Timer Live Countdown Loop
  useEffect(() => {
    let timerInterval;
    if (sleepTimerSeconds !== null && sleepTimerSeconds > 0 && isPlaying) {
      timerInterval = setInterval(() => {
        setSleepTimerSeconds((prev) => {
          if (prev <= 1) {
            // Timer expired! Smooth fadeout and pause
            if (engineRef.current) engineRef.current.pause();
            setIsPlaying(false);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [sleepTimerSeconds, isPlaying]);

  // Active Listening Session Tracker (for 30-min quote milestone bonus shuffle)
  const [activeListeningSeconds, setActiveListeningSeconds] = useState(0);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveListeningSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Daily Quote + 30-Minute Listening Milestone Bonus
  const baseDailyIndex = Math.floor(Date.now() / 86400000) % CALM_QUOTES.length;
  const milestoneOffset = Math.floor(activeListeningSeconds / 1800); // 1800s = 30 minutes
  const currentQuote = CALM_QUOTES[(baseDailyIndex + milestoneOffset) % CALM_QUOTES.length];

  // 3-Stage Arrival Flow:
  // Stage 1: isNoteOpen (Top Greeting Card)
  // Stage 2: isHomeOpen (Home Gateway from screenshot)
  // Stage 3: Monolith Player (Active Audio Console)
  const [isNoteOpen, setIsNoteOpen] = useState(true);
  const [isHomeOpen, setIsHomeOpen] = useState(true);

  // Stems Customizer State
  const [stems, setStems] = useState({
    pads: 0.8,
    brownian: 0.4,
    rain: 0.2,
    binaural: 0.4,
    piano: 0.5
  });

  // Modals
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isMixerOpen, setIsMixerOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  // Initialize Audio Engine
  useEffect(() => {
    engineRef.current = new AudioEngine();

    // 2-minute fallback auto-dismiss for Welcome card
    const timer = setTimeout(() => {
      setIsNoteOpen(false);
    }, 120000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Sync theme attribute on <body> and notify native shell
  useEffect(() => {
    const theme = THEMES[currentThemeIdx];
    document.body.setAttribute('data-theme', theme.id);
    try {
      if (window.ReactNativeWebView && theme) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ 
          type: 'THEME_CHANGE', 
          bg: theme.bg 
        }));
      }
    } catch (e) {}
  }, [currentThemeIdx]);

  // Notify native shell on playback state for background lock-screen audio
  useEffect(() => {
    try {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ 
          type: isPlaying ? 'AUDIO_PLAY' : 'AUDIO_PAUSE' 
        }));
      }
    } catch (e) {}
  }, [isPlaying]);

  // Ambient floating particle canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.6 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.25
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${p.alpha})`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (isHomeOpen) {
            handleEnterCalmSpace();
          } else {
            handleTogglePlay();
          }
          break;
        case 'KeyN':
          handleNextTrack();
          break;
        case 'KeyP':
          handlePrevTrack();
          break;
        case 'KeyM':
          handleToggleMute();
          break;
        case 'KeyF':
          handleToggleFullScreen();
          break;
        case 'KeyT':
          handleCycleTheme();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Stage Transitions
  const handleEnterCalmSpace = () => {
    setIsNoteOpen(false);
    setIsHomeOpen(false);
    if (!engineRef.current) return;

    engineRef.current.isPlaying = true;
    engineRef.current.applySoundscape(SOUNDSCAPES[currentTrackIndex], 2.2);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (isHomeOpen) {
      handleEnterCalmSpace();
      return;
    }

    if (!engineRef.current) return;

    if (!isPlaying) {
      engineRef.current.isPlaying = true;
      engineRef.current.applySoundscape(SOUNDSCAPES[currentTrackIndex], 2.0);
      setIsPlaying(true);
    } else {
      engineRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % SOUNDSCAPES.length;
    setCurrentTrackIndex(nextIdx);
    if (isPlaying && engineRef.current) {
      engineRef.current.applySoundscape(SOUNDSCAPES[nextIdx], 3.0);
    }
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + SOUNDSCAPES.length) % SOUNDSCAPES.length;
    setCurrentTrackIndex(prevIdx);
    if (isPlaying && engineRef.current) {
      engineRef.current.applySoundscape(SOUNDSCAPES[prevIdx], 3.0);
    }
  };

  const handleSelectTrack = (idx) => {
    setCurrentTrackIndex(idx);
    if (isHomeOpen) {
      setIsHomeOpen(false);
    }
    if (engineRef.current) {
      if (!isPlaying) {
        engineRef.current.isPlaying = true;
        setIsPlaying(true);
      }
      engineRef.current.applySoundscape(SOUNDSCAPES[idx], 2.5);
    }
  };

  const handleVolumeChange = (val) => {
    setVolume(val);
    if (val > 0) setIsMuted(false);
    if (engineRef.current) {
      engineRef.current.setMasterVolume(val);
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (engineRef.current) engineRef.current.setMasterVolume(volume || 0.75);
    } else {
      setIsMuted(true);
      if (engineRef.current) engineRef.current.setMasterVolume(0.0001);
    }
  };

  // Stem Mixer Handlers
  const handleStemChange = (stemKey, value) => {
    setStems((prev) => ({ ...prev, [stemKey]: value }));
    if (engineRef.current) {
      engineRef.current.setStemGain(stemKey, value);
    }
  };

  const handleResetStems = () => {
    const defaultVals = { pads: 0.8, brownian: 0.4, rain: 0.2, binaural: 0.4, piano: 0.5 };
    setStems(defaultVals);
    if (engineRef.current) {
      Object.entries(defaultVals).forEach(([k, v]) => engineRef.current.setStemGain(k, v));
    }
  };

  // Sleep Timer Handler (Reverse Countdown mm:ss)
  const handleCycleTimer = () => {
    const minutesOptions = [null, 15, 30, 45, 60];
    const currentMins = sleepTimerSeconds !== null ? Math.ceil(sleepTimerSeconds / 60) : null;
    
    let curIdx = 0;
    if (currentMins !== null) {
      const idx = minutesOptions.indexOf(currentMins);
      curIdx = idx >= 0 ? idx : 0;
    }
    
    const nextOption = minutesOptions[(curIdx + 1) % minutesOptions.length];
    if (nextOption === null) {
      setSleepTimerSeconds(null);
    } else {
      setSleepTimerSeconds(nextOption * 60);
    }
  };

  const handleCycleTheme = () => {
    setCurrentThemeIdx((prev) => (prev + 1) % THEMES.length);
  };

  const handleToggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
    }
  };

  const activeTrack = SOUNDSCAPES[currentTrackIndex];

  return (
    <>
      {/* Floating Particle Canvas */}
      <canvas ref={canvasRef} className="ambient-canvas" />

      {/* Stage 1: Welcome Greeting Note Card */}
      <WelcomeCard 
        isOpen={isNoteOpen} 
        onClose={() => setIsNoteOpen(false)} 
      />

      {/* Stage 2: Serene Home Gateway Screen */}
      <HomeGateway 
        isVisible={isHomeOpen} 
        onEnter={handleEnterCalmSpace} 
        onOpenAbout={() => setIsAboutOpen(true)} 
        onOpenDownload={() => setIsDownloadOpen(true)}
      />

      {/* Stage 3: Main Active Monolith Nexus Player */}
      {!isHomeOpen && (
        <MonolithPlayer
          track={activeTrack}
          quote={currentQuote}
          isPlaying={isPlaying}
          volume={volume}
          isMuted={isMuted}
          sleepTimer={sleepTimerSeconds}
          theme={THEMES[currentThemeIdx]}
          onTogglePlay={handleTogglePlay}
          onNext={handleNextTrack}
          onPrev={handlePrevTrack}
          onVolumeChange={handleVolumeChange}
          onToggleMute={handleToggleMute}
          onCycleTimer={handleCycleTimer}
          onCycleTheme={handleCycleTheme}
          onToggleFullScreen={handleToggleFullScreen}
          onOpenLibrary={() => setIsLibraryOpen(true)}
          onOpenMixer={() => setIsMixerOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenNote={() => setIsNoteOpen(true)}
          onOpenDownload={() => setIsDownloadOpen(true)}
        />
      )}

      {/* Soundscape Library Modal */}
      <SoundscapeModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        currentTrackIndex={currentTrackIndex}
        isPlaying={isPlaying}
        onSelectTrack={handleSelectTrack}
      />

      {/* Audio Stem Layer Mixer Drawer */}
      <StemMixer
        isOpen={isMixerOpen}
        onClose={() => setIsMixerOpen(false)}
        stems={stems}
        onStemChange={handleStemChange}
        onResetStems={handleResetStems}
      />

      {/* About & Science Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Download Android App Modal */}
      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />

      {/* Discrete Bottom-Right Version Watermark */}
      <div 
        style={{
          position: 'fixed',
          bottom: '8px',
          right: '12px',
          fontSize: '9.5px',
          fontFamily: 'monospace',
          color: '#334155',
          opacity: 0.35,
          pointerEvents: 'none',
          zIndex: 9999,
          letterSpacing: '0.04em',
          userSelect: 'none'
        }}
      >
        v2.0.0
      </div>
    </>
  );
};
export default App;
