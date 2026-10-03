import React from 'react';
import { Sparkles, X, Heart, Compass, Leaf } from 'lucide-react';

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
        background: 'rgba(3, 5, 10, 0.85)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        animation: 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '440px',
          width: '100%',
          background: 'rgba(15, 20, 32, 0.94)',
          border: '1px solid rgba(251, 191, 36, 0.22)',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.9), 0 0 40px rgba(251, 191, 36, 0.15)',
          borderRadius: '32px',
          padding: '38px 28px 32px',
          textAlign: 'center',
          color: '#ffffff',
          overflow: 'hidden',
          animation: 'scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Golden Top Horizon Glow (Screen 08) */}
        <div 
          style={{
            position: 'absolute',
            top: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '260px',
            height: '140px',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 2
          }}
          aria-label="Close"
        >
          <X size={15} />
        </button>

        {/* Leaf Golden Radiant Emblem (Screen 08) */}
        <div 
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'rgba(251, 191, 36, 0.12)',
            border: '1px solid rgba(251, 191, 36, 0.32)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 25px rgba(251, 191, 36, 0.2)'
          }}
        >
          <Leaf className="w-6 h-6 text-amber-300" />
        </div>

        {/* Milestone Ethereal Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 14px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#e2e8f0',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '14px'
          }}
        >
          <Sparkles size={12} className="text-amber-400" />
          <span>{milestone.label} Habit Milestone</span>
        </div>

        {/* Hero Title: "You stayed." (Screen 08) */}
        <h2
          className="font-serif-hero"
          style={{
            fontSize: '38px',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            margin: '0 0 4px',
            lineHeight: 1.1,
            textShadow: '0 0 30px rgba(251, 191, 36, 0.3)'
          }}
        >
          You stayed.
        </h2>

        {/* Milestone Specific Designation Title */}
        <div
          style={{
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.01em',
            color: '#fbbf24',
            margin: '0 0 14px',
            opacity: 0.95
          }}
        >
          {milestone.title}
        </div>

        {/* Affirmation Message */}
        <p
          style={{
            fontSize: '14px',
            color: '#cbd5e1',
            lineHeight: 1.6,
            margin: '0 auto 20px',
            maxWidth: '340px',
            fontWeight: 300
          }}
        >
          {milestone.message}
        </p>

        {/* Unlocked Wisdom Quote: Natural, uncluttered poetry style */}
        {quote && (
          <div
            style={{
              padding: '16px 20px',
              margin: '0 0 24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              textAlign: 'center'
            }}
          >
            <p
              style={{
                fontSize: '14px',
                fontStyle: 'italic',
                color: '#f1f5f9',
                lineHeight: 1.65,
                margin: '0 0 8px',
                fontWeight: 300,
                letterSpacing: '0.01em'
              }}
            >
              “{quote.text}”
            </p>
            <div
              style={{
                fontSize: '11.5px',
                color: '#94a3b8',
                fontWeight: 500,
                letterSpacing: '0.03em'
              }}
            >
              — {quote.author}
            </div>
          </div>
        )}

        {/* Action Button: Tactile frosted amber pill */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            height: '46px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.22) 0%, rgba(217, 119, 6, 0.18) 100%)',
            border: '1px solid rgba(251, 191, 36, 0.4)',
            color: '#fffbeb',
            fontSize: '13.5px',
            fontWeight: 600,
            letterSpacing: '0.02em',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 0 25px rgba(251, 191, 36, 0.25)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <Sparkles size={15} className="text-amber-300" />
          <span>Return to Stillness</span>
        </button>
      </div>
    </div>
  );
};
