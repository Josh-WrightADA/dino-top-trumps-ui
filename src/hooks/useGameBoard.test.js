import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useGameBoard from './useGameBoard';

// Mock dependencies
vi.mock('./useAuth', () => ({
  default: () => ({ user: { id: 'user-1', displayName: 'TestPlayer' } }),
}));

vi.mock('./usePolling', () => ({
  default: vi.fn(() => ({
    data: null,
    loading: true,
    error: null,
    refetch: vi.fn(),
  })),
}));

vi.mock('../api/gameApi', () => ({
  getGameState: vi.fn(),
  getCards: vi.fn(() => Promise.resolve({ data: [] })),
}));

describe('useGameBoard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('returns the expected shape', async () => {
    let result;
    await act(async () => {
      result = renderHook(() => useGameBoard('game-123'));
    });

    const hook = result.result.current;

    // Verify every key in the returned object
    expect(hook).toHaveProperty('user');
    expect(hook).toHaveProperty('game');
    expect(hook).toHaveProperty('loading');
    expect(hook).toHaveProperty('error');
    expect(hook).toHaveProperty('refetch');
    expect(hook).toHaveProperty('cardCache');
    expect(hook).toHaveProperty('topCard');
    expect(hook).toHaveProperty('isPlayer1');
    expect(hook).toHaveProperty('isYourTurn');
    expect(hook).toHaveProperty('opponentId');
    expect(hook).toHaveProperty('turnResult');
    expect(hook).toHaveProperty('setTurnResult');
    expect(hook).toHaveProperty('showCeremony');
    expect(hook).toHaveProperty('setShowCeremony');
    expect(hook).toHaveProperty('pollEnabled');
    expect(hook).toHaveProperty('setPollEnabled');
    expect(hook).toHaveProperty('lastSeenTurnRef');
  });

  it('returns the authenticated user', async () => {
    let result;
    await act(async () => {
      result = renderHook(() => useGameBoard('game-123'));
    });

    expect(result.result.current.user).toEqual({
      id: 'user-1',
      displayName: 'TestPlayer',
    });
  });

  it('initialises with sensible defaults', async () => {
    let result;
    await act(async () => {
      result = renderHook(() => useGameBoard('game-123'));
    });

    const hook = result.result.current;
    expect(hook.turnResult).toBeNull();
    expect(hook.topCard).toBeNull();
    expect(hook.showCeremony).toBe(false);
    expect(hook.cardCache).toEqual({});
  });

  it('derives isPlayer1 as false when game is null', async () => {
    let result;
    await act(async () => {
      result = renderHook(() => useGameBoard('game-123'));
    });

    expect(result.result.current.isPlayer1).toBe(false);
    expect(result.result.current.isYourTurn).toBe(false);
  });
});
