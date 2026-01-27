import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const SoundToggle = () => {
  const { soundEnabled, setSoundEnabled, playClick } = useSoundEffects();

  const handleToggle = () => {
    if (!soundEnabled) {
      setSoundEnabled(true);
      // Play a sound after enabling
      setTimeout(() => playClick(), 100);
    } else {
      setSoundEnabled(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggle}
            className="fixed bottom-4 left-4 z-50 rounded-full shadow-lg bg-background/95 backdrop-blur-sm border-2 border-primary/30 hover:border-primary hover:scale-105 transition-all w-10 h-10"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-primary" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{soundEnabled ? 'Mute sounds' : 'Enable sounds'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SoundToggle;
