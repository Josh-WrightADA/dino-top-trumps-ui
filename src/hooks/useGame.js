import { useState, useCallback } from 'react';
import { getGameState, playTurn } from '../api/gameApi';

export default function useGame(gameId) {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGame = useCallback(async () => {
    if (!gameId) return;
    setLoading(true);
    try {
      const res = await getGameState(gameId);
      setGame(res.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  const submitTurn = useCallback(async (stat) => {
    if (!gameId) return;
    try {
      const res = await playTurn(gameId, stat);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, [gameId]);

  return { game, loading, error, fetchGame, submitTurn };
}
