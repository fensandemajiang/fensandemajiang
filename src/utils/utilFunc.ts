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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function waitForCondition(
  condition: () => boolean,
): Promise<void> {
  return new Promise(async function (resolve, reject) {
    while (condition() !== true) {
      await sleep(100);
    }
    resolve();
  });
}
