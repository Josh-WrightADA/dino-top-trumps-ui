import { describe, it, expect } from 'vitest';
import { formatWinRate } from './formatWinRate';

describe('formatWinRate', () => {
  it('returns percentage for valid games', () => {
    expect(formatWinRate(7, 10)).toBe('70%');
  });

  it('rounds to nearest integer', () => {
    expect(formatWinRate(1, 3)).toBe('33%');
  });

  it('returns 100% when all games won', () => {
    expect(formatWinRate(5, 5)).toBe('100%');
  });

  it('returns 0% when no games won', () => {
    expect(formatWinRate(0, 10)).toBe('0%');
  });

  it('returns N/A when gamesPlayed is 0', () => {
    expect(formatWinRate(0, 0)).toBe('N/A');
  });

  it('returns N/A when gamesPlayed is null', () => {
    expect(formatWinRate(0, null)).toBe('N/A');
  });

  it('returns N/A when gamesPlayed is undefined', () => {
    expect(formatWinRate(0, undefined)).toBe('N/A');
  });
});
