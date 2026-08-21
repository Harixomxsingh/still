import React from 'react';
import { X } from 'lucide-react';
import { SOUNDSCAPES } from '../../../shared/soundscapes.js';

export const SoundscapeModal = ({ isOpen, onClose, currentTrackIndex, isPlaying, onSelectTrack }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop is-open" onClick={onClose}>
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px', maxHeight: '82vh' }}
      >
        
        {/* Minimalist Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>Neuro-Acoustic Soundscapes</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 300, marginTop: '2px' }}>Select the calm state you need right now</p>
          </div>
          <button className="icon-action-btn" onClick={onClose} style={{ width: '30px', height: '30px' }} aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Radically Simple Purpose-Driven List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
          {SOUNDSCAPES.map((track, idx) => {
            const isActive = idx === currentTrackIndex;
            return (
              <div 
                key={track.id}
                className={`mood-card ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  onSelectTrack(idx);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--accent-primary)' : '1px solid rgba(255, 255, 255, 0.05)',
                  background: isActive ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {/* Icon */}
                <div style={{ 
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.04)', 
                  color: isActive ? 'var(--accent-primary)' : '#94a3b8', 
                  flexShrink: 0,
                  fontSize: '14px'
                }}>
                  <i className={`fa-solid ${track.icon || 'fa-water'}`}></i>
                </div>

                {/* Content */}
                <div style={{ flexGrow: 1, minWidth: 0, textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <h5 style={{ 
                      fontSize: '13.5px', 
                      fontWeight: isActive ? 700 : 600, 
                      color: isActive ? 'var(--accent-primary)' : '#f8fafc', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap',
                      margin: 0
                    }}>
                      {track.title}
                    </h5>
                    
                    {/* Frequency Pill on Right */}
                    <span style={{ 
                      fontSize: '10px', 
                      fontFamily: 'monospace', 
                      color: isActive ? 'var(--accent-primary)' : '#64748b',
                      background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                      border: isActive ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(255, 255, 255, 0.04)'
                    }}>
                      {track.science.split('•')[0].trim()}
                    </span>
                  </div>

                  {/* Essential Purpose */}
                  <p style={{ 
                    fontSize: '11px', 
                    color: isActive ? '#cbd5e1' : 'var(--text-secondary)', 
                    marginTop: '3px',
                    marginBottom: 0,
                    fontWeight: 400
                  }}>
                    {track.purpose || track.science}
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
