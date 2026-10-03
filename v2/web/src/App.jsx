import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AudioEngine } from './engine/AudioEngine';
import { SOUNDSCAPES, THEMES } from '../../shared/soundscapes';
import { CALM_QUOTES } from '../../shared/quotes';
import { MilestoneRewardModal } from './components/MilestoneRewardModal';
import { SettingsModal } from './components/SettingsModal';
import { UpdateModal } from './components/UpdateModal';
import { WisdomCloudSync } from './services/WisdomCloudSync';
import { SanctuarySyncService } from './services/SanctuarySyncService';

export const MILESTONES = [
  { seconds: 300, label: '5m', tier: 1, title: 'The Gateway to Presence', message: '5 minutes of continuous stillness. Your heart rate has slowed and your nervous system is settling.' },
  { seconds: 600, label: '10m', tier: 2, title: 'Alpha Wave Immersion', message: '10 minutes of pure calm. Mental chatter has quieted and your mind is entering deep tranquility.' },
  { seconds: 1200, label: '20m', tier: 3, title: 'Deep Parasympathetic Reset', message: '20 minutes of undisturbed peace. Full physiological recovery and somatic harmony.' },
  { seconds: 2400, label: '40m', tier: 4, title: 'The Flow State Sanctuary', message: '40 minutes of deep focus. Distractions have dissolved and your flow state is locked in.' },
  { seconds: 4800, label: '80m', tier: 5, title: 'Mastery of Stillness', message: '80 minutes of profound presence. A transformative immersion into pure stillness.' },
];
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
  const activeTrack = SOUNDSCAPES[currentTrackIndex];
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

  // Active Listening Session Tracker & Compounding Milestones
  const [activeListeningSeconds, setActiveListeningSeconds] = useState(0);
  const [unlockedMilestone, setUnlockedMilestone] = useState(null);
  const [isMilestoneOpen, setIsMilestoneOpen] = useState(false);
  const [bonusQuoteIndex, setBonusQuoteIndex] = useState(0);

  // Autonomous Compounding Milestone Ladder Computation
  const targetMilestone = useMemo(() => {
    const nextIdx = MILESTONES.findIndex((m) => m.seconds > activeListeningSeconds);
    if (nextIdx === -1) {
      return {
        currentTier: MILESTONES.length,
        totalTiers: MILESTONES.length,
        nextMilestone: null,
        targetSeconds: 4800,
        secondsRemaining: 0,
        progressPercent: 100,
        label: '80m+',
        title: 'Mastery of Stillness',
        formattedRemaining: '00:00'
      };
    }

    const nextMilestone = MILESTONES[nextIdx];
    const prevSeconds = nextIdx === 0 ? 0 : MILESTONES[nextIdx - 1].seconds;
    const targetSeconds = nextMilestone.seconds;
    const secondsRemaining = Math.max(0, targetSeconds - activeListeningSeconds);
    const tierTotalSeconds = targetSeconds - prevSeconds;
    const tierElapsedSeconds = activeListeningSeconds - prevSeconds;
    const progressPercent = Math.min(100, Math.max(0, (tierElapsedSeconds / tierTotalSeconds) * 100));

    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    const formattedRemaining = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;

    return {
      currentTier: nextIdx + 1,
      totalTiers: MILESTONES.length,
      nextMilestone,
      targetSeconds,
      secondsRemaining,
      progressPercent,
      label: nextMilestone.label,
      title: nextMilestone.title,
      formattedRemaining
    };
  }, [activeListeningSeconds]);

  // Daily Habit & Streak Tracking Engine
  const [streakInfo, setStreakInfo] = useState(() => SanctuarySyncService.getStreakInfo());
  const [googleUser, setGoogleUser] = useState(() => SanctuarySyncService.getGoogleUser());

  const handleLinkGoogle = async () => {
    const res = await SanctuarySyncService.linkGoogleAccount();
    if (res.success) {
      setGoogleUser(res.user);
    }
  };

  const handleUnlinkGoogle = () => {
    SanctuarySyncService.unlinkGoogleAccount();
    setGoogleUser(null);
  };

  // Settings & In-App Autonomous Updates
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('Latest release installed');

  // Lifetime Calm Seconds Tracker
  const [lifetimeSeconds, setLifetimeSeconds] = useState(() => {
    try {
      return Number(localStorage.getItem('still_lifetime_seconds') || 0);
    } catch (e) {
      return 0;
    }
  });

  // Notification Sovereignty Preferences
  const [notificationPrefs, setNotificationPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem('still_notif_prefs');
      return saved ? JSON.parse(saved) : {
        milestones: true,
        morning: true,
        midday: true,
        evening: true
      };
    } catch (e) {
      return { milestones: true, morning: true, midday: true, evening: true };
    }
  });

  const handleUpdatePref = (key, value) => {
    const nextPrefs = { ...notificationPrefs, [key]: value };
    setNotificationPrefs(nextPrefs);
    try {
      localStorage.setItem('still_notif_prefs', JSON.stringify(nextPrefs));
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'SET_NOTIFICATION_PREFERENCES',
          preferences: nextPrefs
        }));
      }
    } catch (e) {}
  };

  const handleCheckUpdate = async () => {
    setIsCheckingUpdate(true);
    setUpdateStatus('Checking for new releases...');
    try {
      const res = await fetch('./version.json?_t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        setUpdateInfo(data);
        if (data.version && data.version !== '2.2.0') {
          setUpdateStatus(`New update v${data.version} available!`);
          setIsUpdateModalOpen(true);
        } else {
          setUpdateStatus('You are running the latest version (v2.2.0)');
        }
      } else {
        setUpdateStatus('Latest version installed');
      }
    } catch (e) {
      setUpdateStatus('Up to date');
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const sessionSecondsRef = useRef(0);
  const reachedSetRef = useRef(new Set());
  const bonusQuoteIndexRef = useRef(0);

  // Autonomous Dynamic Master Quotes Library
  const allQuotes = useMemo(() => WisdomCloudSync.getAllQuotes(), [bonusQuoteIndex]);
  const baseDailyIndex = Math.floor(Date.now() / 86400000) % allQuotes.length;
  const currentQuote = allQuotes[(baseDailyIndex + bonusQuoteIndex) % allQuotes.length];

  useEffect(() => {
    // Autonomous Weekly Cloud Wisdom Synchronization
    WisdomCloudSync.syncWeekly();

    // Check if user has seen v2.2.0 update announcement (Mobile App Only)
    try {
      if (isMobileApp) {
        const lastSeenVer = localStorage.getItem('still_last_seen_version');
        if (lastSeenVer !== '2.2.0') {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'APP_UPDATE_AVAILABLE',
              version: '2.2.0',
              title: '✨ Still Sanctuary v2.2.0 Update is Live!',
              body: 'Daily Stillness Streaks, 1-Tap SOS State Rescues, and Cross-Device Sync are now active. Tap to enter your sanctuary.'
            }));
          }

          fetch('./version.json?_t=' + Date.now())
            .then((res) => res.json())
            .then((data) => {
              setUpdateInfo(data);
              setIsUpdateModalOpen(true);
              localStorage.setItem('still_last_seen_version', '2.2.0');
            })
            .catch(() => {});
        }
      }
    } catch (e) {}
  }, []);

  // Quick 1-Tap SOS State Rescue Handler
  const handleSelectSosMode = (rescue) => {
    setIsNoteOpen(false);
    setIsHomeOpen(false);
    setCurrentTrackIndex(rescue.trackIndex);
    if (rescue.sleepTimerSeconds) {
      setSleepTimerSeconds(rescue.sleepTimerSeconds);
    }
    setIsPlaying(true);
    if (engineRef.current) {
      engineRef.current.applySoundscape(SOUNDSCAPES[rescue.trackIndex], 1.2);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        sessionSecondsRef.current += 1;
        const currentSec = sessionSecondsRef.current;
        setActiveListeningSeconds(currentSec);

        // Record listening seconds in SanctuarySyncService
        const stats = SanctuarySyncService.recordListeningSeconds(1);
        setStreakInfo(SanctuarySyncService.getStreakInfo());
        setLifetimeSeconds(stats.lifetimeSeconds);

        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'SYNC_STREAK_STATS',
            streak: stats.streak,
            todaySeconds: stats.todaySeconds,
            lifetimeSeconds: stats.lifetimeSeconds
          }));
        }

        // Check compounding milestones
        const milestone = MILESTONES.find((m) => m.seconds === currentSec);
        if (milestone && !reachedSetRef.current.has(milestone.seconds)) {
          reachedSetRef.current.add(milestone.seconds);
          setUnlockedMilestone(milestone);
          bonusQuoteIndexRef.current += 1;
          setBonusQuoteIndex(bonusQuoteIndexRef.current);

          // Only alert if user enabled milestone celebrations
          if (notificationPrefs.milestones) {
            setIsMilestoneOpen(true);
            engineRef.current?.playCelebrationChime();

            try {
              if (window.ReactNativeWebView) {
                const nextQuote = allQuotes[(baseDailyIndex + bonusQuoteIndexRef.current) % allQuotes.length];
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({
                    type: 'MILESTONE_UNLOCKED',
                    milestone,
                    quote: nextQuote,
                  })
                );
              }
            } catch (e) {}
          }
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, baseDailyIndex, notificationPrefs.milestones, allQuotes]);

  // Detect if running inside native mobile app or standalone PWA
  const isMobileApp = useMemo(() => {
    try {
      if (typeof window === 'undefined') return false;
      const urlParams = new URLSearchParams(window.location.search);
      const hasPlatformParam = urlParams.get('platform') === 'android' || urlParams.get('platform') === 'ios';
      const isReactNative = Boolean(window.ReactNativeWebView);
      const isStandalone = Boolean(
        (window.matchMedia && window.matchMedia('(display-mode: standalone)')?.matches) || 
        window.navigator?.standalone
      );
      return Boolean(hasPlatformParam || isReactNative || isStandalone);
    } catch (e) {
      return false;
    }
  }, []);

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
  // Detect if running inside the React Native mobile shell
  const isNativeApp = typeof window !== 'undefined' && (
    !!window.ReactNativeWebView ||
    window.location.search.includes('platform=android') ||
    window.navigator.userAgent.includes('StillAndroidApp')
  );

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
          type: isPlaying ? 'AUDIO_PLAY' : 'AUDIO_PAUSE',
          track: activeTrack,
          index: currentTrackIndex
        }));
      }
    } catch (e) {}
  }, [isPlaying, activeTrack, currentTrackIndex]);

  // Expose global bridge handlers for native lockscreen notification buttons & 2-way hardware volume sync
  useEffect(() => {
    window.__mediaSetPlaying = (shouldPlay) => {
      if (shouldPlay) {
        if (isHomeOpen) {
          setIsNoteOpen(false);
          setIsHomeOpen(false);
        }
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    };
    window.__mediaTogglePlay = () => {
      if (isHomeOpen) handleEnterCalmSpace();
      else handleTogglePlay();
    };
    window.__mediaNextTrack = () => {
      handleNextTrack();
    };
    window.__mediaSelectTrack = (idx) => {
      if (typeof idx === 'number' && idx >= 0 && idx < SOUNDSCAPES.length) {
        setCurrentTrackIndex(idx);
        if (isHomeOpen) {
          setIsHomeOpen(false);
          setIsNoteOpen(false);
        }
      }
    };
    window.__syncVolume = (deviceVol) => {
      if (typeof deviceVol === 'number' && !isNaN(deviceVol)) {
        const v = Math.max(0, Math.min(1, deviceVol));
        setVolume(v);
        if (v > 0.01) setIsMuted(false);
        else setIsMuted(true);
        if (engineRef.current) engineRef.current.setMasterVolume(v);
      }
    };
    return () => {
      delete window.__mediaTogglePlay;
      delete window.__mediaNextTrack;
      delete window.__mediaSelectTrack;
      delete window.__syncVolume;
    };
  }, [isHomeOpen, isPlaying, currentTrackIndex]);

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
      engineRef.current.resume();
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

  // System Lock Screen and Notification Shade Media Controls (Android & iOS)
  useEffect(() => {
    try {
      if (typeof window === 'undefined' || !window.navigator || !('mediaSession' in window.navigator)) return;

      if (window.MediaMetadata && activeTrack) {
        window.navigator.mediaSession.metadata = new window.MediaMetadata({
          title: activeTrack.title || 'Still',
          artist: 'Still • by Hari',
          album: activeTrack.science || 'Calm Space',
          artwork: [
            { src: 'https://harixomxsingh.github.io/still/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'https://harixomxsingh.github.io/still/icon-512.png', sizes: '512x512', type: 'image/png' }
          ]
        });
      }

      window.navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

      const playHandler = () => {
        if (isHomeOpen) handleEnterCalmSpace();
        else handleTogglePlay();
      };
      const pauseHandler = () => {
        handleTogglePlay();
      };
      const nextHandler = () => {
        handleNextTrack();
      };
      const prevHandler = () => {
        handlePrevTrack();
      };

      try { window.navigator.mediaSession.setActionHandler('play', playHandler); } catch (e) {}
      try { window.navigator.mediaSession.setActionHandler('pause', pauseHandler); } catch (e) {}
      try { window.navigator.mediaSession.setActionHandler('nexttrack', nextHandler); } catch (e) {}
      try { window.navigator.mediaSession.setActionHandler('previoustrack', prevHandler); } catch (e) {}
    } catch (e) {
      console.log('MediaSession note:', e);
    }
  }, [activeTrack, isPlaying, currentTrackIndex, isHomeOpen]);

  const handleVolumeChange = (val) => {
    const v = Math.max(0, Math.min(1, val));
    setVolume(v);
    if (v > 0.01) setIsMuted(false);
    else setIsMuted(true);
    if (engineRef.current) {
      engineRef.current.setMasterVolume(v);
    }
    // Post to native shell to adjust Android hardware device media volume
    try {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'SET_HARDWARE_VOLUME',
          volume: v
        }));
      }
    } catch (e) {}
  };

  const handleToggleMute = () => {
    if (isMuted) {
      const restored = volume > 0.05 ? volume : 0.75;
      setIsMuted(false);
      if (engineRef.current) engineRef.current.setMasterVolume(restored);
      try {
        window.ReactNativeWebView?.postMessage(JSON.stringify({
          type: 'SET_HARDWARE_VOLUME',
          volume: restored
        }));
      } catch (e) {}
    } else {
      setIsMuted(true);
      if (engineRef.current) engineRef.current.setMasterVolume(0.0001);
      try {
        window.ReactNativeWebView?.postMessage(JSON.stringify({
          type: 'SET_HARDWARE_VOLUME',
          volume: 0
        }));
      } catch (e) {}
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
        onSelectSosMode={handleSelectSosMode}
        streakInfo={streakInfo}
        onOpenAbout={() => setIsAboutOpen(true)} 
        onOpenDownload={() => setIsDownloadOpen(true)}
        isMobileApp={isMobileApp}
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
          targetMilestone={targetMilestone}
          activeListeningSeconds={activeListeningSeconds}
          theme={THEMES[currentThemeIdx]}
          streakInfo={streakInfo}
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
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenNote={() => setIsNoteOpen(true)}
          onOpenDownload={() => setIsDownloadOpen(true)}
          isMobileApp={isMobileApp}
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

      {/* Compounding Mindfulness Milestone Reward Modal */}
      <MilestoneRewardModal
        isOpen={isMilestoneOpen}
        milestone={unlockedMilestone}
        quote={currentQuote}
        onClose={() => setIsMilestoneOpen(false)}
      />

      {/* Sanctuary Settings & Presence Analytics Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        todaySeconds={activeListeningSeconds}
        lifetimeSeconds={lifetimeSeconds}
        streakInfo={streakInfo}
        googleUser={googleUser}
        onLinkGoogle={handleLinkGoogle}
        onUnlinkGoogle={handleUnlinkGoogle}
        currentMilestoneLabel={unlockedMilestone?.label || '0s'}
        notificationPrefs={notificationPrefs}
        onUpdatePref={handleUpdatePref}
        onCheckUpdate={handleCheckUpdate}
        isCheckingUpdate={isCheckingUpdate}
        updateStatus={updateStatus}
        onOpenUpdateModal={() => setIsUpdateModalOpen(true)}
        isMobileApp={isMobileApp}
      />

      {/* Autonomous In-App Update Modal */}
      <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        updateInfo={updateInfo}
        onApplyUpdate={() => window.location.reload()}
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
        v2.2.0
      </div>
    </>
  );
};
export default App;
