import React from 'react';
import { X, Music } from 'lucide-react';
import { SOUNDSCAPES } from '../../../shared/soundscapes.js';

export const SoundscapeModal = ({ isOpen, onClose, currentTrackIndex, isPlaying, onSelectTrack }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop is-open" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>Neuro-Acoustic Soundscapes</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 300 }}>Research-backed frequencies for deep calm.</p>
          </div>
          <button className="icon-action-btn" onClick={onClose} style={{ width: '30px', height: '30px' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', color: 'var(--accent-primary)', flexShrink: 0 }}>
                  <i className={`fa-solid ${track.icon}`}></i>
                </div>
                <div style={{ flexGrow: 1, minWidth: 0, textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h5 style={{ fontSize: '13px', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {track.title}
                    </h5>
                    {isActive && isPlaying && <span className="pulsing-indicator" />}
                  </div>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '2px' }}>
                    {track.science}
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
