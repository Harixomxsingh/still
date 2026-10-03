import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BreathingHalo } from '../BreathingHalo';

describe('BreathingHalo Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders default state when not playing', () => {
    render(<BreathingHalo isPlaying={false} onTogglePlay={vi.fn()} />);
    expect(screen.getByText(/Breathe/i)).toBeInTheDocument();
  });

  it('progresses through Inhale -> Hold -> Exhale phases when playing', () => {
    const { rerender } = render(<BreathingHalo isPlaying={true} onTogglePlay={vi.fn()} />);

    // Inhale phase (0s)
    expect(screen.getByText('Inhale')).toBeInTheDocument();

    // Advance 4 seconds -> Hold phase
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByText('Hold')).toBeInTheDocument();

    // Advance 2 seconds -> Exhale phase
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText('Exhale')).toBeInTheDocument();
  });

  it('triggers onTogglePlay on click', () => {
    const onTogglePlay = vi.fn();
    render(<BreathingHalo isPlaying={false} onTogglePlay={onTogglePlay} />);

    const button = screen.getByTitle(/Play \(Space\)/i);
    fireEvent.click(button);
    expect(onTogglePlay).toHaveBeenCalledTimes(1);
  });
});
