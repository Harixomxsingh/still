import React from 'react';
import { Sliders, X, RotateCcw, Volume2, CloudRain, Wind, Waves, Music } from 'lucide-react';

export const StemMixer = ({ isOpen, onClose, stems, onStemChange, onResetStems }) => {
  if (!isOpen) return null;

  const STEM_CONFIG = [
    { key: 'pads', label: '432 Hz Ambient Pads', icon: Music, desc: 'Harmonic Solfeggio synth swells' },
    { key: 'brownian', label: '1/f² Brownian Rumble', icon: Wind, desc: 'Deep acoustic privacy mask' },
    { key: 'rain', label: 'Spatial Rainfall', icon: CloudRain, desc: 'Soft bandpass raindrops' },
    { key: 'binaural', label: 'Binaural Brainwaves', icon: Waves, desc: 'Alpha / Delta binaural wave entrainment' },
    { key: 'piano', label: 'Eno Piano Drops', icon: Volume2, desc: 'Acoustic pentatonic droplets' }
  ];

  return (
    <div className="modal-backdrop is-open" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Audio Stem Layer Mixer</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 300 }}>Custom tune each sound frequency layer to your room.</p>
            </div>
          </div>
          <button className="icon-action-btn" onClick={onClose} style={{ width: '30px', height: '30px' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sliders List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
          {STEM_CONFIG.map((item) => {
            const Icon = item.icon;
            const val = stems[item.key] ?? 0.5;
            return (
              <div 
                key={item.key} 
                style={{ 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  borderRadius: '16px', 
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#fff' }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--accent-primary)' }}>
                    {Math.round(val * 100)}%
                  </span>
                </div>
                
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={val} 
                  onChange={(e) => onStemChange(item.key, parseFloat(e.target.value))}
                  style={{ width: '100%', height: '4px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
                
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.desc}</span>
              </div>
            );
          })}
        </div>

        {/* Footer Reset */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Changes apply immediately</span>
          <button 
            className="pill-toggle-btn" 
            onClick={onResetStems}
            style={{ fontSize: '11px', gap: '5px' }}
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Calibrated</span>
          </button>
        </div>

      </div>
    </div>
  );
};
