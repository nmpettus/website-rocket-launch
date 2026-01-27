import { useCallback, useEffect, useState } from 'react';

const SOUNDS = {
  click: '/sounds/click.mp3',
  success: '/sounds/success.mp3',
  whoosh: '/sounds/whoosh.mp3',
  pop: '/sounds/pop.mp3',
};

export const useSoundEffects = () => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('maggie-sounds') !== 'false';
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('maggie-sounds', String(soundEnabled));
  }, [soundEnabled]);

  const playSound = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      // Audio not supported
    }
  }, [soundEnabled]);

  const playClick = useCallback(() => {
    playSound(800, 0.1, 'sine');
  }, [playSound]);

  const playSuccess = useCallback(() => {
    playSound(523, 0.1, 'sine'); // C5
    setTimeout(() => playSound(659, 0.1, 'sine'), 100); // E5
    setTimeout(() => playSound(784, 0.15, 'sine'), 200); // G5
  }, [playSound]);

  const playPop = useCallback(() => {
    playSound(400, 0.05, 'sine');
  }, [playSound]);

  const playWhoosh = useCallback(() => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
      // Audio not supported
    }
  }, [soundEnabled]);

  return {
    soundEnabled,
    setSoundEnabled,
    playClick,
    playSuccess,
    playPop,
    playWhoosh,
  };
};
