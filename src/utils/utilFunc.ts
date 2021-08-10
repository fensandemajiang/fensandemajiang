import { Action, Suite } from '../types';
import type { Tile } from '../types';

export function compStr(a: string, b: string): number {
  return a.localeCompare(b, 'en', { numeric: true });
}

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function amCurrentPlayer(
  myId: string,
  currInd: number,
  allIds: string[],
): boolean {
  return allIds[currInd % 4] === myId;
}

export function tileEqual(tile1: Tile, tile2: Tile): boolean {
  return (
    tile1.suite === tile2.suite &&
    tile1.value === tile2.value &&
    tile1.wind === tile2.wind &&
    tile1.dragon === tile2.dragon &&
    tile1.flower === tile2.flower
  );
}

// returns indexes of triple
// assumes the newTile is already in hand
export function findGrouping(
  hand: Tile[],
  action: Action,
  newTile: Tile,
): number[][] {
  const tileSuite = newTile.suite;

  const out: number[][] = [];
  if (
    action === Action.Chi &&
    newTile.suite in [Suite.Tiao, Suite.Wan, Suite.Tong]
  ) {
    const buckets: { [key: number]: number[] } = {};
    const filteredHand = hand.filter((t) => t.suite === newTile.suite);

    for (let ind = 0; ind < hand.length; ind++) {
      const t: Tile = hand[ind];
      if (t.value) {
        if (buckets[t.value]) {
          buckets[t.value].push(ind);
        } else {
          buckets[t.value] = [ind];
        }
      }
    }

    const tVal: number = newTile.value ?? 0;
    if (buckets[tVal - 2] && buckets[tVal - 1])
      out.push([buckets[tVal - 2][0], buckets[tVal - 1][0], buckets[tVal][0]]);

    if (buckets[tVal - 1] && buckets[tVal + 1])
      out.push([buckets[tVal - 1][0], buckets[tVal][0], buckets[tVal + 1][0]]);

    if (buckets[tVal + 1] && buckets[tVal + 2])
      out.push([buckets[tVal][0], buckets[tVal + 1][0], buckets[tVal + 2][0]]);
  } else if (action === Action.Gang || action === Action.Peng) {
    const inner = [];
    for (let i = 0; i < hand.length; i++) {
      if (tileEqual(hand[i], newTile)) {
        inner.push(i);
      }
    }
    out.push(inner);
  }

  return out;
}
