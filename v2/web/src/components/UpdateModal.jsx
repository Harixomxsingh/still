import React from 'react';
import { Sparkles, X, Check, ArrowRight, Download, RefreshCw } from 'lucide-react';

export const UpdateModal = ({
  isOpen,
  onClose,
  updateInfo,
  onApplyUpdate
}) => {
  if (!isOpen || !updateInfo) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 950,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        background: 'rgba(5, 7, 13, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '440px',
          width: '100%',
          background: 'linear-gradient(150deg, rgba(14, 22, 40, 0.98), rgba(7, 10, 18, 0.99))',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 50px rgba(56, 189, 248, 0.2)',
          borderRadius: '28px',
          padding: '32px 24px 28px',
          textAlign: 'center',
          color: '#ffffff',
          animation: 'scaleUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}
        >
          <Sparkles size={14} />
          <span>New Update v{updateInfo.version}</span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            margin: '0 0 8px',
            lineHeight: 1.2
          }}
        >
          {updateInfo.title || "What's New in Still"}
        </h2>

        {/* Release Date */}
        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 20px' }}>
          Released {updateInfo.releaseDate || 'Recently'}
        </p>

        {/* Highlights List */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '20px',
            padding: '16px 18px',
            marginBottom: '24px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          {updateInfo.highlights?.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px'
                }}
              >
                <Check size={11} />
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Update Action Button */}
        <button
          onClick={onApplyUpdate}
          style={{
            width: '100%',
            height: '48px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
            border: 'none',
            color: '#05070d',
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.02em',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(56, 189, 248, 0.3)',
            transition: 'transform 0.2s ease, filter 0.2s ease'
          }}
        >
          <RefreshCw size={16} />
          <span>Apply Update &amp; Reload</span>
        </button>
      </div>
    </div>
  );
};
