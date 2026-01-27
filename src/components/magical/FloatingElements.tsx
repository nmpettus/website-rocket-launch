import React, { useMemo } from 'react';

interface FloatingElement {
  id: number;
  emoji: string;
  size: number;
  left: string;
  delay: number;
  duration: number;
}

const FloatingElements = () => {
  const elements = useMemo(() => {
    const emojis = ['⭐', '✨', '💫', '🌟', '💖', '🐾', '📖', '🦋', '🌈', '☁️'];
    const items: FloatingElement[] = [];
    
    for (let i = 0; i < 20; i++) {
      items.push({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        size: Math.random() * 16 + 12,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 10,
        duration: Math.random() * 10 + 15,
      });
    }
    return items;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute animate-float-up opacity-60"
          style={{
            left: el.left,
            bottom: '-50px',
            fontSize: `${el.size}px`,
            animationDelay: `${el.delay}s`,
            animationDuration: `${el.duration}s`,
          }}
        >
          {el.emoji}
        </div>
      ))}
    </div>
  );
};

export default FloatingElements;
