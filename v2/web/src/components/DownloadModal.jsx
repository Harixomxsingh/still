import React from 'react';

export const DownloadModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const APK_DOWNLOAD_URL = "/Still.apk";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-card download-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px', padding: '32px 28px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              background: 'rgba(56, 189, 248, 0.1)', 
              border: '1px solid rgba(56, 189, 248, 0.3)', 
              color: '#38bdf8', 
              fontSize: '11px', 
              fontWeight: '700', 
              padding: '4px 10px', 
              borderRadius: '20px',
              letterSpacing: '0.05em'
            }}>
              📱 ANDROID APP
            </span>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close modal">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Get Still on Your Phone
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', marginBottom: '24px', fontWeight: '300' }}>
          A distraction-free sanctuary for your pocket. Continuous background audio, tactile 0.1 Hz breathing guide, and zero ads or tracking.
        </p>

        {/* 1-Click Primary Action */}
        <a 
          href={APK_DOWNLOAD_URL}
          download="Still.apk"
          className="gateway-btn"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '10px', 
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: '700',
            padding: '16px 24px',
            marginBottom: '28px',
            boxShadow: '0 0 30px rgba(56, 189, 248, 0.3)'
          }}
        >
          <i className="fa-brands fa-android" style={{ fontSize: '18px' }}></i>
          Download Still for Android (.apk)
        </a>

        {/* Radically Simple 3-Step Guide (Zero Decision Fatigue) */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.02)', 
          border: '1px solid rgba(255, 255, 255, 0.06)', 
          borderRadius: '18px', 
          padding: '18px 20px',
          marginBottom: '24px'
        }}>
          <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>
            ⚡ 3-Step Fast Setup (15 Seconds)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.5' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: '700', width: '22px', height: '22px', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', flexShrink: 0 }}>1</span>
              <div><strong>Tap Download:</strong> The <code>Still.apk</code> file will download to your phone.</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: '700', width: '22px', height: '22px', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', flexShrink: 0 }}>2</span>
              <div><strong>Tap Open:</strong> When finished, tap the notification. If prompted, tap <em>Settings ➔ Allow from this source</em>.</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: '700', width: '22px', height: '22px', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', flexShrink: 0 }}>3</span>
              <div><strong>Breathe & Focus:</strong> Open Still, put on headphones, and enjoy pure uninterrupted peace.</div>
            </div>
          </div>
        </div>

        {/* iPhone / iOS Note */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.015)', 
          borderRadius: '12px', 
          padding: '12px 14px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          fontSize: '11.5px',
          color: '#94a3b8',
          marginBottom: '20px'
        }}>
          <i className="fa-brands fa-apple" style={{ fontSize: '16px', color: '#cbd5e1' }}></i>
          <div>
            <strong>On iPhone?</strong> Open this page in Safari, tap <span style={{ color: '#ffffff' }}>Share ➔ Add to Home Screen</span> for the instant app!
          </div>
        </div>

        {/* Story & Philosophy */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '11px', fontStyle: 'italic' }}>
            "No tracking. No logins. No ads. No algorithms. Just pure peace."
          </p>
          <p style={{ color: '#475569', fontSize: '11px', marginTop: '4px' }}>
            crafted with care by <a href="https://github.com/Harixomxsingh" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '600' }}>hari</a>
          </p>
        </div>

      </div>
    </div>
  );
};
