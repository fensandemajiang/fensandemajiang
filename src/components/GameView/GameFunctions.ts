import { ActionType, Suite, Event, EventType } from '../../types';
import type { Tile } from '../../types';
import { getRandomInt } from '../../utils/utilFunc';
import type SimplePeer from 'vite-compatible-simple-peer/simplepeer.min.js';
import { v4 as uuidv4 } from 'uuid';

export function tileEqual(tile1: Tile, tile2: Tile): boolean {
  if (tile1 === undefined || tile2 === undefined) return false;
  return (
    tile1.suite === tile2.suite &&
    tile1.value === tile2.value &&
    tile1.wind === tile2.wind &&
    tile1.dragon === tile2.dragon &&
    tile1.flower === tile2.flower
  );
}

export function mostRecentDiscard(
  discards: { [userId: string]: Tile[] },
  currentPlayer: string,
): Tile | undefined {
  if (
    discards[currentPlayer] === undefined ||
    discards[currentPlayer].length === 0
  )
    return undefined;
  return discards[currentPlayer][discards[currentPlayer].length - 1];
}

export function containsChi(hand: Tile[], newlyDiscarded: Tile) {
  if (newlyDiscarded === undefined) return false;
  if ([Suite.Tiao, Suite.Tong, Suite.Wan].includes(newlyDiscarded.suite)) {
    // sorry if this logic is super ugly,
    // i'm writing this at like 2am and i'm super hella tired rn
    const seenArr = [false, false, true, false, false];
    for (let i = 0; i < hand.length; i++) {
      const t = hand[i];
      if (t.suite === newlyDiscarded.suite && t.value && newlyDiscarded.value) {
        if (Math.abs(t.value - newlyDiscarded.value) <= 2) {
          seenArr[t.value - newlyDiscarded.value + 2] = true;
        }
      }
    }

    return (
      (seenArr[0] && seenArr[1]) ||
      (seenArr[1] && seenArr[3]) ||
      (seenArr[3] && seenArr[4])
    );
  } else return false;
}

export function containsPeng(hand: Tile[], newlyDiscarded: Tile): boolean {
  let seenCount = 0;
  for (let i = 0; i < hand.length; i++) {
    const t = hand[i];
    if (tileEqual(t, newlyDiscarded)) {
      seenCount += 1;
      if (seenCount == 2) return true;
    }
  }
  return false;
}

export function containsGang(hand: Tile[], newlyDiscarded: Tile): boolean {
  let seenCount = 0;
  for (let i = 0; i < hand.length; i++) {
    const t = hand[i];
    if (tileEqual(t, newlyDiscarded)) {
      seenCount += 1;
      if (seenCount == 3) return true;
    }
  }
  return false;
}

export function getFullHand(hand: Tile[], shownTiles: Tile[][]): Tile[] {
  if (hand === undefined) return [];
  return [...hand, ...shownTiles.flat(1)];
}

// used to clean data before calculating score
export function triplifyShownTiles(shownTiles: Tile[][]): Tile[][] {
  const out: Tile[][] = [];
  for (let i = 0; i < shownTiles.length; i++) {
    const group: Tile[] = shownTiles[i];
    if (group.length === 3) {
      out.push(group);
    } else {
      out.push(group.slice(0, 3));
    }
  }

  return out;
}

export function amFirstPlayer(allPlayerIds: string[], yourPlayerId: string) {
  return allPlayerIds.findIndex((id) => id === yourPlayerId) === 0;
}

// returns indexes of triple
// assumes the newTile is already in hand
export function findGrouping(
  _hand: Tile[],
  action: ActionType,
  newTile: Tile,
): number[][] {
  const hand = Array.from(_hand);
  const out: number[][] = [];
  if (
    action === ActionType.Chi &&
    [Suite.Tiao, Suite.Wan, Suite.Tong].includes(newTile.suite)
  ) {
    const buckets: { [key: number]: number[] } = {};

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
  } else if (action === ActionType.Gang || action === ActionType.Peng) {
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

export function sortTiles(tiles: Tile[]): Tile[] {
  // js doesn't have a built in stable sort ;-;
  // so i'm making my own
  // here's my implementation of bucket sort......excellent prep for my upcoming exam
  // currently untested and i'm not even sure if it works...but who needs to test stuff anyways
  if (tiles === undefined) return [];
  // const tiles = Array.from(_tiles);

  const valBuckets: { [val: number]: Tile[] } = {};
  for (let tileInd = 0; tileInd < tiles.length; tileInd++) {
    const t = tiles[tileInd];
    if (!t.value) {
      if (valBuckets[-1]) {
        valBuckets[-1].push(t);
      } else {
        valBuckets[-1] = [t];
      }
    } else {
      if (valBuckets[t.value]) {
        valBuckets[t.value].push(t);
      } else {
        valBuckets[t.value] = [t];
      }
    }
  }

  const out: Tile[] = [];
  for (const v in Object.keys(valBuckets)) {
    const currBucket: Tile[] = valBuckets[v];
    if (currBucket === undefined) continue;
    for (let tInd = 0; tInd < currBucket.length; tInd++) {
      const t: Tile = currBucket[tInd];
      out.push(t);
    }
  }

  // sort by suite
  const suiteBuckets: { [suite: string]: Tile[] } = {};
  for (let tileInd = 0; tileInd < out.length; tileInd++) {
    const t = out[tileInd];
    if (suiteBuckets[t.suite.toString()]) {
      suiteBuckets[t.suite.toString()].push(t);
    } else {
      suiteBuckets[t.suite.toString()] = [t];
    }
  }

  const out2: Tile[] = [];
  for (const s in Object.keys(suiteBuckets)) {
    const currBucket: Tile[] = suiteBuckets[s];
    if (currBucket === undefined) continue;
    for (let tInd = 0; tInd < currBucket.length; tInd++) {
      const t: Tile = currBucket[tInd];
      out2.push(t);
    }
  }

  return out2;
}

function isTriple(t1: Tile, t2: Tile, t3: Tile): boolean {
  return (
    (tileEqual(t1, t2) && tileEqual(t2, t3)) ||
    (t1.suite === t2.suite &&
      t2.suite === t3.suite &&
      [Suite.Tiao, Suite.Wan, Suite.Tong].includes(t1.suite) &&
      (t1.value ?? -1) + 1 === t2.value &&
      (t2.value ?? -1) + 1 === t3.value)
  );
}

function basicWin(hand: Tile[]): boolean {
  // we assume no gang for now, because calculating quads is a pain in the butt
  // maybe just don't insert them into this function?
  let hasDouble = false;
  for (let i = 0; i < hand.length; ) {
    // hand is sorted and so and triples/pairs should be adjacent....i think
    // i'm too lazy to prove this to myself but this seems to be true i think
    const [t1, t2, t3] = hand.slice(i, i + 3);
    if (t1 && t2 && t3 && isTriple(t1, t2, t3)) {
      // greedy, try and grab the largest possible first
      i += 3;
    } else if (t1 && t2 && !hasDouble && tileEqual(t1, t2)) {
      i += 2;
      hasDouble = true;
    } else {
      return false;
    }
  }

  return true;
}

function thirteenOrphan(hand: Tile[]): boolean {
  //list is sorted so identical tiles will be adjacent
  let lastTile: Tile | null = null;

  for (let ind = 0; ind < hand.length; ind++) {
    const t = hand[ind];
    if (lastTile && tileEqual(t, lastTile)) {
      return false;
    } else {
      lastTile = t;
    }
  }

  return true;
}

// aka seven shifted pairs
function allPairs(hand: Tile[]): boolean {
  // hand is sorted so identical tiles will be adjacent
  for (let ind = 0; ind < hand.length; ind += 2) {
    const currT = hand[ind];
    const nextT = hand[ind + 1];

    if (!tileEqual(currT, nextT)) {
      return false;
    }
  }

  return true;
}

function sameSuite(hand: Tile[]): boolean {
  if (hand[0] === undefined) return false;
  const s = hand[0].suite;
  return hand.filter((t) => t.suite !== s).length > 0;
}

// returns a number indicating the tier of the victory
// aka how much money/points they should get
// return -1 if no victory
export function calculateScore(_hand: Tile[]): number {
  const hand = Array.from(_hand);
  const sortHand: Tile[] = sortTiles(hand);

  // cache this cause a few win cons use this
  const baseWin: boolean = basicWin(sortHand);
  // currently only implemented a few win cases, there are like 70 something...some one can have fun doing that if they want
  if (baseWin) {
    if (sameSuite(sortHand)) return 24;
    else return 6;
  } else if (thirteenOrphan(sortHand) || allPairs(sortHand)) return 88;
  else return -1;
}
export function randomizeDeck(deck: Tile[]): Tile[] {
  const newDeck = [...deck];

  for (let t1 = 0; t1 < 143; t1++) {
    // this approach could technically swap a tile with itself,
    // but that's going to be rare enough that I don't think it'll be important to worry about
    const t2 = getRandomInt(0, 143); // 144 total tiles in the deck
    [newDeck[t1], newDeck[t2]] = [newDeck[t2], newDeck[t1]]; //swap
  }

  return newDeck;
}
export function sendToPlayer(
  peers: { [userId: string]: SimplePeer.Instance },
  data: string,
  peerId: string,
): void {
  const event: Event = {
    eventType: EventType.Request,
    eventId: uuidv4(),
    body: data,
  };
  peers[peerId].send(JSON.stringify(event));
}
export function sendToEveryone(
  peers: { [userId: string]: SimplePeer.Instance },
  data: string,
): void {
  for (const id in peers) {
    sendToPlayer(peers, data, id);
  }
}
