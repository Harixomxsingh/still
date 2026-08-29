import React from 'react';
import { Sparkles, X, Heart, Compass } from 'lucide-react';

export const MilestoneRewardModal = ({
  milestone,
  quote,
  isOpen,
  onClose
}) => {
  if (!isOpen || !milestone) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        background: 'rgba(5, 7, 13, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        animation: 'fadeIn 0.4s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '420px',
          width: '100%',
          background: 'linear-gradient(145deg, rgba(13, 19, 33, 0.95), rgba(7, 10, 18, 0.98))',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.15)',
          borderRadius: '28px',
          padding: '32px 24px 28px',
          textAlign: 'center',
          color: '#ffffff',
          animation: 'scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
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

        {/* Milestone Glowing Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            color: '#38bdf8',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}
        >
          <Sparkles size={14} />
          <span>{milestone.label} Milestone</span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            margin: '0 0 10px',
            lineHeight: 1.2
          }}
        >
          {milestone.title}
        </h2>

        {/* Affirmation Message */}
        <p
          style={{
            fontSize: '14px',
            color: '#94a3b8',
            lineHeight: 1.6,
            margin: '0 0 24px',
            fontWeight: 300
          }}
        >
          {milestone.message}
        </p>

        {/* Unlocked Wisdom Quote Box */}
        {quote && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '20px 18px',
              marginBottom: '24px',
              textAlign: 'left',
              position: 'relative'
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#38bdf8',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Compass size={13} />
              <span>Unlocked Wisdom</span>
            </div>
            <p
              style={{
                fontSize: '14px',
                fontStyle: 'italic',
                color: '#e2e8f0',
                lineHeight: 1.6,
                margin: '0 0 8px',
                fontFamily: 'serif'
              }}
            >
              "{quote.text}"
            </p>
            <div
              style={{
                fontSize: '12px',
                color: '#64748b',
                fontWeight: 500,
                textAlign: 'right'
              }}
            >
              — {quote.author}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            height: '48px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
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
          <Heart size={16} />
          <span>Continue in Sanctuary</span>
        </button>
      </div>
    </div>
  );
};
