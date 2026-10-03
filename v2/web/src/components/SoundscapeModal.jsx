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
                  padding: '10px 12px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  border: isActive ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                  background: isActive ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.025)',
                  boxShadow: isActive ? '0 0 20px rgba(56, 189, 248, 0.15)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {/* Visual Artwork Thumbnail */}
                <div style={{ position: 'relative', width: '56px', height: '42px', flexShrink: 0, borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <img 
                    src={track.artwork || './thumb_alpha_sanctuary.jpg'} 
                    alt={track.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  {isActive && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(56, 189, 248, 0.2)' }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ flexGrow: 1, minWidth: 0, textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <h5 style={{ 
                      fontSize: '13px', 
                      fontWeight: isActive ? 700 : 600, 
                      color: isActive ? 'var(--accent-primary)' : '#f8fafc', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap',
                      margin: 0
                    }}>
                      {track.title}
                    </h5>
                  </div>

                  {/* Essential Purpose */}
                  <p style={{ 
                    fontSize: '11px', 
                    color: isActive ? '#94a3b8' : 'var(--text-muted)', 
                    marginTop: '2px',
                    marginBottom: 0,
                    fontWeight: 300,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {track.purpose || track.science}
                  </p>
                </div>

                {/* Play Circle Action Indicator */}
                <div style={{ 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '50%', 
                  background: isActive ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)', 
                  border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: isActive ? '#05070d' : '#94a3b8', 
                  flexShrink: 0,
                  fontSize: '11px'
                }}>
                  <i className="fa-solid fa-play" style={{ marginLeft: '1px' }}></i>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
