import React, { useState, useEffect } from 'react';
import { BreathingHalo } from './BreathingHalo';
import { 
  Play, Pause, SkipBack, SkipForward, Volume, Volume1, Volume2, VolumeX, 
  Sliders, Clock, Mail, Moon, Sun, Leaf, Sparkles, Maximize, Info, Settings, Flame, MoreHorizontal, X, ArrowLeft, ChevronRight, Wind 
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
  breathPatternId,
  backdropMode = 'horizon',
  onTogglePlay,
  onNext,
  onPrev,
  onVolumeChange,
  onToggleMute,
  onCycleTimer,
  onOpenTimer,
  onOpenStreak,
  onOpenBreathPacer,
  onCycleTheme,
  onCycleBackdrop,
  onToggleFullScreen,
  onOpenLibrary,
  onOpenMixer,
  onOpenSettings,
  onOpenAbout,
  onOpenNote,
  onOpenDownload,
  onBackToHome,
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
      
      {/* 1. Top Navigation & Status Bar (Minimalist Clean) */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
          
          {/* Left: Back arrow (if returning to Gateway) or balanced spacer */}
          <div style={{ display: 'flex', alignItems: 'center', minWidth: '40px' }}>
            {onBackToHome && (
              <button 
                className="icon-action-btn"
                onClick={onBackToHome}
                title="Return to Calm Space Gateway"
                style={{ width: '28px', height: '28px' }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Center Brand: ∞ STILL with 0.1 Hz cyan pill badge */}
          <div className="monolith-brand" style={{ letterSpacing: '0.18em', fontSize: '11.5px', gap: '8px' }}>
            <i className="fa-solid fa-infinity text-xs" style={{ color: 'var(--accent-primary)' }}></i>
            <span style={{ fontWeight: 800 }}>STILL</span>
            <span className="freq-tag" style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}>0.1 Hz</span>
          </div>

          {/* Right: Streak badge (opens GitHub-style matrix) + More menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '40px', justifyContent: 'flex-end' }}>
            <button 
              className="freq-tag" 
              onClick={onOpenStreak}
              style={{ 
                background: 'rgba(245, 158, 11, 0.15)', 
                color: '#f59e0b', 
                border: '1px solid rgba(245, 158, 11, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                padding: '3px 8px',
                cursor: 'pointer'
              }}
              title={`${streak}-day stillness streak. Tap to view 16-week consistency matrix.`}
            >
              <Flame className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
              <span>{streak > 0 ? `${streak}d` : '1d'}</span>
            </button>

            <button
              className="icon-action-btn"
              onClick={() => setIsMoreOpen((prev) => !prev)}
              title="Sanctuary Menu"
              style={{ width: '28px', height: '28px' }}
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
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

      {/* 3. Track Details & Daily Stillness Progression Section */}
      <div className="track-info-block">
        <h2 className="track-title">{track.title}</h2>
        <div className="track-science-pill">
          <span className="pulsing-indicator" />
          <span>{track.science}</span>
        </div>

        {/* Daily Stillness Progress Track with Dynamic Fire Ignition Animation */}
        <div 
          className="habit-progress-container"
          onClick={onOpenStreak}
          title="Daily Stillness Practice. Tap to view your consistency matrix."
        >
          <div className="habit-progress-meta">
            <span className="habit-meta-label">
              <Flame 
                className="w-3.5 h-3.5"
                style={{
                  color: (targetMilestone?.progressPercent || 0) > 0 ? '#f59e0b' : '#64748b',
                  fill: (targetMilestone?.progressPercent || 0) > 0 ? '#f59e0b' : 'none',
                  filter: (targetMilestone?.progressPercent || 0) === 0 
                    ? 'grayscale(1) opacity(0.35)' 
                    : `grayscale(${Math.max(0, 1 - (targetMilestone?.progressPercent || 0) / 60)}) drop-shadow(0 0 ${Math.max(2, ((targetMilestone?.progressPercent || 0) / 100) * 8)}px #f59e0b)`,
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
              <span>Daily Stillness</span>
            </span>
            <span className="habit-meta-percent font-mono-data">
              {Math.round(targetMilestone?.progressPercent || 0)}%
            </span>
          </div>
          <div className="habit-progress-track">
            <div 
              className="habit-progress-fill" 
              style={{ width: `${Math.min(100, Math.max(0, targetMilestone?.progressPercent || 0))}%` }} 
            />
            <div 
              className="habit-progress-head" 
              style={{ left: `${Math.min(100, Math.max(0, targetMilestone?.progressPercent || 0))}%` }} 
            />
          </div>
          {/* Accessible hidden description for screen readers and search */}
          <span style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', fontSize: '1px' }}>
            {track.description}
          </span>
        </div>
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

          {/* 3. Resonant Breath Pacer Guide */}
          <button 
            className="pill-toggle-btn pacer-pill-btn"
            onClick={onOpenBreathPacer} 
            title="Resonant Breath Pacer (0.1 Hz HRV / Box / 4-7-8)"
          >
            <Wind className="w-3.5 h-3.5 text-sky-400" />
            <span style={{ 
              fontFamily: 'JetBrains Mono, monospace', 
              fontSize: '11px', 
              fontWeight: 600,
              color: 'var(--accent-primary)'
            }}>
              0.1 Hz Breath
            </span>
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

        {/* Screen 09: Sanctuary Menu Modal Drawer */}
        {isMoreOpen && (
          <div className="sanctuary-more-backdrop" onClick={() => setIsMoreOpen(false)}>
            <div className="sanctuary-more-popover" onClick={(e) => e.stopPropagation()}>
              <div className="more-menu-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '-0.01em', color: '#fff' }}>Sanctuary Tools</span>
                <button 
                  onClick={() => setIsMoreOpen(false)} 
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <button 
                className="more-menu-item" 
                onClick={() => { setIsMoreOpen(false); onOpenLibrary(); }}
              >
                <i className="fa-solid fa-list-ul text-sky-400" style={{ width: '16px' }}></i>
                <span style={{ flex: 1 }}>Library</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button 
                className="more-menu-item" 
                onClick={() => { setIsMoreOpen(false); onOpenMixer(); }}
              >
                <Sliders className="w-4 h-4 text-sky-400" />
                <span style={{ flex: 1 }}>Stem Mixer</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button 
                className="more-menu-item" 
                onClick={() => { onCycleTimer(); }}
              >
                <Clock className="w-4 h-4 text-sky-400" />
                <span style={{ flex: 1 }}>Sleep Timer</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: sleepTimer ? 'var(--accent-primary)' : '#94a3b8' }}>
                  {sleepTimer ? `${Math.floor(sleepTimer / 60)}:${(sleepTimer % 60).toString().padStart(2, '0')}` : 'Off'}
                </span>
              </button>

              <button 
                className="more-menu-item" 
                onClick={() => { setIsMoreOpen(false); onCycleTheme(); }}
              >
                <Sun className="w-4 h-4 text-amber-400" />
                <span style={{ flex: 1 }}>Mood Lighting</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button 
                className="more-menu-item" 
                onClick={() => { onCycleBackdrop && onCycleBackdrop(); }}
                title="Switch between Scenic Horizon, Deep Obsidian Void, and Nebula Flow"
              >
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span style={{ flex: 1 }}>Backdrop Canvas</span>
                <span style={{ 
                  fontFamily: 'JetBrains Mono, monospace', 
                  fontSize: '11px', 
                  color: 'var(--accent-primary)',
                  fontWeight: 600,
                  textTransform: 'capitalize' 
                }}>
                  {backdropMode === 'void' ? 'Deep Void' : backdropMode === 'nebula' ? 'Nebula' : 'Horizon'}
                </span>
              </button>

              <button 
                className="more-menu-item" 
                onClick={() => { setIsMoreOpen(false); onOpenSettings(); }}
              >
                <Settings className="w-4 h-4 text-sky-400" />
                <span style={{ flex: 1 }}>Sanctuary Settings &amp; Sync</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button 
                className="more-menu-item" 
                onClick={() => { setIsMoreOpen(false); onOpenAbout(); }}
              >
                <Info className="w-4 h-4 text-sky-400" />
                <span style={{ flex: 1 }}>About Still &amp; Neuroscience</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button 
                className="more-menu-item" 
                onClick={() => { setIsMoreOpen(false); onOpenNote(); }}
              >
                <Mail className="w-4 h-4 text-sky-400" />
                <span style={{ flex: 1 }}>Creator's Note</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button 
                className="more-menu-item" 
                onClick={() => { setIsMoreOpen(false); onToggleFullScreen(); }}
              >
                <Maximize className="w-4 h-4 text-sky-400" />
                <span style={{ flex: 1 }}>Fullscreen Zen Mode</span>
                <span style={{ fontSize: '10px', background: 'rgba(255, 255, 255, 0.1)', padding: '1px 6px', borderRadius: '4px', color: '#cbd5e1' }}>F</span>
              </button>

              {!isMobileApp && (
                <button 
                  className="more-menu-item" 
                  onClick={() => { setIsMoreOpen(false); onOpenDownload(); }}
                >
                  <i className="fa-brands fa-android text-sky-400" style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}></i>
                  <span style={{ flex: 1 }}>Get Android App (.apk)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              )}

              <button 
                className="more-menu-item" 
                onClick={() => { setIsMoreOpen(false); onOpenSettings(); }}
              >
                <i className="fa-solid fa-file-export text-sky-400" style={{ width: '16px' }}></i>
                <span style={{ flex: 1 }}>Export / Import Data</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 5. Minimal, Serene Single-Line Craft Credit */}
      <div className="creator-credit" style={{ marginTop: '14px', textAlign: 'center', opacity: 0.45, transition: 'opacity 0.3s ease' }}>
        <span>Still Sanctuary &bull; Crafted with care by <a href="https://github.com/Harixomxsingh" target="_blank" rel="noopener noreferrer" className="creator-link">Hari</a> &bull; v2.2.0</span>
      </div>

    </div>
  );
};
