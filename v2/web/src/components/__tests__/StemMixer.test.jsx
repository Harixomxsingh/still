import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StemMixer } from '../StemMixer';

describe('StemMixer Component', () => {
  const mockStems = {
    pads: 0.8,
    brownian: 0.4,
    rain: 0.2,
    binaural: 0.4,
    piano: 0.5,
  };

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <StemMixer
        isOpen={false}
        onClose={vi.fn()}
        stems={mockStems}
        onStemChange={vi.fn()}
        onResetStems={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders all 5 stem sliders when isOpen is true', () => {
    render(
      <StemMixer
        isOpen={true}
        onClose={vi.fn()}
        stems={mockStems}
        onStemChange={vi.fn()}
        onResetStems={vi.fn()}
      />
    );

    expect(screen.getByText('Audio Stem Layer Mixer')).toBeInTheDocument();
    expect(screen.getByText('432 Hz Ambient Pads')).toBeInTheDocument();
    expect(screen.getByText('1/f² Brownian Rumble')).toBeInTheDocument();
    expect(screen.getByText('Spatial Rainfall')).toBeInTheDocument();
    expect(screen.getByText('Binaural Brainwaves')).toBeInTheDocument();
    expect(screen.getByText('Eno Piano Drops')).toBeInTheDocument();
  });

  it('handles stem slider changes and reset button click', () => {
    const onStemChange = vi.fn();
    const onResetStems = vi.fn();

    render(
      <StemMixer
        isOpen={true}
        onClose={vi.fn()}
        stems={mockStems}
        onStemChange={onStemChange}
        onResetStems={onResetStems}
      />
    );

    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBe(5);

    fireEvent.change(sliders[0], { target: { value: '0.9' } });
    expect(onStemChange).toHaveBeenCalledWith('pads', 0.9);

    const resetBtn = screen.getByText('Reset to Calibrated');
    fireEvent.click(resetBtn);
    expect(onResetStems).toHaveBeenCalledTimes(1);
  });
});
