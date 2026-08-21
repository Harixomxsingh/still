import React from 'react';
import { Waves, Info } from 'lucide-react';

export const HomeGateway = ({ isVisible, onEnter, onOpenAbout, onOpenDownload }) => {
  if (!isVisible) return null;

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
        padding: '32px 20px',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 45%, rgba(6, 9, 18, 0.6) 0%, rgba(5, 7, 13, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        cursor: 'pointer',
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
          gap: '20px'
        }}
      >
        
        {/* Top Badge */}
        <div className="landing-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-infinity text-xs" style={{ color: 'var(--accent-primary)' }}></i>
          <span>Neuro-Acoustic Sanctuary</span>
        </div>

        {/* Title */}
        <h1 
          style={{
            fontSize: '56px',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            lineHeight: 1.05,
            background: 'linear-gradient(180deg, #ffffff 40%, rgba(255, 255, 255, 0.65) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '4px 0'
          }}
        >
          Still
        </h1>

        {/* Subtitle */}
        <p 
          style={{
            fontSize: '15px',
            fontWeight: 300,
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '380px',
            marginTop: '-4px'
          }}
        >
          A distraction-free space for your mind and room. Zero algorithms. Instant peace.
        </p>

        {/* Center Glowing Breathing Living Aura */}
        <div className="landing-orb">
          <div className="landing-orb-glow" />
          <div className="landing-orb-ring" />
          <div className="landing-orb-core">
            <span style={{ fontSize: '20px', color: '#ffffff', marginLeft: '3px' }}>▶</span>
          </div>
        </div>

        {/* Primary Glowing Button */}
        <button 
          className="master-play-button" 
          style={{
            width: 'auto',
            minWidth: '220px',
            height: '48px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--card-border)',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '0 24px',
            boxShadow: '0 0 25px var(--accent-glow)'
          }}
        >
          <Waves className="w-4 h-4 text-sky-400" />
          <span>Enter Calm Space</span>
        </button>

        {/* Hint text */}
        <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-muted)', marginTop: '-6px' }}>
          Tap anywhere to begin audio
        </span>

        {/* About & Download App Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '2px', flexWrap: 'wrap' }}>
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
        </div>

        {/* Creator Signature & Version */}
        <div className="creator-credit" style={{ marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <span>made by <a href="https://github.com/Harixomxsingh" target="_blank" rel="noopener noreferrer" className="creator-link" onClick={(e) => e.stopPropagation()}>hari</a> with ❤️ &amp; care</span>
          <span>&bull;</span>
          <span style={{ fontFamily: 'monospace', color: '#34d399', fontSize: '10.5px', fontWeight: '600' }}>v2.0.2 • 🟢 Live Sync Active</span>
        </div>

      </div>
    </div>
  );
};
