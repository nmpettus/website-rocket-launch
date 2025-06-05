
import React from 'react';
import { TERRAIN_TYPES } from '../utils/mapUtils';

const GameLegend: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-3 rounded-lg border border-gray-300 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">Game Legend</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap lg:justify-center gap-2 lg:gap-4">
        {TERRAIN_TYPES.map((terrain, idx) => (
          <div key={idx} className="flex items-center gap-1 lg:gap-2">
            <div className={`w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center rounded ${terrain.bg} text-xs lg:text-sm`}>
              {terrain.emoji}
            </div>
            <span className="text-xs lg:text-sm">{terrain.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1 lg:gap-2">
          <div className="w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center rounded border-2 border-purple-500 text-xs lg:text-sm">🪙</div>
          <span className="text-xs lg:text-sm">Treasure</span>
        </div>
        <div className="flex items-center gap-1 lg:gap-2">
          <div className="w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center rounded border-2 border-black text-xs lg:text-sm">🐕</div>
          <span className="text-xs lg:text-sm">Maggie</span>
        </div>
      </div>
    </div>
  );
};

export default GameLegend;
