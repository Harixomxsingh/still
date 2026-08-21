import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

export const BreathingHalo = ({ isPlaying, onTogglePlay }) => {
  const [breathPhase, setBreathPhase] = useState('Breathe');
  const [phaseClass, setPhaseClass] = useState('');

  useEffect(() => {
    if (!isPlaying) {
      setBreathPhase('Breathe');
      setPhaseClass('');
      return;
    }

    let isMounted = true;

    const runLoop = () => {
      if (!isMounted) return;
      setPhaseClass('breath-inhale');
      setBreathPhase('Inhale');

      setTimeout(() => {
        if (!isMounted) return;
        setPhaseClass('breath-hold');
        setBreathPhase('Hold');

        setTimeout(() => {
          if (!isMounted) return;
          setPhaseClass('breath-exhale');
          setBreathPhase('Exhale');

          setTimeout(() => {
            if (!isMounted) return;
            runLoop();
          }, 4000); // 4s exhale
        }, 2000); // 2s hold
      }, 4000); // 4s inhale
    };

    runLoop();

    return () => {
      isMounted = false;
    };
  }, [isPlaying]);

  return (
    <div 
      className={`breathing-nexus ${phaseClass}`} 
      onClick={onTogglePlay}
      title={isPlaying ? "Pause (Space)" : "Play (Space)"}
    >
      <div className="nexus-outer-halo" />
      <div className="nexus-glow-disc" />
      <div className="nexus-core-sphere">
        {isPlaying ? (
          <Pause className="w-5 h-5 text-white" />
        ) : (
          <Play className="w-5 h-5 text-white ml-0.5" />
        )}
        <span className="text-[9px] font-mono tracking-widest text-slate-300 mt-2 uppercase opacity-80" style={{ fontSize: '9px', letterSpacing: '0.14em' }}>
          {breathPhase}
        </span>
      </div>
    </div>
  );
};
