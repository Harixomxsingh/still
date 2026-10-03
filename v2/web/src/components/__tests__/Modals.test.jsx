import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AboutModal } from '../AboutModal';
import { SettingsModal } from '../SettingsModal';
import { MilestoneRewardModal } from '../MilestoneRewardModal';
import { DownloadModal } from '../DownloadModal';
import { StreakDashboardModal } from '../StreakDashboardModal';
import { BreathPacerModal } from '../BreathPacerModal';
import { MILESTONES } from '../../App';

describe('Modal Components Suite', () => {
  describe('AboutModal', () => {
    it('does not render when closed', () => {
      const { container } = render(<AboutModal isOpen={false} onClose={vi.fn()} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders origin story and science principles when opened', () => {
      render(<AboutModal isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByText('About Still')).toBeInTheDocument();
      expect(screen.getByText(/Why I Built Still/i)).toBeInTheDocument();
    });
  });

  describe('SettingsModal', () => {
    const mockPrefs = { morning: true, midday: true, evening: true };

    it('does not render when closed', () => {
      const { container } = render(
        <SettingsModal
          isOpen={false}
          onClose={vi.fn()}
          todaySeconds={300}
          lifetimeSeconds={1200}
          currentMilestoneLabel="5 Minutes"
          notificationPrefs={mockPrefs}
          onUpdatePref={vi.fn()}
          onCheckUpdate={vi.fn()}
          isCheckingUpdate={false}
          updateStatus={null}
          onOpenUpdateModal={vi.fn()}
          isMobileApp={false}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders session statistics and notification toggles', () => {
      render(
        <SettingsModal
          isOpen={true}
          onClose={vi.fn()}
          todaySeconds={300}
          lifetimeSeconds={1200}
          currentMilestoneLabel="5 Minutes"
          notificationPrefs={mockPrefs}
          onUpdatePref={vi.fn()}
          onCheckUpdate={vi.fn()}
          isCheckingUpdate={false}
          updateStatus={null}
          onOpenUpdateModal={vi.fn()}
          isMobileApp={false}
        />
      );

      expect(screen.getByText(/Sanctuary & Analytics/i)).toBeInTheDocument();
      expect(screen.getByText('5m 0s')).toBeInTheDocument();
      expect(screen.getByText('20m 0s')).toBeInTheDocument();
    });
  });

  describe('MilestoneRewardModal', () => {
    const mockMilestone = MILESTONES[0];
    const mockQuote = { text: 'Calm is a superpower.', author: 'Naval Ravikant' };

    it('does not render when closed or milestone is null', () => {
      const { container } = render(
        <MilestoneRewardModal
          isOpen={false}
          milestone={null}
          quote={mockQuote}
          onClose={vi.fn()}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders unlocked milestone details and reward title', () => {
      render(
        <MilestoneRewardModal
          isOpen={true}
          milestone={mockMilestone}
          quote={mockQuote}
          onClose={vi.fn()}
        />
      );

      expect(screen.getByText(mockMilestone.title)).toBeInTheDocument();
      expect(screen.getByText(mockMilestone.message)).toBeInTheDocument();
    });
  });

  describe('DownloadModal', () => {
    it('does not render when closed', () => {
      const { container } = render(<DownloadModal isOpen={false} onClose={vi.fn()} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders APK download button and instructions when opened', () => {
      render(<DownloadModal isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByText(/Get Still on Your Phone/i)).toBeInTheDocument();
      expect(screen.getByText(/Download Still for Android/i)).toBeInTheDocument();
    });
  });

  describe('StreakDashboardModal', () => {
    it('does not render when closed', () => {
      const { container } = render(<StreakDashboardModal isOpen={false} onClose={vi.fn()} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders 16-week matrix, streak count, mindful hours, and habit status when opened', () => {
      render(
        <StreakDashboardModal
          isOpen={true}
          onClose={vi.fn()}
          streakInfo={{ streak: 5, longestStreak: 12, isGoalMetToday: true }}
          todaySeconds={350}
          lifetimeSeconds={7200}
        />
      );
      expect(screen.getByText('Stillness Practice & Streak')).toBeInTheDocument();
      expect(screen.getByText('16-Week Consistency Matrix')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('2.0')).toBeInTheDocument();
      expect(screen.getByText("Today's Stillness Completed!")).toBeInTheDocument();
    });
  });

  describe('BreathPacerModal', () => {
    it('does not render when closed', () => {
      const { container } = render(<BreathPacerModal isOpen={false} onClose={vi.fn()} onSelectPattern={vi.fn()} activePatternId="coherence" />);
      expect(container.firstChild).toBeNull();
    });

    it('renders breath patterns and allows selection', () => {
      const onSelect = vi.fn();
      render(<BreathPacerModal isOpen={true} onClose={vi.fn()} onSelectPattern={onSelect} activePatternId="coherence" />);
      expect(screen.getByText('Resonant Breath Pacer')).toBeInTheDocument();
      expect(screen.getByText('0.1 Hz Coherence')).toBeInTheDocument();
      expect(screen.getByText(/Box Breathing/)).toBeInTheDocument();
      expect(screen.getByText('4-7-8 Deep Rest')).toBeInTheDocument();

      fireEvent.click(screen.getByText(/Box Breathing/));
      expect(onSelect).toHaveBeenCalledWith('box');
    });
  });
});
