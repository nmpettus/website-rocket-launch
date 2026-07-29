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
    id: 'ocean-deep',
    name: 'Ocean Deep',
    description: 'Deep navy & teal — the current look',
    colors: ['#0c2340', '#1a4a6e', '#2d8a9e', '#5cbdb9'],
    fontPreview: 'Inter',
  },
  {
    id: 'warm-sand',
    name: 'Warm Sand',
    description: 'Warm neutrals, sandy & welcoming',
    colors: ['#faf8f5', '#f0ebe3', '#c9b99a', '#8b7355'],
    fontPreview: 'Inter',
  },
  {
    id: 'sky-peach',
    name: 'Sky & Peach',
    description: 'Light blue & soft peach, cheerful',
    colors: ['#e0f2fe', '#7dd3fc', '#fecaca', '#f9a8a8'],
    fontPreview: 'Inter',
  },
  {
    id: 'sage-cream',
    name: 'Sage & Cream',
    description: 'Muted sage & warm cream, serene',
    colors: ['#f5f0e8', '#dce5d4', '#a8c0a0', '#7d9b76'],
    fontPreview: 'Inter',
  },
  {
    id: 'storybook',
    name: '✨ Purple Magic',
    description: 'Magical purple, gold sparkles & pink accents',
    colors: ['#F5E6FF', '#9333EA', '#EC4899', '#FFD700'],
    fontPreview: 'Fredoka',
  },
  {
    id: 'playful',
    name: '🌈 Rainbow Joy',
    description: 'Sky blue, sunshine yellow & coral',
    colors: ['#E0F7FF', '#0EA5E9', '#FFD700', '#FF6B6B'],
    fontPreview: 'Fredoka',
  },
  {
    id: 'ocean',
    name: 'Ocean Adventure',
    description: 'Bold display font, bright sea blue & coral',
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
  const [currentTheme, setCurrentTheme] = useState('ocean-deep');

  useEffect(() => {
    const savedTheme = localStorage.getItem('maggie-theme') || 'ocean-deep';
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
          className="fixed bottom-4 right-4 z-50 gap-2 shadow-lg bg-background/95 backdrop-blur-sm border-2 border-primary/30 hover:border-primary hover:scale-105 transition-all rounded-full"
        >
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="hidden sm:inline text-foreground">✨ Themes</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-2 max-h-[70vh] overflow-y-auto">
        <div className="px-2 py-1.5 mb-2">
          <p className="text-sm font-medium text-foreground flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Choose a Color Palette
          </p>
          <p className="text-xs text-muted-foreground">Applies site-wide instantly</p>
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
