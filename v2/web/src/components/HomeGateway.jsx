import React from 'react';
import { Info, Play, Flame, Waves, CloudRain, Leaf, Moon, ChevronRight } from 'lucide-react';

export const SOS_RESCUES = [
  {
    id: 'racing_thoughts',
    title: 'Racing Thoughts',
    desc: 'Slow the mental noise',
    icon: Waves,
    trackIndex: 0,
    color: '#38bdf8',
  },
  {
    id: 'sensory_shield',
    title: 'Noise Shield',
    desc: 'Block distractions',
    alias: 'ADHD / Noise Shield',
    icon: CloudRain,
    trackIndex: 2,
    color: '#38bdf8',
  },
  {
    id: 'deep_flow',
    title: 'Deep Flow & Study',
    desc: 'Focus with ease',
    icon: Leaf,
    trackIndex: 6,
    color: '#10b981',
  },
  {
    id: 'night_sleep',
    title: 'Sleep',
    desc: 'Rest deeper tonight',
    icon: Moon,
    trackIndex: 1,
    sleepTimerSeconds: 1800,
    color: '#c084fc',
  },
];

export const HomeGateway = ({ 
  isVisible, 
  onEnter, 
  onSelectSosMode,
  streakInfo,
  onOpenStreak,
  onOpenAbout, 
  onOpenDownload,
  isMobileApp 
}) => {
  if (!isVisible) return null;

  const streak = streakInfo?.streak || 0;

  return (
    <div 
      className="home-gateway-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'max(20px, env(safe-area-inset-top)) 20px max(18px, env(safe-area-inset-bottom)) 20px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at 50% 35%, rgba(6, 9, 18, 0.4) 0%, rgba(4, 6, 12, 0.82) 55%, rgba(3, 5, 10, 0.96) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
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
          maxWidth: '420px',
          width: '100%',
          gap: '12px',
          margin: 'auto 0'
        }}
      >
        
        {/* Top Status Bar (3-Column Symmetrical Layout) */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px', minHeight: '34px', marginBottom: '8px' }}>
          {/* Left: Discrete version badge for perfect horizontal center balance */}
          <div style={{ display: 'flex', alignItems: 'center', minWidth: '46px' }}>
            <span className="freq-tag" style={{ fontSize: '9.5px', padding: '2px 7px', color: '#64748b', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              v2.2.0
            </span>
          </div>

          {/* Center Brand: ∞ STILL with Sanctuary tag */}
          <div className="monolith-brand" style={{ letterSpacing: '0.18em', fontSize: '11.5px', gap: '8px' }}>
            <i className="fa-solid fa-infinity text-xs" style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontWeight: 800 }}>STILL</span>
            <span className="freq-tag" style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
              SANCTUARY
            </span>
          </div>

          {/* Right: Streak button */}
          <div style={{ display: 'flex', alignItems: 'center', minWidth: '46px', justifyContent: 'flex-end' }}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onOpenStreak && onOpenStreak();
              }}
              className="freq-tag"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                padding: '3px 8px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#f59e0b',
                letterSpacing: '0.02em',
                boxShadow: '0 0 12px rgba(245, 158, 11, 0.15)',
                cursor: 'pointer'
              }}
              title="View 16-Week Consistency Matrix"
            >
              <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{streak > 0 ? `${streak}d` : '1d'}</span>
            </button>
          </div>
        </div>

        {/* Hidden accessible title for tests and screen readers */}
        <span style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', fontSize: '1px' }}>
          Neuro-Acoustic Sanctuary
        </span>

        {/* Hero Title (Editorial Serif - Cormorant Garamond) */}
        <div style={{ marginTop: '4px', marginBottom: '4px' }}>
          <h1 
            className="font-serif-hero"
            style={{
              fontSize: '66px',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              lineHeight: 1,
              textShadow: '0 0 45px rgba(255, 255, 255, 0.35), 0 4px 30px rgba(0, 0, 0, 0.85)',
              margin: 0
            }}
          >
            Still
          </h1>
          <p 
            style={{
              fontSize: '14px',
              fontWeight: 300,
              color: 'rgba(226, 232, 240, 0.9)',
              lineHeight: 1.5,
              maxWidth: '340px',
              margin: '6px auto 0'
            }}
          >
            A quiet space for your mind and your room.
          </p>
        </div>

        {/* Center Glowing Resonant Breathing Portal */}
        <div className="landing-orb" style={{ margin: '6px 0 10px' }}>
          <div className="landing-orb-warm-aura" />
          <div className="landing-orb-glow" />
          <div className="landing-orb-ring" />
          <div className="landing-orb-core">
            <Play className="w-7 h-7 text-white fill-white/80 ml-1" />
          </div>
          <div className="nexus-wavy-ripples" style={{ top: '100%' }}>
            <div className="water-ripple ripple-1" />
            <div className="water-ripple ripple-2" />
            <div className="water-ripple ripple-3" />
            <div className="water-ripple ripple-4" />
          </div>
        </div>

        {/* Primary CTA Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '100%' }}>
          <button 
            className="home-cta-button" 
            onClick={onEnter}
            style={{
              background: 'linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)',
              color: '#070b14',
              fontWeight: 700,
              fontSize: '14.5px',
              letterSpacing: '0.01em',
              boxShadow: '0 10px 35px rgba(56, 189, 248, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              border: 'none',
              height: '48px',
              width: '100%',
              maxWidth: '280px',
              padding: '0 24px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>Enter Calm Space</span>
            <span style={{ fontSize: '16px', fontWeight: 800 }}>→</span>
          </button>
          <span style={{ fontSize: '11.5px', color: '#94a3b8', letterSpacing: '0.01em', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span>🎯</span>
            <span>5-minute stillness depth begins on tap (0% → 100%)</span>
          </span>
        </div>

        {/* 1-Tap Quick SOS State Rescues Grid (2x2) */}
        <div style={{ width: '100%', marginTop: '8px' }} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {SOS_RESCUES.map((rescue) => {
              const Icon = rescue.icon;
              return (
                <button
                  key={rescue.id}
                  onClick={() => onSelectSosMode && onSelectSosMode(rescue)}
                  className="sos-rescue-card"
                  style={{
                    background: 'rgba(12, 18, 34, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '18px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    gap: '3px',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${rescue.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: rescue.color }} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>{rescue.title}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 400, paddingLeft: '2px' }}>{rescue.desc}</span>
                  {rescue.alias && (
                    <span style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', fontSize: '1px' }}>
                      {rescue.alias}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Minimal Actions Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px' }}>
          <button 
            className="pill-toggle-btn" 
            onClick={(e) => {
              e.stopPropagation();
              onOpenAbout();
            }} 
            style={{ fontSize: '11.5px', padding: '6px 14px', gap: '6px', height: '32px' }}
          >
            <Info className="w-3.5 h-3.5 text-sky-400" />
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
                fontSize: '11.5px', 
                padding: '6px 14px', 
                gap: '6px',
                height: '32px',
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

        {/* Single-Line Elegant Craft Credit */}
        <div className="creator-credit" style={{ marginTop: '6px', opacity: 0.5 }}>
          <span>Still Sanctuary &bull; Crafted with care by <a href="https://github.com/Harixomxsingh" target="_blank" rel="noopener noreferrer" className="creator-link" onClick={(e) => e.stopPropagation()}>Hari</a> &bull; v2.2.0</span>
        </div>

      </div>
    </div>
  );
};
