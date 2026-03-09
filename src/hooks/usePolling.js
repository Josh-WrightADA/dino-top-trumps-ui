import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook that polls an async function at a given interval.
 *
 * @param {Function} asyncFn - Async function to call on each poll
 * @param {number} interval - Polling interval in milliseconds
 * @param {boolean} [enabled=true] - Whether polling is active
 * @returns {{ data: any, loading: boolean, error: any }}
 */
export default function usePolling(asyncFn, interval, enabled = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const savedFn = useRef(asyncFn);

  // Keep the ref up to date with the latest function
  useEffect(() => {
    savedFn.current = asyncFn;
  }, [asyncFn]);

  const poll = useCallback(async () => {
    try {
      const result = await savedFn.current();
      setData(result.data ?? result);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Initial fetch
    poll();

    const id = setInterval(poll, interval);
    return () => clearInterval(id);
  }, [poll, interval, enabled]);

  return { data, loading, error };
}
