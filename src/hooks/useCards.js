import { useState, useEffect, useCallback } from 'react';
import { getCards } from '../api/gameApi';

export default function useCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCards();
      setCards(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return { cards, loading, error, refetch: fetchCards };
}
