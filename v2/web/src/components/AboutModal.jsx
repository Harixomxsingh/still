import React from 'react';
import { X, Sprout, Quote, Hammer, Brain, Compass, ExternalLink } from 'lucide-react';

export const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop is-open" onClick={onClose}>
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '540px', maxHeight: '85vh' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>About Still</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 300 }}>Origin, purpose, and the science of calm.</p>
            </div>
          </div>
          <button className="icon-action-btn" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'left', marginTop: '6px', fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
          
          {/* 1. Origin & Purpose */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '18px', padding: '18px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Quote className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
              <span>Why I Built Still (The Origin &amp; Purpose)</span>
            </h4>
            <p style={{ marginBottom: '10px', fontWeight: 300 }}>
              Recently, while sitting in my room working on my computer, I realized that calming ambient music had a profound ability to settle my racing thoughts and completely transform the atmosphere of the room.
            </p>
            <p style={{ marginBottom: '10px', fontWeight: 300 }}>
              Naturally, I’d open YouTube or streaming platforms to connect my Bluetooth speaker and put on some ambient audio. But the moment I opened the app, I was instantly bombarded by algorithmic feeds, clickbait thumbnails, and recommendations. Before I knew it, an hour had evaporated—I went in seeking peace, but walked away distracted and overstimulated.
            </p>
            <p style={{ marginBottom: '12px', fontWeight: 300 }}>
              The modern internet is engineered to capture your attention, not to give you stillness. I built <strong style={{ color: '#fff' }}>Still</strong> to solve this single problem: to create a radically simple, distraction-free sanctuary where calming your nervous system is the sole purpose. No logins, no feeds, no decision fatigue.
            </p>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right' }}>
              &mdash; <a href="https://github.com/Harixomxsingh" target="_blank" rel="noopener noreferrer" className="creator-link" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>hari</a>
            </div>
          </div>

          {/* 2. Active Dev Notice */}
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#34d399' }}>
                <Hammer className="w-3.5 h-3.5" />
                <span>🟢 Silent Auto-Update Active</span>
              </div>
              <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', fontFamily: 'monospace' }}>
                v2.0.2 Live
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 300, lineHeight: '1.6', margin: 0 }}>
              ✨ Live Over-The-Air Update Test Successful! [v2.0.2 Verified] Any new features or soundscapes pushed to GitHub now appear on your phone automatically in real time.
            </p>
          </div>

          {/* 3. Neuro-Acoustic Science */}
          <div>
            <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: '#fff', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Brain className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
              <span>The Neuro-Acoustic Science</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '10px 12px', borderRadius: '12px' }}>
                <span style={{ fontWeight: 600, color: '#fff', fontSize: '12px' }}>• 432 Hz &amp; 528 Hz Harmonic Tuning:</span>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Natural acoustic resonance that encourages slower heart rate and lower cortisol levels.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '10px 12px', borderRadius: '12px' }}>
                <span style={{ fontWeight: 600, color: '#fff', fontSize: '12px' }}>• 1/f² Deep Brownian Noise:</span>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Deep spectral rumble that settles amygdala alarm responses and masks distracting room noises.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '10px 12px', borderRadius: '12px' }}>
                <span style={{ fontWeight: 600, color: '#fff', fontSize: '12px' }}>• 0.1 Hz Resonant Breathing:</span>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Visual halo pulses at 6 breaths/min—the resonant pace where Heart Rate Variability (HRV) reaches its peak.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '10px 12px', borderRadius: '12px' }}>
                <span style={{ fontWeight: 600, color: '#fff', fontSize: '12px' }}>• Binaural Wave Entrainment:</span>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Auditory steady-state frequencies (Alpha 10Hz, Delta 2.5Hz) that guide brainwaves into restorative calm.</p>
              </div>
            </div>
          </div>

          {/* 4. Three Daily Rituals */}
          <div>
            <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: '#fff', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
              <span>3 Simple Daily Rituals</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                💼 <strong style={{ color: '#fff' }}>Deep Focus Block:</strong> Put on headphones, select <em>Deep Flow</em>, and let the acoustic noise shield protect your attention.
              </div>
              <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                🌙 <strong style={{ color: '#fff' }}>Evening Wind Down:</strong> Set a 30m Sleep Timer with <em>Deep Delta</em> or <em>Forest Dusk</em> to prepare for deep sleep.
              </div>
              <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                🫁 <strong style={{ color: '#fff' }}>2-Minute Reset:</strong> Follow the glowing central halo: Inhale 4s, Hold 2s, Exhale 4s to reset your nervous system.
              </div>
            </div>
          </div>

          {/* 5. Privacy & Open Source */}
          <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <span>🛡️ 100% Client-Side • Zero Trackers • Zero Ads</span>
            <a href="https://github.com/Harixomxsingh/still" target="_blank" rel="noopener noreferrer" className="creator-link" style={{ fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
