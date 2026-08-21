import React from 'react';
import { Leaf, X, ArrowRight } from 'lucide-react';

export const WelcomeCard = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        background: 'rgba(4, 6, 12, 0.78)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          background: 'var(--console-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '28px',
          padding: '28px 22px',
          backdropFilter: 'blur(30px)',
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px -10px var(--accent-glow)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '14px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="card-close-btn" 
          onClick={onClose} 
          title="Close Note"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--card-border)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Badge */}
        <div className="landing-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Leaf className="w-3 h-3 text-sky-400" />
          <span>A Note From the Creator</span>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Welcome to Still
        </h2>

        {/* Message */}
        <p style={{ fontSize: '13.5px', fontWeight: 300, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '370px' }}>
          I built this quiet space to help you calm your mind and room with research-backed soundscapes. No logins. No tracking. No ads. No algorithms. Just pure peace.
        </p>

        {/* Signature */}
        <div style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text-muted)', margin: '2px 0' }}>
          &mdash; <a href="https://github.com/Harixomxsingh" target="_blank" rel="noopener noreferrer" className="creator-link" style={{ color: 'var(--accent-primary)', fontWeight: 600 }} onClick={(e) => e.stopPropagation()}>hari</a>
        </div>

        {/* Action Button */}
        <button 
          className="master-play-button" 
          onClick={onClose}
          style={{ 
            width: '100%', 
            borderRadius: '9999px', 
            height: '44px', 
            fontSize: '13px', 
            fontWeight: 600, 
            gap: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginTop: '4px' 
          }}
        >
          <span>Continue to Still</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
