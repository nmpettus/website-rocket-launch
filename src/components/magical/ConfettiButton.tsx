import React, { forwardRef } from 'react';
import confetti from 'canvas-confetti';
import { Button, ButtonProps } from '@/components/ui/button';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface ConfettiButtonProps extends ButtonProps {
  confettiType?: 'burst' | 'cannon' | 'stars';
}

const ConfettiButton = forwardRef<HTMLButtonElement, ConfettiButtonProps>(
  ({ children, onClick, confettiType = 'burst', ...props }, ref) => {
    const { playClick } = useSoundEffects();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      playClick();
      
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      switch (confettiType) {
        case 'stars':
          confetti({
            particleCount: 30,
            spread: 60,
            origin: { x, y },
            shapes: ['star'],
            colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#A855F7', '#FF69B4'],
          });
          break;
        case 'cannon':
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { x, y: y + 0.1 },
            colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#A855F7', '#FF69B4', '#00D4FF'],
          });
          break;
        default:
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { x, y },
            colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#A855F7'],
          });
      }

      onClick?.(e);
    };

    return (
      <Button ref={ref} onClick={handleClick} {...props}>
        {children}
      </Button>
    );
  }
);

ConfettiButton.displayName = 'ConfettiButton';

export default ConfettiButton;
