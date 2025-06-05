
import React from 'react';
import { getTerrainStyle, canWalkOn, clamp, VIEWPORT_W, VIEWPORT_H, MAP_WIDTH, MAP_HEIGHT } from '../utils/mapUtils';

interface GameMapProps {
  map: number[][];
  player: { x: number; y: number };
  treasureSpots: any[];
  foundIndex: number | null;
  showJournal: boolean;
  onCellClick: (x: number, y: number) => void;
}

const GameMap: React.FC<GameMapProps> = ({
  map,
  player,
  treasureSpots,
  foundIndex,
  showJournal,
  onCellClick
}) => {
  const isAdjacent = (x: number, y: number) => {
    const dx = Math.abs(x - player.x);
    const dy = Math.abs(y - player.y);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  };

  const vX = clamp(player.x - Math.floor(VIEWPORT_W / 2), 0, MAP_WIDTH - VIEWPORT_W);
  const vY = clamp(player.y - Math.floor(VIEWPORT_H / 2), 0, MAP_HEIGHT - VIEWPORT_H);

  const rows = [];
  for (let y = vY; y < vY + VIEWPORT_H; y++) {
    const cells = [];
    for (let x = vX; x < vX + VIEWPORT_W; x++) {
      const terrain = getTerrainStyle(map[y][x]);
      let cellStyle = `w-8 h-8 inline-block align-top text-center text-sm ${terrain.bg}`;
      const tIdx = treasureSpots.findIndex(t => t.x === x && t.y === y && !t.found);
      if (tIdx !== -1) {
        cellStyle += ' border-2 border-purple-500';
      }
      if (x === player.x && y === player.y) {
        cellStyle += ' border-2 border-black bg-white';
      }
      
      const adjacent = isAdjacent(x, y);
      const walkable = canWalkOn(map[y][x]);
      if (adjacent && walkable && foundIndex === null && !showJournal) {
        cellStyle += ' cursor-pointer hover:border-2 hover:border-blue-400';
      } else if (!walkable) {
        cellStyle += ' cursor-not-allowed';
      } else {
        cellStyle += ' cursor-default';
      }

      let content = '';
      if (x === player.x && y === player.y) {
        content = '🐕';
      } else if (tIdx !== -1) {
        content = treasureSpots[tIdx].emoji;
      } else {
        content = terrain.emoji;
      }
      cells.push(
        <div 
          key={x} 
          className={cellStyle} 
          style={{lineHeight:'2rem', fontSize:'12px'}}
          onClick={() => onCellClick(x, y)}
        >
          {content}
        </div>
      );
    }
    rows.push(
      <div key={y} className="whitespace-nowrap">
        {cells}
      </div>
    );
  }

  return (
    <div
      className="border-4 border-purple-600 bg-white inline-block rounded-lg"
      style={{ boxShadow: '0 0 12px #888', userSelect: 'none' }}
      tabIndex={0}
    >
      {rows}
    </div>
  );
};

export default GameMap;
