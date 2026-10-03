import React, { useState } from 'react';
import { 
  X, Bell, Activity, Clock, Sparkles, Sun, Moon, Sunrise, 
  RefreshCw, CheckCircle, ShieldCheck, Download, Smartphone, Flame, Cloud, Upload, Award
} from 'lucide-react';
import { SanctuarySyncService } from '../services/SanctuarySyncService';

export const SettingsModal = ({
  isOpen,
  onClose,
  todaySeconds,
  lifetimeSeconds,
  streakInfo,
  googleUser,
  onLinkGoogle,
  onUnlinkGoogle,
  notificationPrefs,
  onUpdatePref,
  onCheckUpdate,
  isCheckingUpdate,
  updateStatus,
  onOpenUpdateModal,
  isMobileApp
}) => {
  if (!isOpen) return null;

  const [importStatus, setImportStatus] = useState(null);

  const formatDuration = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    if (mins >= 60) {
      const hrs = (totalSec / 3600).toFixed(1);
      return `${hrs} hrs`;
    }
    return `${mins}m ${secs}s`;
  };

  const streak = streakInfo?.streak || 0;
  const progressPercent = streakInfo?.progressPercent || 0;
  const isGoalMet = streakInfo?.isGoalMetToday || false;

  const handleExport = () => {
    const data = SanctuarySyncService.exportSanctuaryData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `still-sanctuary-backup-${SanctuarySyncService.getTodayDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const success = SanctuarySyncService.importSanctuaryData(parsed);
        if (success) {
          setImportStatus('✅ Sanctuary data restored successfully!');
          setTimeout(() => window.location.reload(), 1200);
        } else {
          setImportStatus('❌ Invalid backup file.');
        }
      } catch (err) {
        setImportStatus('❌ Error parsing backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(5, 7, 13, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '480px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(160deg, rgba(15, 23, 42, 0.96), rgba(7, 10, 18, 0.98))',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.1)',
          borderRadius: '28px',
          padding: '28px 24px',
          color: '#ffffff',
          animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
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
            width: '34px',
            height: '34px',
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
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#38bdf8',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '6px'
            }}
          >
            <Activity size={13} />
            <span>Control Center</span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            Sanctuary &amp; Analytics
          </h2>
        </div>

        {/* 1. Daily Stillness Streak & Goal Progress */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Daily Habit &amp; Streak
          </div>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(255, 255, 255, 0.02))',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '20px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                  <Flame size={18} className="fill-amber-500" />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                    {streak > 0 ? `${streak}-Day Stillness Streak` : 'Start Your Streak Today'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {isGoalMet ? '✨ 5-minute daily habit completed!' : `${formatDuration(todaySeconds)} / 5m daily goal`}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#f59e0b', fontFamily: 'monospace' }}>
                {progressPercent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${progressPercent}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #f59e0b, #fbbf24)', 
                  borderRadius: '9999px',
                  transition: 'width 0.4s ease'
                }} 
              />
            </div>

            {/* Streak Milestone Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '2px' }}>
              {[
                { days: 3, label: '3-Day Coherence', unlocked: streak >= 3 },
                { days: 7, label: '7-Day Anchor', unlocked: streak >= 7 },
                { days: 21, label: '21-Day Master', unlocked: streak >= 21 },
              ].map((badge) => (
                <div 
                  key={badge.days}
                  style={{
                    background: badge.unlocked ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    border: badge.unlocked ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(255, 255, 255, 0.04)',
                    padding: '6px 8px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontSize: '10px',
                    color: badge.unlocked ? '#fbbf24' : '#64748b',
                    fontWeight: badge.unlocked ? 700 : 400
                  }}
                >
                  <div style={{ fontSize: '12px', marginBottom: '2px' }}>{badge.unlocked ? '🏆' : '🔒'}</div>
                  <div>{badge.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Presence Analytics Stats Grid */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Stillness Analytics
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {/* Today's Calm */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '18px',
                padding: '14px 16px',
              }}
            >
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={12} style={{ color: '#38bdf8' }} />
                <span>Today's Calm</span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', fontFamily: 'JetBrains Mono, monospace' }}>
                {formatDuration(todaySeconds)}
              </div>
            </div>

            {/* Lifetime Calm */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '18px',
                padding: '14px 16px',
              }}
            >
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={12} style={{ color: '#818cf8' }} />
                <span>Lifetime Presence</span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', fontFamily: 'JetBrains Mono, monospace' }}>
                {formatDuration(lifetimeSeconds)}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Optional 1-Tap Google Cross-Device Sync */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Cross-Device Continuity (Optional)
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <Cloud size={16} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                  {googleUser ? googleUser.email : 'Sync with Google (1-Tap)'}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  {googleUser ? 'Connected • Streaks synced across devices' : '100% optional • Sync streaks to phone & laptop'}
                </div>
              </div>
            </div>

            {googleUser ? (
              <button
                onClick={onUnlinkGoogle}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#fb7185',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={onLinkGoogle}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  color: '#38bdf8',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Connect
              </button>
            )}
          </div>

          {/* Export / Import Data */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={handleExport}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#cbd5e1',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Download size={13} />
              <span>Export Backup</span>
            </button>

            <label
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#cbd5e1',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Upload size={13} />
              <span>Import Backup</span>
              <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </label>
          </div>
          {importStatus && (
            <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '6px', textAlign: 'center' }}>
              {importStatus}
            </div>
          )}
        </div>

        {/* 4. Notification Preferences & Sovereignty */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Notification Sovereignty
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            
            {/* Milestone & Reward Alerts */}
            <ToggleRow
              icon={<Sparkles size={15} style={{ color: '#38bdf8' }} />}
              title="Milestone & Reward Chimes"
              subtitle="Celebratory sound & in-app wisdom (5m → 80m)"
              checked={notificationPrefs?.milestones}
              onChange={(val) => onUpdatePref('milestones', val)}
            />

            {/* Morning Intention */}
            <ToggleRow
              icon={<Sunrise size={15} style={{ color: '#f59e0b' }} />}
              title="Morning Calm Intention (8:30 AM)"
              subtitle="Gentle awakening reminder with active streak"
              checked={notificationPrefs?.morning}
              onChange={(val) => onUpdatePref('morning', val)}
            />

            {/* Midday Breath Reset */}
            <ToggleRow
              icon={<Sun size={15} style={{ color: '#fbbf24' }} />}
              title="Midday Reset (2:00 PM)"
              subtitle="60-second breathing & grounding invitation"
              checked={notificationPrefs?.midday}
              onChange={(val) => onUpdatePref('midday', val)}
            />

            {/* Evening Reflection */}
            <ToggleRow
              icon={<Moon size={15} style={{ color: '#a78bfa' }} />}
              title="Evening Reflection (9:45 PM)"
              subtitle="Daily stillness summary & sleep wind-down"
              checked={notificationPrefs?.evening}
              onChange={(val) => onUpdatePref('evening', val)}
            />

          </div>
        </div>

        {/* 5. In-App Updates & App Version */}
        <div>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            App Version &amp; Updates
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                Still Sanctuary v2.2.0
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                {updateStatus || 'Latest release installed'}
              </div>
            </div>

            <button
              onClick={onCheckUpdate}
              disabled={isCheckingUpdate}
              style={{
                height: '36px',
                padding: '0 14px',
                borderRadius: '12px',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                fontSize: '12px',
                fontWeight: 600,
                cursor: isCheckingUpdate ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <RefreshCw size={13} className={isCheckingUpdate ? 'spin-animate' : ''} />
              <span>{isCheckingUpdate ? 'Checking...' : 'Check Updates'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

const ToggleRow = ({ icon, title, subtitle, checked, onChange }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 14px',
      borderRadius: '16px',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      gap: '12px'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>{title}</div>
        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '1px' }}>{subtitle}</div>
      </div>
    </div>

    {/* Modern Toggle Switch */}
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: '42px',
        height: '24px',
        borderRadius: '9999px',
        background: checked ? '#38bdf8' : 'rgba(255, 255, 255, 0.15)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.2s ease',
        flexShrink: 0
      }}
    >
      <div
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: '#ffffff',
          position: 'absolute',
          top: '3px',
          left: checked ? '21px' : '3px',
          transition: 'left 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        }}
      />
    </div>
  </div>
);
