import type { GameDataState } from '../types';
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

export async function waitForCondition(
  condition: () => boolean,
): Promise<void> {
  return new Promise(function (resolve, reject) {
    const interval = setInterval(() => {
      if (condition()) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}

export function debugObject(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const proxied = new Proxy(obj, {
    get: function (target, prop) {
      console.log({ type: 'get', target, prop });
      return Reflect.get(target, prop);
    },
    set: function (target, prop, value) {
      console.log({ type: 'set', target, prop, value });
      return Reflect.set(target, prop, value);
    },
  });

  return proxied;
}
export const isGameDataStateEqual = (
  leftState: GameDataState,
  rightState: GameDataState,
): boolean => {
  return true;
};
