
import React from 'react';
import { TERRAIN_TYPES } from '../utils/mapUtils';

const GameLegend: React.FC = () => {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-4 bg-white p-3 rounded-lg border border-gray-300">
      {TERRAIN_TYPES.map((terrain, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <div className={`w-6 h-6 flex items-center justify-center rounded ${terrain.bg}`}>{terrain.emoji}</div>
          <span className="text-sm">{terrain.label}</span>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center rounded border-2 border-purple-500">🪙</div>
        <span className="text-sm">Treasure</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center rounded border-2 border-black">🐕</div>
        <span className="text-sm">Maggie</span>
      </div>
    </div>
  );
};

export default GameLegend;
