import { useState, useEffect, useMemo, useRef } from 'react';
import usePolling from './usePolling';
import useAuth from './useAuth';
import { getGameState, getCards } from '../api/gameApi';

/**
 * Custom hook that encapsulates all GameBoard state and side-effects.
 *
 * @param {string} gameId - The game UUID from the route
 * @returns {object} Game board state and setters
 */
export default function useGameBoard(gameId) {
  const { user } = useAuth();

  const [turnResult, setTurnResult] = useState(null);
  const [cardCache, setCardCache] = useState({});
  const [pollEnabled, setPollEnabled] = useState(true);
  const [showCeremony, setShowCeremony] = useState(false);
  const lastSeenTurnRef = useRef(0);
  const ceremonyShownRef = useRef(false);

  // Poll game state — pause while showing turn result or when game is finished
  const { data: game, loading, error, refetch } = usePolling(
    () => getGameState(gameId),
    3000,
    pollEnabled
  );

  // Stop polling when showing turn result or game is finished
  useEffect(() => {
    setPollEnabled(!turnResult && game?.status !== 'FINISHED'); // eslint-disable-line react-hooks/set-state-in-effect -- Syncs derived polling flag with usePolling input
  }, [turnResult, game?.status]);

  // Show ceremony once when the game first becomes IN_PROGRESS with no turns played
  useEffect(() => {
    if (
      game?.status === 'IN_PROGRESS' &&
      !game?.lastTurn &&
      !ceremonyShownRef.current &&
      !sessionStorage.getItem(`ceremony-${gameId}`)
    ) {
      ceremonyShownRef.current = true;
      sessionStorage.setItem(`ceremony-${gameId}`, 'true');
      setShowCeremony(true); // eslint-disable-line react-hooks/set-state-in-effect -- Reacting to external polling data
    }
  }, [game?.status, game?.lastTurn, gameId]);

  // Detect new turn result from polling (for the waiting player)
  useEffect(() => {
    if (game?.lastTurn && game.lastTurn.turnNumber > lastSeenTurnRef.current) {
      lastSeenTurnRef.current = game.lastTurn.turnNumber;
      // Only show if we didn't just play this turn ourselves (active player already sees it)
      if (!turnResult) {
        setTurnResult(game.lastTurn); // eslint-disable-line react-hooks/set-state-in-effect -- Reacting to external polling data
      }
    }
  }, [game?.lastTurn, turnResult]);

  // Load all cards once to build a lookup cache
  useEffect(() => {
    async function loadCards() {
      try {
        const res = await getCards();
        const cache = {};
        for (const card of res.data) {
          cache[card.id] = card;
        }
        setCardCache(cache);
      } catch (err) {
        console.warn('Failed to load card cache:', err);
      }
    }
    loadCards();
  }, []);

  // Derive top card from game hand + card cache (no effect needed)
  const topCard = useMemo(() => {
    if (game?.yourHand?.length > 0 && !turnResult) {
      return cardCache[game.yourHand[0]] || null;
    }
    return null;
  }, [game, cardCache, turnResult]);

  const isPlayer1 = game?.player1Id === user?.id;
  const isYourTurn = game?.currentTurnPlayerId === user?.id;
  const opponentId = game?.player1Id === user?.id ? game?.player2Id : game?.player1Id;

  return {
    user,
    game,
    loading,
    error,
    refetch,
    cardCache,
    topCard,
    isPlayer1,
    isYourTurn,
    opponentId,
    turnResult,
    setTurnResult,
    showCeremony,
    setShowCeremony,
    pollEnabled,
    setPollEnabled,
    lastSeenTurnRef,
  };
}
