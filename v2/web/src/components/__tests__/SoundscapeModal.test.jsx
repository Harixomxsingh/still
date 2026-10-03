import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SoundscapeModal } from '../SoundscapeModal';
import { SOUNDSCAPES } from '../../../../shared/soundscapes';

describe('SoundscapeModal Component', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <SoundscapeModal
        isOpen={false}
        onClose={vi.fn()}
        currentTrackIndex={0}
        isPlaying={false}
        onSelectTrack={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders all soundscapes in the database when isOpen is true', () => {
    render(
      <SoundscapeModal
        isOpen={true}
        onClose={vi.fn()}
        currentTrackIndex={0}
        isPlaying={false}
        onSelectTrack={vi.fn()}
      />
    );

    expect(screen.getByText('Neuro-Acoustic Soundscapes')).toBeInTheDocument();
    SOUNDSCAPES.forEach((track) => {
      expect(screen.getByText(track.title)).toBeInTheDocument();
    });
  });

  it('handles track selection and modal closing', () => {
    const onSelectTrack = vi.fn();
    const onClose = vi.fn();

    render(
      <SoundscapeModal
        isOpen={true}
        onClose={onClose}
        currentTrackIndex={0}
        isPlaying={false}
        onSelectTrack={onSelectTrack}
      />
    );

    const secondTrack = screen.getByText(SOUNDSCAPES[1].title);
    fireEvent.click(secondTrack);

    expect(onSelectTrack).toHaveBeenCalledWith(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
