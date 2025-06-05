
import React, { useState, useEffect, useRef } from 'react';

const MAP_WIDTH = 30;
const MAP_HEIGHT = 20;
const VIEWPORT_W = 10;
const VIEWPORT_H = 8;

const TREASURES = [
  { trait: 'Humility', verse: '"Humble yourselves before the Lord, and he will lift you up." (James 4:10)', emoji: '🪙' },
  { trait: 'Faith', verse: '"For we live by faith, not by sight." (2 Corinthians 5:7)', emoji: '🗝️' },
  { trait: 'Forgiveness', verse: '"Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you." (Ephesians 4:32)', emoji: '🧰' },
  { trait: 'Love', verse: '"Let all that you do be done in love." (1 Corinthians 16:14)', emoji: '💖' },
  { trait: 'Compassion', verse: '"Finally, all of you, be like-minded, be sympathetic, love one another, be compassionate and humble." (1 Peter 3:8)', emoji: '🫶' },
  { trait: 'Kindness', verse: '"Therefore, as God's chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience." (Colossians 3:12)', emoji: '🌷' },
  { trait: 'Patience', verse: '"Be completely humble and gentle; be patient, bearing with one another in love." (Ephesians 4:2)', emoji: '🕰️' },
  { trait: 'Peace', verse: '"And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus." (Philippians 4:7)', emoji: '🕊️' },
  { trait: 'Joy', verse: '"The joy of the Lord is your strength." (Nehemiah 8:10)', emoji: '😄' },
  { trait: 'Hope', verse: '"May the God of hope fill you with all joy and peace as you trust in him." (Romans 15:13)', emoji: '🌈' },
  { trait: 'Gentleness', verse: '"Let your gentleness be evident to all." (Philippians 4:5)', emoji: '🪶' },
  { trait: 'Generosity', verse: '"A generous person will prosper; whoever refreshes others will be refreshed." (Proverbs 11:25)', emoji: '🎁' },
  { trait: 'Self-Control', verse: '"For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline." (2 Timothy 1:7)', emoji: '🧘' },
  { trait: 'Gratitude', verse: '"Give thanks to the Lord, for he is good; his love endures forever." (Psalm 107:1)', emoji: '🙏' },
  { trait: 'Wisdom', verse: '"If any of you lacks wisdom, you should ask God, who gives generously to all." (James 1:5)', emoji: '🦉' },
  { trait: 'Courage', verse: '"Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go." (Joshua 1:9)', emoji: '🦁' },
  { trait: 'Truthfulness', verse: '"Therefore each of you must put off falsehood and speak truthfully to your neighbor." (Ephesians 4:25)', emoji: '📖' },
  { trait: 'Perseverance', verse: '"Let us run with perseverance the race marked out for us." (Hebrews 12:1)', emoji: '🏃‍♂️' }
];

const TERRAIN_TYPES = [
  { code: 0, label: 'Grass', emoji: '🌱', bg: 'bg-green-300' },
  { code: 1, label: 'Wall', emoji: '🧱', bg: 'bg-gray-700' },
  { code: 2, label: 'Water', emoji: '🌊', bg: 'bg-blue-400' },
  { code: 3, label: 'Mountain', emoji: '⛰️', bg: 'bg-gray-500' },
  { code: 4, label: 'Tree', emoji: '🌳', bg: 'bg-green-600' },
  { code: 5, label: 'Rock', emoji: '🪨', bg: 'bg-gray-400' },
  { code: 6, label: 'Path', emoji: '🛤️', bg: 'bg-yellow-200' }
];

function generateMap() {
  const map = [];
  for (let y = 0; y < MAP_HEIGHT; y++) {
    const row = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (x === 0 || y === 0 || x === MAP_WIDTH - 1 || y === MAP_HEIGHT - 1) {
        row.push(1);
      } else {
        const rand = Math.random();
        if (rand < 0.05) row.push(1); // wall
        else if (rand < 0.1) row.push(2); // water
        else if (rand < 0.13) row.push(3); // mountain
        else if (rand < 0.18) row.push(4); // tree
        else if (rand < 0.22) row.push(5); // rock
        else if (rand < 0.25) row.push(6); // path
        else row.push(0); // grass
      }
    }
    map.push(row);
  }
  return map;
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function getWalkableTiles(map: number[][]) {
  const tiles = [];
  for (let y = 1; y < MAP_HEIGHT - 1; y++) {
    for (let x = 1; x < MAP_WIDTH - 1; x++) {
      if (map[y][x] === 0 || map[y][x] === 6) tiles.push({ x, y });
    }
  }
  return tiles;
}

// BFS to find all reachable tiles from (sx, sy)
function getReachable(map: number[][], sx: number, sy: number) {
  const visited = Array.from({ length: MAP_HEIGHT }, () => Array(MAP_WIDTH).fill(false));
  const queue = [{ x: sx, y: sy }];
  visited[sy][sx] = true;
  const reachable = [{ x: sx, y: sy }];
  const dirs = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 }
  ];
  while (queue.length) {
    const { x, y } = queue.shift()!;
    for (const { dx, dy } of dirs) {
      const nx = x + dx, ny = y + dy;
      if (
        nx >= 0 && nx < MAP_WIDTH &&
        ny >= 0 && ny < MAP_HEIGHT &&
        !visited[ny][nx] &&
        (map[ny][nx] === 0 || map[ny][nx] === 6)
      ) {
        visited[ny][nx] = true;
        queue.push({ x: nx, y: ny });
        reachable.push({ x: nx, y: ny });
      }
    }
  }
  return reachable;
}

function getRandomElements<T>(arr: T[], count: number): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

function generateValidMapAndPositions() {
  let map, walkable, start, reachable, treasures;
  let attempts = 0;
  while (true) {
    map = generateMap();
    walkable = getWalkableTiles(map);
    if (walkable.length < TREASURES.length + 1) continue;
    start = walkable[Math.floor(Math.random() * walkable.length)];
    reachable = getReachable(map, start.x, start.y);
    if (reachable.length < TREASURES.length + 1) continue;
    treasures = getRandomElements(
      reachable.filter(pos => !(pos.x === start.x && pos.y === start.y)),
      TREASURES.length
    );
    if (treasures.length === TREASURES.length) break;
    if (++attempts > 50) throw new Error('Failed to generate valid map');
  }
  return { map, start, treasures };
}

function getTerrainStyle(terrain: number) {
  const t = TERRAIN_TYPES.find(t => t.code === terrain);
  return t || TERRAIN_TYPES[0];
}

function canWalkOn(terrain: number) {
  return terrain === 0 || terrain === 6;
}

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
        cellStyle += ' border-2 border-purple-500'; // Highlight treasure spots
      }
      if (x === player.x && y === player.y) {
        cellStyle += ' border-2 border-black';
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
        <div key={x} className={cellStyle} style={{lineHeight:'2rem', fontSize:'12px'}}>
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

  let card = null;
  if (foundIndex !== null) {
    const t = treasureSpots[foundIndex];
    card = (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md text-center border-4 border-yellow-400">
          <div className="text-4xl mb-2">{t.emoji}</div>
          <div className="text-2xl font-bold mb-1 text-purple-700">{t.trait}</div>
          <div className="italic text-gray-700 mb-4 text-sm">{t.verse}</div>
          <button
            className="mt-2 px-4 py-2 bg-yellow-300 rounded shadow hover:bg-yellow-400 font-semibold"
            onClick={() => {
              treasureSpots[foundIndex].found = true;
              setCollected([...collected, treasureSpots[foundIndex]]);
              setFoundIndex(null);
            }}
          >
            Add to Journal
          </button>
        </div>
      </div>
    );
  }

  let journal = null;
  if (showJournal) {
    journal = (
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
                  <div className="text-sm italic text-gray-600">{treasure.verse}</div>
                </div>
              ))}
            </div>
          )}
          <button
            className="mt-4 px-4 py-2 bg-purple-300 rounded shadow hover:bg-purple-400 font-semibold"
            onClick={() => setShowJournal(false)}
          >
            Close Journal
          </button>
        </div>
      </div>
    );
  }

  // Legend
  const legend = (
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

  return (
    <div className="flex flex-col items-center mt-6">
      <h2 className="mb-2 text-xl font-bold text-purple-700">🐕 Maggie's Bible Adventure</h2>
      <div
        ref={gameRef}
        className="border-4 border-purple-600 bg-white inline-block rounded-lg"
        style={{ boxShadow: '0 0 12px #888', userSelect: 'none' }}
        tabIndex={0}
      >
        {rows}
      </div>
      <div className="mt-2 text-gray-700 text-center">
        <div>Use arrow keys to move 🐕. Find all the treasures!</div>
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
      {legend}
      {card}
      {journal}
    </div>
  );
}
