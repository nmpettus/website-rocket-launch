import { useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
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
    name: 'Polished Storybook',
    description: 'Cream, sage green, dusty rose, warm gold',
    colors: ['#FFFEF5', '#8DB48E', '#D4A5A5', '#D4AF37'],
  },
  {
    id: 'sunshine',
    name: 'Sunshine & Sky',
    description: 'Soft yellow, sky blue, coral, mint',
    colors: ['#FFFDE7', '#7DD3E8', '#F5A173', '#6BC5A0'],
  },
  {
    id: 'lavender',
    name: 'Lavender Dreams',
    description: 'Soft lavender, blush pink, cream, soft teal',
    colors: ['#F8F5FF', '#B794D4', '#F0B6C2', '#5DBAB0'],
  },
  {
    id: 'autumn',
    name: 'Autumn Warmth',
    description: 'Terracotta, forest green, honey gold, cream',
    colors: ['#FAF5F0', '#C76B4A', '#4A7C59', '#D9A520'],
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

  const currentThemeData = themes.find(t => t.id === currentTheme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 gap-2 shadow-lg bg-background/95 backdrop-blur-sm border-2 border-primary/30 hover:border-primary"
        >
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Try Themes</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-2">
        <div className="px-2 py-1.5 mb-2">
          <p className="text-sm font-medium text-foreground">Choose a Color Theme</p>
          <p className="text-xs text-muted-foreground">Preview different styles for your site</p>
        </div>
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className="flex items-start gap-3 p-3 cursor-pointer rounded-lg hover:bg-muted/50"
          >
            <div className="flex gap-0.5 mt-0.5">
              {theme.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full border border-foreground/10"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{theme.name}</span>
                {currentTheme === theme.id && (
                  <Check className="h-3.5 w-3.5 text-primary" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{theme.description}</p>
            </div>
          </DropdownMenuItem>
        ))}
        <div className="px-2 pt-2 mt-2 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Let me know which one you prefer!
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
