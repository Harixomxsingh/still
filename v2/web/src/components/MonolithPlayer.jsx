import React, { useState, useEffect } from 'react';
import { BreathingHalo } from './BreathingHalo';
import { 
  Play, Pause, SkipBack, SkipForward, Volume, Volume1, Volume2, VolumeX, 
  Sliders, Clock, Mail, Moon, Sun, Leaf, Sparkles, Maximize, Info, Settings, Flame, MoreHorizontal, X 
} from 'lucide-react';

export const MonolithPlayer = ({
  track,
  quote,
  isPlaying,
  volume,
  isMuted,
  sleepTimer,
  targetMilestone,
  activeListeningSeconds,
  theme,
  streakInfo,
  onTogglePlay,
  onNext,
  onPrev,
  onVolumeChange,
  onToggleMute,
  onCycleTimer,
  onCycleTheme,
  onToggleFullScreen,
  onOpenLibrary,
  onOpenMixer,
  onOpenSettings,
  onOpenAbout,
  onOpenNote,
  onOpenDownload,
  isMobileApp
}) => {
  // Sanctuary More Options Drawer State
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Inactivity Auto-Ghost state (10 seconds)
  const [isGhost, setIsGhost] = useState(false);

  useEffect(() => {
    let inactivityTimer;

    const resetInactivity = () => {
      setIsGhost(false);
      clearTimeout(inactivityTimer);
      if (isPlaying) {
        inactivityTimer = setTimeout(() => {
          setIsGhost(true);
        }, 10000); // 10 seconds of inactivity
      }
    };

    window.addEventListener('mousemove', resetInactivity);
    window.addEventListener('touchstart', resetInactivity);
    window.addEventListener('keydown', resetInactivity);

    resetInactivity();

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetInactivity);
      window.removeEventListener('touchstart', resetInactivity);
      window.removeEventListener('keydown', resetInactivity);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (isGhost) {
      document.body.classList.add('is-ghost');
    } else {
      document.body.classList.remove('is-ghost');
    }
  }, [isGhost]);

  const streak = streakInfo?.streak || 0;

  return (
    <div className="monolith-wrapper">
      
      {/* 1. Top Brand Status & Daily Calm Wisdom */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div className="monolith-brand">
          <i className="fa-solid fa-infinity text-xs" style={{ color: 'var(--accent-primary)' }}></i>
          <span>Still</span>
          <span className="freq-tag">0.1 Hz</span>
          {streak > 0 && (
            <span 
              className="freq-tag" 
              style={{ 
                background: 'rgba(245, 158, 11, 0.15)', 
                color: '#f59e0b', 
                border: '1px solid rgba(245, 158, 11, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px'
              }}
              title={`${streak}-day stillness streak`}
            >
              <Flame className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
              <span>{streak}d</span>
            </span>
          )}
        </div>

        {quote && (
          <div className="daily-quote-box">
            <p className="daily-quote-text">“{quote.text}”</p>
            <span className="daily-quote-author">— {quote.author}</span>
          </div>
        )}
      </div>

      {/* 2. Central Resonant Breathing Halo */}
      <BreathingHalo isPlaying={isPlaying} onTogglePlay={onTogglePlay} />

      {/* 3. Track Details & Science Section */}
      <div className="track-info-block">
        <h2 className="track-title">{track.title}</h2>
        <div className="track-science-pill">
          <span className="pulsing-indicator" />
          <span>{track.science}</span>
        </div>
        <p className="track-desc">{track.description}</p>
      </div>

      {/* 4. Monolith Unified Glass Console */}
      <div className="monolith-console" style={{ position: 'relative' }}>
        
        {/* Playback Controls Row */}
        <div className="playback-row">
          <button className="icon-action-btn" onClick={onPrev} title="Previous Soundscape (P)">
            <SkipBack className="w-4 h-4" />
          </button>

          <button 
            className="master-play-button" 
            onClick={onTogglePlay} 
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          <button className="icon-action-btn" onClick={onNext} title="Next Soundscape (N)">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Master Volume Slider with 2-Way Hardware Sync & Touch Ergonomics */}
        <div className="volume-container">
          <button 
            className="icon-action-btn" 
            style={{ width: '30px', height: '30px', flexShrink: 0 }} 
            onClick={onToggleMute} 
            title="Mute / Unmute (M)"
          >
            {isMuted || volume <= 0.01 ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : volume < 0.4 ? (
              <Volume className="w-3.5 h-3.5 text-sky-400" />
            ) : volume < 0.75 ? (
              <Volume1 className="w-3.5 h-3.5 text-sky-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-sky-400" />
            )}
          </button>
          
          <div style={{ position: 'relative', flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={isMuted ? 0 : volume} 
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              title="Master Volume (Syncs with Android Hardware)"
              style={{
                width: '100%',
                cursor: 'pointer',
                accentColor: 'var(--accent-primary)',
              }}
            />
          </div>

          <span 
            style={{ 
              fontFamily: 'JetBrains Mono, monospace', 
              fontSize: '10.5px', 
              color: isMuted || volume <= 0.01 ? '#f43f5e' : 'var(--accent-primary)',
              minWidth: '32px',
              textAlign: 'right',
              fontWeight: 600,
              userSelect: 'none'
            }}
          >
            {isMuted || volume <= 0.01 ? '0%' : `${Math.round(volume * 100)}%`}
          </span>
        </div>

        {/* Streamlined 5-Control Utilities Row (Apple-grade Balance) */}
        <div className="utility-row">
          {/* 1. Sound Library */}
          <button className="icon-action-btn" onClick={onOpenLibrary} title="Soundscape Library">
            <i className="fa-solid fa-list-ul text-xs text-sky-400"></i>
          </button>

          {/* 2. Audio Stem Mixer */}
          <button className="icon-action-btn" onClick={onOpenMixer} title="Audio Stem Layer Mixer">
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
          </button>

          {/* 3. Integrated Dynamic Habit / Sleep Timer Capsule */}
          <button 
            className={`pill-toggle-btn timer-pill-btn ${sleepTimer !== null || isPlaying ? 'is-active' : ''}`}
            onClick={onCycleTimer} 
            title={
              sleepTimer !== null 
                ? `Sleep Timer: ${Math.floor(sleepTimer / 60)}:${sleepTimer % 60 < 10 ? '0' : ''}${sleepTimer % 60} remaining. Tap to cycle.` 
                : `Autonomous Habit: ${targetMilestone?.label || '5m'} (${targetMilestone?.formattedRemaining || '05:00'} remaining). Tap for sleep timer.`
            }
          >
            {sleepTimer !== null ? (
              <>
                <Clock className="w-3 h-3 text-amber-400" />
                <span style={{ 
                  fontFamily: 'JetBrains Mono, monospace', 
                  fontSize: '10.5px', 
                  fontWeight: 700,
                  color: '#f59e0b'
                }}>
                  {Math.floor(sleepTimer / 60)}:{sleepTimer % 60 < 10 ? '0' : ''}{sleepTimer % 60}
                </span>
              </>
            ) : (
              <>
                <span style={{ fontSize: '10.5px' }}>🎯</span>
                <span style={{ 
                  fontFamily: 'JetBrains Mono, monospace', 
                  fontSize: '10.5px', 
                  fontWeight: 600,
                  color: isPlaying ? 'var(--accent-primary)' : 'var(--text-secondary)'
                }}>
                  {targetMilestone?.label || '5m'} &bull; {Math.round(targetMilestone?.progressPercent || 0)}%
                </span>
                {/* Integrated Micro Progress Underline */}
                {isPlaying && targetMilestone && (
                  <div 
                    className="timer-pill-progress" 
                    style={{ width: `${Math.min(100, Math.max(3, targetMilestone.progressPercent || 0))}%` }} 
                  />
                )}
              </>
            )}
          </button>

          {/* 4. Ambient Mood Lighting */}
          <button 
            className="icon-action-btn" 
            onClick={onCycleTheme} 
            title="Switch Mood Lighting (T)"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>

          {/* 5. Sanctuary Menu & More */}
          <button 
            className={`icon-action-btn ${isMoreOpen ? 'is-active' : ''}`} 
            onClick={() => setIsMoreOpen((prev) => !prev)} 
            title="Sanctuary Options & Tools"
            style={{ color: isMoreOpen ? 'var(--accent-primary)' : undefined }}
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sanctuary Floating Drawer Popover */}
        {isMoreOpen && (
          <>
            <div className="sanctuary-more-backdrop" onClick={() => setIsMoreOpen(false)} />
            <div className="sanctuary-more-popover" onClick={(e) => e.stopPropagation()}>
              <div className="more-menu-header">
                <span>Sanctuary Tools</span>
                <button 
                  onClick={() => setIsMoreOpen(false)} 
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <button 
                className="more-menu-item" 
                onClick={() => { setIsMoreOpen(false); onOpenSettings(); }}
              >
                <Settings className="w-4 h-4 text-sky-400" />
                <span>Sanctuary Settings &amp; Sync</span>
              </button>

              <button 
                className="more-menu-item" 
                onClick={() => { setIsMoreOpen(false); onOpenAbout(); }}
              >
                <Info className="w-4 h-4 text-sky-400" />
                <span>About Still &amp; Neuroscience</span>
              </button>

              <button 
                className="more-menu-item" 
                onClick={() => { setIsMoreOpen(false); onOpenNote(); }}
              >
                <Mail className="w-4 h-4 text-sky-400" />
                <span>Welcome Note from Hari</span>
              </button>

              {!isMobileApp && (
                <button 
                  className="more-menu-item" 
                  onClick={() => { setIsMoreOpen(false); onOpenDownload(); }}
                >
                  <i className="fa-brands fa-android text-sky-400" style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}></i>
                  <span>Download Android App (.apk)</span>
                </button>
              )}

              <button 
                className="more-menu-item" 
                onClick={() => { setIsMoreOpen(false); onToggleFullScreen(); }}
              >
                <Maximize className="w-4 h-4 text-sky-400" />
                <span>Fullscreen Zen Mode (F)</span>
              </button>

              <div className="more-menu-shortcuts">
                [Space] Play &bull; [N] Next &bull; [M] Mute &bull; [T] Theme &bull; [F] Zen
              </div>
            </div>
          </>
        )}

      </div>

      {/* 5. Minimal, Serene Single-Line Craft Credit */}
      <div className="creator-credit" style={{ marginTop: '14px', textAlign: 'center', opacity: 0.45, transition: 'opacity 0.3s ease' }}>
        <span>Still Sanctuary &bull; Crafted with care by <a href="https://github.com/Harixomxsingh" target="_blank" rel="noopener noreferrer" className="creator-link">Hari</a> &bull; v2.2.0</span>
      </div>

    </div>
  );
};
