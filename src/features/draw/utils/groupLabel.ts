const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function toAlphabetLabel(index: number): string {
  let remaining = index;
  let label = '';

  do {
    label = ALPHABET[remaining % ALPHABET.length] + label;
    remaining = Math.floor(remaining / ALPHABET.length) - 1;
  } while (remaining >= 0);

  return label;
}

export function toGroupId(index: number): string {
  return `group-${toAlphabetLabel(index).toLowerCase()}`;
}

export function groupLabel(index: number): string {
  return `Grupo ${toAlphabetLabel(index)}`;
}
