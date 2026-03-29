export type RandomNumberGenerator = () => number;

export function createSeededRng(seed: number): RandomNumberGenerator {
  let state = seed | 0;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateSeed(): number {
  return Math.floor(Math.random() * 2147483647) + 1;
}

export function shuffleList<T>(
  items: readonly T[],
  randomNumberGenerator: RandomNumberGenerator = Math.random
): T[] {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const targetIndex = Math.floor(randomNumberGenerator() * (index + 1));
    const currentItem = shuffledItems[index] as T;
    const targetItem = shuffledItems[targetIndex] as T;

    shuffledItems[index] = targetItem;
    shuffledItems[targetIndex] = currentItem;
  }

  return shuffledItems;
}
