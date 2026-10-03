import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MonolithPlayer } from '../MonolithPlayer';
import { SOUNDSCAPES, THEMES } from '../../../../shared/soundscapes';

describe('MonolithPlayer Component', () => {
  const mockTrack = SOUNDSCAPES[0];
  const mockTheme = THEMES[0];
  const mockQuote = { text: 'Calm is a superpower.', author: 'Naval Ravikant' };

  it('renders track title, purpose, science, and quote accurately', () => {
    render(
      <MonolithPlayer
        track={mockTrack}
        quote={mockQuote}
        isPlaying={false}
        volume={0.75}
        isMuted={false}
        sleepTimer={null}
        theme={mockTheme}
        onTogglePlay={vi.fn()}
        onNext={vi.fn()}
        onPrev={vi.fn()}
        onVolumeChange={vi.fn()}
        onToggleMute={vi.fn()}
        onCycleTimer={vi.fn()}
        onCycleTheme={vi.fn()}
        onToggleFullScreen={vi.fn()}
        onOpenLibrary={vi.fn()}
        onOpenMixer={vi.fn()}
        onOpenSettings={vi.fn()}
        onOpenAbout={vi.fn()}
        onOpenNote={vi.fn()}
        onOpenDownload={vi.fn()}
        isMobileApp={false}
      />
    );

    expect(screen.getByText(mockTrack.title)).toBeInTheDocument();
    expect(screen.getByText(mockTrack.science)).toBeInTheDocument();
    expect(screen.getByText(/Calm is a superpower/)).toBeInTheDocument();
    expect(screen.getByText(/Naval Ravikant/)).toBeInTheDocument();
  });

  it('handles play/pause button clicks', () => {
    const onTogglePlay = vi.fn();
    render(
      <MonolithPlayer
        track={mockTrack}
        quote={mockQuote}
        isPlaying={false}
        volume={0.75}
        isMuted={false}
        sleepTimer={null}
        theme={mockTheme}
        onTogglePlay={onTogglePlay}
        onNext={vi.fn()}
        onPrev={vi.fn()}
        onVolumeChange={vi.fn()}
        onToggleMute={vi.fn()}
        onCycleTimer={vi.fn()}
        onCycleTheme={vi.fn()}
        onToggleFullScreen={vi.fn()}
        onOpenLibrary={vi.fn()}
        onOpenMixer={vi.fn()}
        onOpenSettings={vi.fn()}
        onOpenAbout={vi.fn()}
        onOpenNote={vi.fn()}
        onOpenDownload={vi.fn()}
        isMobileApp={false}
      />
    );

    const playBtns = screen.getAllByTitle(/Play \(Space\)/i);
    expect(playBtns.length).toBeGreaterThan(0);
    fireEvent.click(playBtns[0]);
    expect(onTogglePlay).toHaveBeenCalledTimes(1);
  });

  it('handles track navigation and modal opening callbacks', () => {
    const onNext = vi.fn();
    const onPrev = vi.fn();
    const onOpenLibrary = vi.fn();
    const onOpenMixer = vi.fn();

    render(
      <MonolithPlayer
        track={mockTrack}
        quote={mockQuote}
        isPlaying={true}
        volume={0.75}
        isMuted={false}
        sleepTimer={null}
        theme={mockTheme}
        onTogglePlay={vi.fn()}
        onNext={onNext}
        onPrev={onPrev}
        onVolumeChange={vi.fn()}
        onToggleMute={vi.fn()}
        onCycleTimer={vi.fn()}
        onCycleTheme={vi.fn()}
        onToggleFullScreen={vi.fn()}
        onOpenLibrary={onOpenLibrary}
        onOpenMixer={onOpenMixer}
        onOpenSettings={vi.fn()}
        onOpenAbout={vi.fn()}
        onOpenNote={vi.fn()}
        onOpenDownload={vi.fn()}
        isMobileApp={false}
      />
    );

    const nextBtn = screen.getByTitle(/Next Soundscape/i);
    fireEvent.click(nextBtn);
    expect(onNext).toHaveBeenCalledTimes(1);

    const prevBtn = screen.getByTitle(/Previous Soundscape/i);
    fireEvent.click(prevBtn);
    expect(onPrev).toHaveBeenCalledTimes(1);
  });
});
