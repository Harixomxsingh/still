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
        background: 'rgba(3, 5, 10, 0.82)',
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
          background: 'rgba(15, 20, 32, 0.92)',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.85), 0 0 1px rgba(255, 255, 255, 0.2)',
          borderRadius: '32px',
          padding: '36px 28px 32px',
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
            transition: 'all 0.2s ease'
          }}
          aria-label="Close"
        >
          <X size={15} />
        </button>

        {/* Milestone Ethereal Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 14px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#e2e8f0',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '18px'
          }}
        >
          <Sparkles size={12} className="text-amber-400" />
          <span>{milestone.label} Habit Milestone</span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: '25px',
            fontWeight: 700,
            letterSpacing: '-0.03em',
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
            fontSize: '13.5px',
            color: '#94a3b8',
            lineHeight: 1.6,
            margin: '0 auto 24px',
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
              margin: '0 0 28px',
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
                color: '#64748b',
                fontWeight: 500,
                letterSpacing: '0.03em'
              }}
            >
              — {quote.author}
            </div>
          </div>
        )}

        {/* Action Button: Tactile frosted glass pill */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            height: '46px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            fontSize: '13.5px',
            fontWeight: 600,
            letterSpacing: '0.02em',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="master-play-button"
        >
          <Heart size={15} className="text-rose-400" />
          <span>Continue in Stillness</span>
        </button>
      </div>
    </div>
  );
};
