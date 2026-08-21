import React, { useState, useEffect } from 'react';
import { BreathingHalo } from './BreathingHalo';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Sliders, Clock, Mail, Moon, Sun, Leaf, Sparkles, Maximize, Info 
} from 'lucide-react';

export const MonolithPlayer = ({
  track,
  quote,
  isPlaying,
  volume,
  isMuted,
  sleepTimer,
  theme,
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
  onOpenAbout,
  onOpenNote,
  onOpenDownload
}) => {
  // Inactivity Auto-Ghost state (5 seconds)
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

  return (
    <div className="monolith-wrapper">
      
      {/* 1. Top Brand Status & Daily Calm Wisdom */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div className="monolith-brand">
          <i className="fa-solid fa-infinity text-xs" style={{ color: 'var(--accent-primary)' }}></i>
          <span>Still</span>
          <span className="freq-tag">0.1 Hz</span>
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
      <div className="monolith-console">
        
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

        {/* Master Volume Slider */}
        <div className="volume-container">
          <button 
            className="icon-action-btn" 
            style={{ width: '28px', height: '28px' }} 
            onClick={onToggleMute} 
            title="Mute / Unmute (M)"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume} 
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            title="Master Volume"
          />
        </div>

        {/* Utilities Row */}
        <div className="utility-row">
          {/* Sound Library Button */}
          <button className="pill-toggle-btn" onClick={onOpenLibrary}>
            <i className="fa-solid fa-sliders text-[10px] text-sky-400"></i>
            <span>Library</span>
          </button>

          {/* Stem Mixer Button */}
          <button className="pill-toggle-btn" onClick={onOpenMixer} title="Audio Stem Layer Mixer">
            <Sliders className="w-3 h-3 text-sky-400" />
            <span>Mixer</span>
          </button>

          {/* Countdown Sleep Timer */}
          <button 
            className={`pill-toggle-btn timer-pill-btn ${sleepTimer !== null ? 'is-active' : ''}`}
            onClick={onCycleTimer} 
            title={sleepTimer !== null ? `Sleep Timer: ${Math.floor(sleepTimer / 60)}:${sleepTimer % 60 < 10 ? '0' : ''}${sleepTimer % 60} remaining` : "Set Sleep Timer"}
          >
            <Clock className="w-3 h-3" />
            <span style={{ 
              fontFamily: 'JetBrains Mono, monospace', 
              fontSize: sleepTimer !== null ? '10px' : '11px',
              fontWeight: 600
            }}>
              {sleepTimer !== null 
                ? `${Math.floor(sleepTimer / 60)}:${sleepTimer % 60 < 10 ? '0' : ''}${sleepTimer % 60}` 
                : '∞'}
            </span>
          </button>

          {/* Download Android App */}
          <button 
            className="icon-action-btn" 
            onClick={onOpenDownload} 
            title="Download Still Android App (.apk)"
            style={{ color: 'var(--accent-primary)', borderColor: 'rgba(56, 189, 248, 0.3)' }}
          >
            <i className="fa-brands fa-android text-xs"></i>
          </button>

          {/* About & Science */}
          <button 
            className="icon-action-btn" 
            onClick={onOpenAbout} 
            title="About & Science"
          >
            <Info className="w-3.5 h-3.5" />
          </button>

          {/* Welcome Note from Hari */}
          <button 
            className="icon-action-btn" 
            onClick={onOpenNote} 
            title="Welcome Note from Hari"
          >
            <Mail className="w-3.5 h-3.5" />
          </button>

          {/* Theme Switcher */}
          <button 
            className="icon-action-btn" 
            onClick={onCycleTheme} 
            title="Switch Mood Theme (T)"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Zen Mode */}
          <button 
            className="icon-action-btn zen-fullscreen-btn" 
            onClick={onToggleFullScreen} 
            title="Fullscreen Zen Mode (F)"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 5. Keyboard Hints Bar */}
      <div className="keyboard-hints">
        [Space] Play &bull; [N] Next &bull; [M] Mute &bull; [F] Zen
      </div>

      {/* 6. Creator Signature, App Link & Version */}
      <div className="creator-credit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span>made by <a href="https://github.com/Harixomxsingh" target="_blank" rel="noopener noreferrer" className="creator-link">hari</a> with ❤️ &amp; care</span>
        <span>&bull;</span>
        <button 
          onClick={onOpenDownload} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--accent-primary)', 
            fontSize: '11px', 
            cursor: 'pointer', 
            textDecoration: 'underline',
            fontWeight: '500'
          }}
        >
          📱 Get Android App
        </button>
        <span>&bull;</span>
        <span style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '10.5px' }}>v2.0.0</span>
      </div>

    </div>
  );
};
