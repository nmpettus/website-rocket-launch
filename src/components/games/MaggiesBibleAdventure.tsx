
import React, { useState, useEffect, useRef } from 'react';
import { generateValidMapAndPositions } from './utils/gameLogic';
import { canWalkOn, clamp, MAP_WIDTH, MAP_HEIGHT } from './utils/mapUtils';
import { TREASURES } from './utils/treasureData';
import GameMap from './components/GameMap';
import TreasureCard from './components/TreasureCard';
import Journal from './components/Journal';
import GameLegend from './components/GameLegend';

export default function MaggiesBibleAdventure() {
  const [{ map, start, treasures }] = useState(generateValidMapAndPositions);
  const [player, setPlayer] = useState({ x: start.x, y: start.y });
  const [treasureSpots] = useState(() =>
    treasures.map((pos, i) => ({ ...pos, found: false, ...TREASURES[i] }))
  );
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [collected, setCollected] = useState<any[]>([]);
  const [showJournal, setShowJournal] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);

  const isAdjacent = (x: number, y: number) => {
    const dx = Math.abs(x - player.x);
    const dy = Math.abs(y - player.y);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  };

  const handleCellClick = (x: number, y: number) => {
    if (foundIndex !== null || showJournal) return;
    
    if (isAdjacent(x, y) && canWalkOn(map[y][x])) {
      setPlayer({ x, y });
    }
  };

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (foundIndex !== null || showJournal) return;
      let dx = 0, dy = 0;
      if (e.key === 'ArrowUp') dy = -1;
      if (e.key === 'ArrowDown') dy = 1;
      if (e.key === 'ArrowLeft') dx = -1;
      if (e.key === 'ArrowRight') dx = 1;
      if (e.key === 'j' || e.key === 'J') {
        setShowJournal(true);
        return;
      }
      if (dx !== 0 || dy !== 0) {
        e.preventDefault();
        const nx = clamp(player.x + dx, 0, MAP_WIDTH - 1);
        const ny = clamp(player.y + dy, 0, MAP_HEIGHT - 1);
        if (canWalkOn(map[ny][nx])) {
          setPlayer({ x: nx, y: ny });
        }
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [player, map, foundIndex, showJournal]);

  useEffect(() => {
    if (foundIndex !== null) return;
    const idx = treasureSpots.findIndex(
      t => !t.found && t.x === player.x && t.y === player.y
    );
    if (idx !== -1) {
      setFoundIndex(idx);
    }
  }, [player, treasureSpots, foundIndex]);

  const handleAddToJournal = () => {
    if (foundIndex !== null) {
      treasureSpots[foundIndex].found = true;
      setCollected([...collected, treasureSpots[foundIndex]]);
      setFoundIndex(null);
    }
  };

  return (
    <div className="flex flex-col items-center mt-6">
      <h2 className="mb-2 text-xl font-bold text-purple-700">🐕 Maggie's Bible Treasure Hunt</h2>
      <p className="mb-4 text-lg font-medium text-center text-purple-600">Find all the Fruits of the Spirit (Jesus' Ways)</p>
      
      {/* Legend moved above the game */}
      <GameLegend />
      
      <div ref={gameRef} className="mt-4">
        <GameMap
          map={map}
          player={player}
          treasureSpots={treasureSpots}
          foundIndex={foundIndex}
          showJournal={showJournal}
          onCellClick={handleCellClick}
        />
      </div>
      <div className="mt-2 text-gray-700 text-center">
        <div>Use arrow keys or click adjacent boxes to move 🐕. Find all the treasures! They are in the purple boxes.</div>
        <div className="text-sm">Press 'J' to open your journal 📖</div>
      </div>
      <div className="mt-1 flex gap-4 text-sm text-gray-600">
        <span>Treasures found: {collected.length} / {TREASURES.length}</span>
        <button 
          className="px-2 py-1 bg-purple-200 rounded text-purple-700 hover:bg-purple-300"
          onClick={() => setShowJournal(true)}
        >
          📖 Journal
        </button>
      </div>
      {foundIndex !== null && (
        <TreasureCard
          treasure={treasureSpots[foundIndex]}
          onAddToJournal={handleAddToJournal}
        />
      )}
      {showJournal && (
        <Journal
          collected={collected}
          onClose={() => setShowJournal(false)}
        />
      )}
    </div>
  );
}
