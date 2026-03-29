export type RandomNumberGenerator = () => number;

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
