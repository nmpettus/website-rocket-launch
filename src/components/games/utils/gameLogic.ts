
import { generateMap, getWalkableTiles, getReachable, getRandomElements } from './mapUtils';
import { TREASURES } from './treasureData';

export function generateValidMapAndPositions() {
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
