import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import usePolling from './usePolling';

describe('usePolling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('calls fetchFn immediately on mount', async () => {
    const fetchFn = vi.fn(() => Promise.resolve({ data: 'response' }));

    await act(async () => {
      renderHook(() => usePolling(fetchFn, 5000));
    });

    expect(fetchFn).toHaveBeenCalledOnce();
  });

  it('calls fetchFn at the specified interval', async () => {
    const fetchFn = vi.fn(() => Promise.resolve({ data: 'response' }));

    await act(async () => {
      renderHook(() => usePolling(fetchFn, 1000));
    });

    expect(fetchFn).toHaveBeenCalledTimes(1);

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(fetchFn).toHaveBeenCalledTimes(2);

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(fetchFn).toHaveBeenCalledTimes(3);
  });

  it('cleans up interval on unmount', async () => {
    const fetchFn = vi.fn(() => Promise.resolve({ data: 'response' }));

    const { unmount } = renderHook(() => usePolling(fetchFn, 1000));

    await act(async () => {});

    unmount();

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    // After unmount, should not have been called again beyond the initial call
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('does not poll when enabled is false', async () => {
    const fetchFn = vi.fn(() => Promise.resolve({ data: 'response' }));

    await act(async () => {
      renderHook(() => usePolling(fetchFn, 1000, false));
    });

    expect(fetchFn).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('handles fetch errors without crashing', async () => {
    const fetchFn = vi.fn(() => Promise.reject(new Error('Network error')));

    let result;
    await act(async () => {
      result = renderHook(() => usePolling(fetchFn, 1000));
    });

    expect(result.result.current.error).toBeInstanceOf(Error);
    expect(result.result.current.error.message).toBe('Network error');
    expect(result.result.current.loading).toBe(false);
  });
});
