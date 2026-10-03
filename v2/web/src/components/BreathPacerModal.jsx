import React from 'react';
import { X, Wind, Heart, Moon, Shield, Check } from 'lucide-react';

export const BREATH_PATTERNS = [
  {
    id: 'coherence',
    name: '0.1 Hz Coherence',
    subtitle: 'HRV Resonance & Nervous Reset',
    timing: 'Inhale 5s • Exhale 5s (6 breaths/min)',
    description: 'Matches the optimal autonomic resonance frequency where Heart Rate Variability (HRV) reaches its peak.',
    icon: Heart,
    color: '#38bdf8'
  },
  {
    id: 'box',
    name: 'Box Breathing (4-4-4-4)',
    subtitle: 'Navy SEAL Stress Relief',
    timing: 'Inhale 4s • Hold 4s • Exhale 4s • Hold 4s',
    description: 'Used by high performers to immediately regain physiological calm and steady focus under pressure.',
    icon: Shield,
    color: '#10b981'
  },
  {
    id: 'relax_478',
    name: '4-7-8 Deep Rest',
    subtitle: 'Somatic Sleep & Parasympathetic Wind-Down',
    timing: 'Inhale 4s • Hold 7s • Exhale 8s',
    description: 'Dr. Andrew Weil technique that acts as a natural tranquilizer for the nervous system before sleep.',
    icon: Moon,
    color: '#c084fc'
  }
];

export const BreathPacerModal = ({
  isOpen,
  onClose,
  activePatternId = 'coherence',
  onSelectPattern
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop is-open"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(3, 5, 11, 0.82)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="modal-container"
        style={{
          maxWidth: '480px',
          width: '100%',
          maxHeight: '85vh',
          background: 'linear-gradient(165deg, rgba(16, 22, 38, 0.96) 0%, rgba(7, 10, 18, 0.98) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.9), 0 0 40px rgba(56, 189, 248, 0.12)',
          borderRadius: '28px',
          padding: '26px 24px',
          color: '#ffffff',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
                Resonant Breath Pacer
              </h3>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0', fontWeight: 300 }}>
                Synchronize the central halo to your nervous system
              </p>
            </div>
          </div>
          <button className="icon-action-btn" onClick={onClose} style={{ width: '30px', height: '30px' }} aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Breath Patterns List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
          {BREATH_PATTERNS.map((pattern) => {
            const Icon = pattern.icon;
            const isActive = pattern.id === activePatternId;

            return (
              <div
                key={pattern.id}
                onClick={() => {
                  onSelectPattern(pattern.id);
                  onClose();
                }}
                style={{
                  background: isActive ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.025)',
                  border: isActive ? `1px solid ${pattern.color}` : '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '20px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  boxShadow: isActive ? `0 0 25px ${pattern.color}33` : 'none',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px'
                }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: `${pattern.color}15`, border: `1px solid ${pattern.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: pattern.color, flexShrink: 0, marginTop: '2px' }}>
                  <Icon className="w-5 h-5" />
                </div>

                <div style={{ flexGrow: 1, minWidth: 0, textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: isActive ? pattern.color : '#ffffff', margin: 0 }}>
                      {pattern.name}
                    </h4>
                    {isActive && (
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: pattern.color, color: '#090d16', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: isActive ? '#7dd3fc' : '#94a3b8', margin: '3px 0 4px', fontWeight: 600 }}>
                    {pattern.timing}
                  </div>

                  <p style={{ fontSize: '11.5px', color: 'rgba(226, 232, 240, 0.75)', margin: 0, fontWeight: 300, lineHeight: 1.45 }}>
                    {pattern.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
