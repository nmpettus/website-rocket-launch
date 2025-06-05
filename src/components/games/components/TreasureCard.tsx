
import React from 'react';

interface TreasureCardProps {
  treasure: any;
  onAddToJournal: () => void;
}

const TreasureCard: React.FC<TreasureCardProps> = ({ treasure, onAddToJournal }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md text-center border-4 border-yellow-400">
        <div className="text-4xl mb-2">{treasure.emoji}</div>
        <div className="text-2xl font-bold mb-1 text-purple-700">{treasure.trait}</div>
        <div className="italic text-gray-700 mb-4 text-sm">{treasure.verse}</div>
        <button
          className="mt-2 px-4 py-2 bg-yellow-300 rounded shadow hover:bg-yellow-400 font-semibold"
          onClick={onAddToJournal}
        >
          Add to Journal
        </button>
      </div>
    </div>
  );
};

export default TreasureCard;
