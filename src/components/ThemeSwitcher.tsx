import { useState, useEffect } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const themes = [
  {
    id: 'storybook',
    name: 'Classic Storybook',
    description: 'Elegant serif fonts, warm cream & sage',
    colors: ['#FFFEF5', '#6B9B6B', '#D4A5A5', '#D4AF37'],
    fontPreview: 'Playfair Display',
  },
  {
    id: 'playful',
    name: 'Bubbly Playful',
    description: 'Fun rounded fonts, bright purple & yellow',
    colors: ['#E0FFFF', '#A855F7', '#FFD700', '#EC4899'],
    fontPreview: 'Fredoka',
  },
  {
    id: 'ocean',
    name: 'Ocean Adventure',
    description: 'Bold display font, deep sea blue & coral',
    colors: ['#F0F9FF', '#0EA5E9', '#FF6B35', '#14B8A6'],
    fontPreview: 'Abril Fatface',
  },
  {
    id: 'forest',
    name: 'Enchanted Forest',
    description: 'Classic serif, deep forest green & brown',
    colors: ['#F5F5DC', '#2D5A27', '#8B5A2B', '#DAA520'],
    fontPreview: 'Merriweather',
  },
  {
    id: 'sunset',
    name: 'Sunset Dreams',
    description: 'Whimsical script, warm orange & pink',
    colors: ['#FFF8E7', '#F97316', '#EC4899', '#FBBF24'],
    fontPreview: 'Pacifico',
  },
  {
    id: 'vintage',
    name: 'Vintage Retro',
    description: 'Typewriter fonts, sepia & nostalgic tones',
    colors: ['#EDE8DC', '#5C4033', '#A67B5B', '#B8860B'],
    fontPreview: 'Special Elite',
  },
  {
    id: 'candy',
    name: 'Candy Pastel',
    description: 'Soft pinks & mint greens, playful & sweet',
    colors: ['#FFF5F7', '#F9A8D4', '#6EE7B7', '#A78BFA'],
    fontPreview: 'Baloo 2',
  },
];

export const ThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState('storybook');

  useEffect(() => {
    const savedTheme = localStorage.getItem('maggie-theme') || 'storybook';
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem('maggie-theme', themeId);
    document.documentElement.setAttribute('data-theme', themeId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 gap-2 shadow-lg bg-background/95 backdrop-blur-sm border-2 border-primary/30 hover:border-primary hover:scale-105 transition-all"
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">Try Themes</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-2">
        <div className="px-2 py-1.5 mb-2">
          <p className="text-sm font-medium text-foreground flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Choose a Style
          </p>
          <p className="text-xs text-muted-foreground">Each theme has unique fonts & colors</p>
        </div>
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className="flex items-start gap-3 p-3 cursor-pointer rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex flex-col gap-1 mt-0.5">
              <div className="flex gap-1">
                {theme.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full border-2 border-foreground/10 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span 
                className="text-[10px] text-muted-foreground"
                style={{ fontFamily: theme.fontPreview }}
              >
                {theme.fontPreview}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{theme.name}</span>
                {currentTheme === theme.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{theme.description}</p>
            </div>
          </DropdownMenuItem>
        ))}
        <div className="px-2 pt-2 mt-2 border-t">
          <p className="text-xs text-muted-foreground text-center">
            ✨ Let me know which one you prefer!
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
