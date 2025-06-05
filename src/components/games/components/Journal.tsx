
import React from 'react';

interface JournalProps {
  collected: any[];
  onClose: () => void;
}

const Journal: React.FC<JournalProps> = ({ collected, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl max-h-96 overflow-y-auto border-4 border-purple-400">
        <h3 className="text-2xl font-bold mb-4 text-purple-700">📖 Maggie's Treasure Journal</h3>
        {collected.length === 0 ? (
          <p className="text-gray-600">No treasures found yet. Keep exploring!</p>
        ) : (
          <div className="space-y-3">
            {collected.map((treasure, idx) => (
              <div key={idx} className="border-l-4 border-yellow-400 pl-3 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{treasure.emoji}</span>
                  <span className="font-bold text-purple-700">{treasure.trait}</span>
                </div>
                <div className="text-sm italic text-gray-600 mb-2">{treasure.verse}</div>
                <div className="text-xs italic text-gray-500 border-t pt-1">{treasure.firstMention}</div>
              </div>
            ))}
          </div>
        )}
        <button
          className="mt-4 px-4 py-2 bg-purple-300 rounded shadow hover:bg-purple-400 font-semibold"
          onClick={onClose}
        >
          Close Journal
        </button>
      </div>
    </div>
  );
};

export default Journal;
