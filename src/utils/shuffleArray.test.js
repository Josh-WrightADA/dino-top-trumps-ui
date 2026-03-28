import { describe, it, expect } from 'vitest';
import { shuffleArray } from './shuffleArray';

describe('shuffleArray', () => {
  it('returns a new array with the same length', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray(input);
    expect(result).toHaveLength(input.length);
    expect(result).not.toBe(input);
  });

  it('contains all original elements', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray(input);
    expect(result.sort()).toEqual(input.sort());
  });

  it('does not mutate the original array', () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    shuffleArray(input);
    expect(input).toEqual(copy);
  });

  it('handles an empty array', () => {
    expect(shuffleArray([])).toEqual([]);
  });

  it('handles a single-element array', () => {
    expect(shuffleArray([42])).toEqual([42]);
  });

  it('produces a different order at least once over many runs', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const original = JSON.stringify(input);
    let differed = false;
    for (let i = 0; i < 20; i++) {
      if (JSON.stringify(shuffleArray(input)) !== original) {
        differed = true;
        break;
      }
    }
    expect(differed).toBe(true);
  });
});
