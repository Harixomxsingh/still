import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { App, MILESTONES } from '../App';
import { SOUNDSCAPES } from '../../../shared/soundscapes';

describe('App Main Application Component & Flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders initial Welcome Note on first arrival', () => {
    render(<App />);

    expect(screen.getByText('Welcome to Still')).toBeInTheDocument();
    expect(screen.getByText(/A Note From the Creator/i)).toBeInTheDocument();
    expect(screen.getByText(/Continue to Still/i)).toBeInTheDocument();
  });

  it('progresses from Welcome Note to Home Gateway', () => {
    render(<App />);

    const continueBtn = screen.getByText(/Continue to Still/i);
    fireEvent.click(continueBtn);

    expect(screen.getByText(/Neuro-Acoustic Sanctuary/i)).toBeInTheDocument();
    expect(screen.getByText(/Enter Calm Space/i)).toBeInTheDocument();
  });

  it('progresses from Home Gateway to Monolith Player and toggles playback', () => {
    render(<App />);

    // Step 1: Dismiss Welcome Note
    const continueBtn = screen.getByText(/Continue to Still/i);
    fireEvent.click(continueBtn);

    // Step 2: Enter Sanctuary into Monolith Player
    const enterBtn = screen.getByText(/Enter Calm Space/i);
    fireEvent.click(enterBtn);

    // Step 3: Verify Monolith Player is active and playing
    expect(screen.getByText(SOUNDSCAPES[0].title)).toBeInTheDocument();

    const pauseBtns = screen.getAllByTitle(/Pause \(Space\)/i);
    expect(pauseBtns.length).toBeGreaterThan(0);

    // Pause
    fireEvent.click(pauseBtns[0]);
    const playBtns = screen.getAllByTitle(/Play \(Space\)/i);
    expect(playBtns.length).toBeGreaterThan(0);

    // Resume Play
    fireEvent.click(playBtns[0]);
    expect(screen.getAllByTitle(/Pause \(Space\)/i).length).toBeGreaterThan(0);
  });

  it('navigates soundscapes using Next / Prev in Monolith Player', () => {
    render(<App />);

    // Dismiss welcome & gateway
    fireEvent.click(screen.getByText(/Continue to Still/i));
    fireEvent.click(screen.getByText(/Enter Calm Space/i));

    const nextBtn = screen.getByTitle(/Next Soundscape \(N\)/i);
    fireEvent.click(nextBtn);
    expect(screen.getByText(SOUNDSCAPES[1].title)).toBeInTheDocument();

    const prevBtn = screen.getByTitle(/Previous Soundscape \(P\)/i);
    fireEvent.click(prevBtn);
    expect(screen.getByText(SOUNDSCAPES[0].title)).toBeInTheDocument();
  });

  it('opens and closes the soundscape selector modal inside Monolith Player', () => {
    render(<App />);

    // Dismiss welcome & gateway
    fireEvent.click(screen.getByText(/Continue to Still/i));
    fireEvent.click(screen.getByText(/Enter Calm Space/i));

    const openLibraryBtns = screen.getAllByTitle(/Soundscape Library/i);
    expect(openLibraryBtns.length).toBeGreaterThan(0);

    fireEvent.click(openLibraryBtns[0]);
    expect(screen.getByText('Neuro-Acoustic Soundscapes')).toBeInTheDocument();

    const closeBtn = screen.getByLabelText('Close');
    fireEvent.click(closeBtn);
    expect(screen.queryByText('Neuro-Acoustic Soundscapes')).not.toBeInTheDocument();
  });

  it('triggers 1-Tap SOS State Rescue directly from Home Gateway', () => {
    render(<App />);

    // Dismiss Welcome Note
    fireEvent.click(screen.getByText(/Continue to Still/i));

    // Click SOS State Rescue "ADHD / Noise Shield"
    const adhdRescue = screen.getByText('ADHD / Noise Shield');
    fireEvent.click(adhdRescue);

    // Verify Monolith Player is now rendered playing Brownian Noise
    expect(screen.getByText(SOUNDSCAPES[2].title)).toBeInTheDocument();
    expect(screen.getAllByTitle(/Pause \(Space\)/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Daily Stillness')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('validates MILESTONES constant configuration', () => {
    expect(Array.isArray(MILESTONES)).toBe(true);
    expect(MILESTONES.length).toBe(5);
    MILESTONES.forEach((m, idx) => {
      expect(m.seconds).toBeGreaterThan(0);
      expect(m.tier).toBe(idx + 1);
      expect(m.label).toBeTruthy();
      expect(m.title).toBeTruthy();
      expect(m.message).toBeTruthy();
    });
  });
});
