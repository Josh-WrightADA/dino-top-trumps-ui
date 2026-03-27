import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useCards from './useCards';

vi.mock('../api/gameApi', () => ({
  getCards: vi.fn(),
}));

import { getCards } from '../api/gameApi';

describe('useCards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns cards after successful fetch', async () => {
    const mockCards = [{ id: 1, name: 'T-Rex' }, { id: 2, name: 'Stego' }];
    getCards.mockResolvedValue({ data: mockCards });

    const { result } = renderHook(() => useCards());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.cards).toEqual(mockCards);
    expect(result.current.error).toBeNull();
  });

  it('starts in loading state', () => {
    getCards.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useCards());

    expect(result.current.loading).toBe(true);
    expect(result.current.cards).toEqual([]);
  });

  it('sets error on fetch failure', async () => {
    const mockError = new Error('Network error');
    getCards.mockRejectedValue(mockError);

    const { result } = renderHook(() => useCards());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe(mockError);
    expect(result.current.cards).toEqual([]);
  });

  it('calls getCards once on mount', async () => {
    getCards.mockResolvedValue({ data: [] });

    renderHook(() => useCards());

    await waitFor(() => expect(getCards).toHaveBeenCalledOnce());
  });
});
