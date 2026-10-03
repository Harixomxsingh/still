import React from 'react';
import { X, Check, Target, Moon, Ban } from 'lucide-react';

export const SessionTimerModal = ({
  isOpen,
  onClose,
  sleepTimer,
  onSelectTimer
}) => {
  if (!isOpen) return null;

  const currentMins = sleepTimer !== null ? Math.round(sleepTimer / 60) : null;

  const TIMER_OPTIONS = [
    { id: 'habit_5m', label: 'Habit (5 minutes)', minutes: null, isHabit: true, icon: Target },
    { id: 'sleep_15m', label: 'Sleep (15 minutes)', minutes: 15, isHabit: false, icon: Moon },
    { id: 'sleep_30m', label: 'Sleep (30 minutes)', minutes: 30, isHabit: false, icon: Moon },
    { id: 'sleep_45m', label: 'Sleep (45 minutes)', minutes: 45, isHabit: false, icon: Moon },
    { id: 'sleep_60m', label: 'Sleep (60 minutes)', minutes: 60, isHabit: false, icon: Moon },
    { id: 'timer_off', label: 'Off', minutes: null, isHabit: false, isOff: true, icon: Ban },
  ];

  return (
    <div className="modal-backdrop is-open" onClick={onClose} style={{ zIndex: 160 }}>
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '380px',
          background: 'rgba(11, 16, 28, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '20px',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9)'
        }}
      >
        {/* Header (Screen 05) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>Session Timer</h3>
          <button 
            className="icon-action-btn" 
            onClick={onClose} 
            style={{ width: '28px', height: '28px' }}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
          {TIMER_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = opt.isHabit 
              ? (currentMins === null || currentMins === 5)
              : opt.isOff 
                ? (currentMins === null)
                : (currentMins === opt.minutes);

            return (
              <button
                key={opt.id}
                onClick={() => {
                  if (opt.isOff) {
                    onSelectTimer(null);
                  } else if (opt.isHabit) {
                    onSelectTimer(null); // Return to default habit tracking
                  } else {
                    onSelectTimer(opt.minutes * 60);
                  }
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.025)',
                  border: `1px solid ${isSelected ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.06)'}`,
                  color: isSelected ? '#ffffff' : '#cbd5e1',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span style={{ fontSize: '13px', fontWeight: isSelected ? 600 : 400 }}>{opt.label}</span>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-sky-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
