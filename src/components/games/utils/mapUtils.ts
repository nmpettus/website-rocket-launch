
export const MAP_WIDTH = 30;
export const MAP_HEIGHT = 20;
export const VIEWPORT_W = 10;
export const VIEWPORT_H = 8;

export const TERRAIN_TYPES = [
  { code: 0, label: 'Grass', emoji: '🌱', bg: 'bg-green-300' },
  { code: 1, label: 'Wall', emoji: '🧱', bg: 'bg-gray-700' },
  { code: 2, label: 'Water', emoji: '🌊', bg: 'bg-blue-400' },
  { code: 3, label: 'Mountain', emoji: '⛰️', bg: 'bg-gray-500' },
  { code: 4, label: 'Tree', emoji: '🌳', bg: 'bg-green-600' },
  { code: 5, label: 'Rock', emoji: '🪨', bg: 'bg-gray-400' },
  { code: 6, label: 'Path', emoji: '🛤️', bg: 'bg-yellow-200' }
];

export function generateMap() {
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

export function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export function getWalkableTiles(map: number[][]) {
  const tiles = [];
  for (let y = 1; y < MAP_HEIGHT - 1; y++) {
    for (let x = 1; x < MAP_WIDTH - 1; x++) {
      if (map[y][x] === 0 || map[y][x] === 6) tiles.push({ x, y });
    }
  }
  return tiles;
}

export function getReachable(map: number[][], sx: number, sy: number) {
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

export function getRandomElements<T>(arr: T[], count: number): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

export function getTerrainStyle(terrain: number) {
  const t = TERRAIN_TYPES.find(t => t.code === terrain);
  return t || TERRAIN_TYPES[0];
}

export function canWalkOn(terrain: number) {
  return terrain === 0 || terrain === 6;
}
