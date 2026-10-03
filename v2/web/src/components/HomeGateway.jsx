import React from 'react';
import { Info, Play, Flame, Brain, Wind, Sparkles, Moon, ChevronRight } from 'lucide-react';

export const SOS_RESCUES = [
  {
    id: 'racing_thoughts',
    title: 'Racing Thoughts',
    desc: 'Alpha 432 Hz + 0.1 Hz Breath',
    icon: Brain,
    trackIndex: 0,
    color: '#38bdf8',
  },
  {
    id: 'sensory_shield',
    title: 'ADHD / Noise Shield',
    desc: '1/f² Brownian Noise + Rain',
    icon: Wind,
    trackIndex: 2,
    color: '#f59e0b',
  },
  {
    id: 'deep_flow',
    title: 'Deep Flow & Study',
    desc: 'Isochronic Theta 320 Hz',
    icon: Sparkles,
    trackIndex: 6,
    color: '#10b981',
  },
  {
    id: 'night_sleep',
    title: 'Delta Night Sleep',
    desc: '2.5 Hz Delta + 30m Timer',
    icon: Moon,
    trackIndex: 1,
    sleepTimerSeconds: 1800,
    color: '#a855f7',
  },
];

export const HomeGateway = ({ 
  isVisible, 
  onEnter, 
  onSelectSosMode,
  streakInfo,
  onOpenAbout, 
  onOpenDownload,
  isMobileApp 
}) => {
  if (!isVisible) return null;

  const streak = streakInfo?.streak || 0;
  const progressPercent = streakInfo?.progressPercent || 0;
  const isGoalMet = streakInfo?.isGoalMetToday || false;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 45%, rgba(6, 9, 18, 0.6) 0%, rgba(5, 7, 13, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        cursor: 'pointer',
        overflowY: 'auto',
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onClick={onEnter}
    >
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '480px',
          width: '100%',
          gap: '16px',
          margin: 'auto 0'
        }}
      >
        
        {/* Top Tag & Daily Streak Habit Flame */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div className="landing-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <i className="fa-solid fa-infinity text-xs" style={{ color: 'var(--accent-primary)' }}></i>
            <span>Neuro-Acoustic Sanctuary</span>
          </div>

          {streak > 0 && (
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#f59e0b',
                letterSpacing: '0.02em',
                boxShadow: '0 0 15px rgba(245, 158, 11, 0.15)'
              }}
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{streak}-Day Streak {isGoalMet ? '✓' : `(${progressPercent}%)`}</span>
            </div>
          )}
        </div>

        {/* Hero Title */}
        <h1 
          style={{
            fontSize: '52px',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            lineHeight: 1.05,
            background: 'linear-gradient(180deg, #ffffff 40%, rgba(255, 255, 255, 0.65) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '2px 0'
          }}
        >
          Still
        </h1>

        {/* Subtitle */}
        <p 
          style={{
            fontSize: '14px',
            fontWeight: 300,
            color: 'var(--text-secondary)',
            lineHeight: 1.55,
            maxWidth: '380px',
            marginTop: '-4px',
            marginBottom: '4px'
          }}
        >
          A distraction-free space for your mind and room. Zero algorithms. Instant peace.
        </p>

        {/* Center Glowing Breathing Living Aura */}
        <div className="landing-orb">
          <div className="landing-orb-glow" />
          <div className="landing-orb-ring" />
          <div className="landing-orb-core">
            <span style={{ fontSize: '18px', color: '#ffffff', marginLeft: '3px' }}>▶</span>
          </div>
        </div>

        {/* Primary Call to Action Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <button 
            className="master-play-button" 
            style={{
              width: 'auto',
              minWidth: '220px',
              height: '46px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--card-border)',
              color: '#ffffff',
              fontSize: '13.5px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '0 24px',
              boxShadow: '0 0 25px var(--accent-glow)'
            }}
          >
            <Play className="w-4 h-4 text-sky-400" />
            <span>Enter Calm Space</span>
          </button>
          <span style={{ fontSize: '10.5px', color: '#94a3b8', letterSpacing: '0.02em', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span>🎯</span>
            <span>5-minute stillness depth begins on tap (0% → 100%)</span>
          </span>
        </div>

        {/* 1-Tap Quick SOS State Rescues Grid */}
        <div style={{ width: '100%', marginTop: '6px' }} onClick={(e) => e.stopPropagation()}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
            ⚡ Instant State Rescues
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {SOS_RESCUES.map((rescue) => {
              const Icon = rescue.icon;
              return (
                <button
                  key={rescue.id}
                  onClick={() => onSelectSosMode && onSelectSosMode(rescue)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    gap: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                  className="sos-rescue-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: rescue.color }} />
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>{rescue.title}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 300 }}>{rescue.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
          <button 
            className="pill-toggle-btn" 
            onClick={(e) => {
              e.stopPropagation();
              onOpenAbout();
            }} 
            style={{ fontSize: '11px', padding: '5px 14px', gap: '6px' }}
          >
            <Info className="w-3 h-3 text-sky-400" />
            <span>About &amp; Science</span>
          </button>

          {!isMobileApp && (
            <button 
              className="pill-toggle-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onOpenDownload();
              }} 
              style={{ 
                fontSize: '11px', 
                padding: '5px 14px', 
                gap: '6px',
                borderColor: 'rgba(56, 189, 248, 0.4)',
                background: 'rgba(56, 189, 248, 0.1)',
                color: '#38bdf8'
              }}
            >
              <i className="fa-brands fa-android text-xs"></i>
              <span>Get Android App</span>
            </button>
          )}
        </div>

        {/* Creator Signature, Dynamic Copyright & Version */}
        <div className="creator-credit" style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span>Made with ❤️ &amp; care by <a href="https://github.com/Harixomxsingh" target="_blank" rel="noopener noreferrer" className="creator-link" onClick={(e) => e.stopPropagation()}>Hari</a></span>
            {!isMobileApp && (
              <>
                <span>&bull;</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDownload();
                  }} 
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
              </>
            )}
            <span>&bull;</span>
            <span style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '10.5px' }}>v2.2.0</span>
          </div>
          <div style={{ fontSize: '10.5px', color: '#64748b', letterSpacing: '0.02em', userSelect: 'none' }}>
            &copy; {new Date().getFullYear()} Still &bull; All Rights Reserved
          </div>
        </div>

      </div>
    </div>
  );
};
