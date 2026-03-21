import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import usePolling from '../../hooks/usePolling';
import { getGameState, playTurn, forfeitGame, getCards } from '../../api/gameApi';
import DinoCard from './DinoCard';
import StatSelector from './StatSelector';
import TurnResult from './TurnResult';
import GameOver from './GameOver';
import TurnTimer from './TurnTimer';
import './Game.css';

export default function GameBoard() {
  const { id } = useParams();
  const { user } = useAuth();

  const [turnResult, setTurnResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [turnError, setTurnError] = useState('');
  const [cardCache, setCardCache] = useState({});
  const [topCard, setTopCard] = useState(null);
  const [pollEnabled, setPollEnabled] = useState(true);
  const lastSeenTurnRef = useRef(0);

  // Poll game state — pause while showing turn result or when game is finished
  const { data: game, loading, error, refetch } = usePolling(
    () => getGameState(id),
    3000,
    pollEnabled
  );

  // Stop polling when showing turn result or game is finished
  useEffect(() => {
    setPollEnabled(!turnResult && game?.status !== 'FINISHED');
  }, [turnResult, game?.status]);

  // Detect new turn result from polling (for the waiting player)
  useEffect(() => {
    if (game?.lastTurn && game.lastTurn.turnNumber > lastSeenTurnRef.current) {
      lastSeenTurnRef.current = game.lastTurn.turnNumber;
      // Only show if we didn't just play this turn ourselves (active player already sees it)
      if (!turnResult) {
        setTurnResult(game.lastTurn);
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
      } catch {
        // Cards will show as loading
      }
    }
    loadCards();
  }, []);

  // Update top card when game state changes
  useEffect(() => {
    if (game && game.yourHand && game.yourHand.length > 0 && !turnResult) {
      const cardId = game.yourHand[0];
      setTopCard(cardCache[cardId] || null);
    } else if (!game?.yourHand?.length) {
      setTopCard(null);
    }
  }, [game, cardCache, turnResult]);

  const isPlayer1 = game?.player1Id === user?.id;
  const isYourTurn = game?.currentTurnPlayerId === user?.id;

  const handleStatSelect = useCallback(async (stat) => {
    if (submitting || !isYourTurn) return;
    setSubmitting(true);
    setTurnError('');
    try {
      const res = await playTurn(id, stat);
      setTurnResult(res.data);
      lastSeenTurnRef.current = res.data.turnNumber;
    } catch {
      setTurnError('Failed to play turn. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [id, submitting, isYourTurn]);

  const handleDismissResult = useCallback(() => {
    setTurnResult(null);
  }, []);

  const handleForfeit = useCallback(async () => {
    if (!window.confirm('Are you sure you want to forfeit? This counts as a loss.')) return;
    try {
      await forfeitGame(id);
    } catch {
      setTurnError('Failed to forfeit.');
    }
  }, [id]);

  const handleTurnExpired = useCallback(async () => {
    if (isYourTurn) {
      try {
        await forfeitGame(id);
      } catch {
        // Backend may have already forfeited — refetch to get latest state
      }
    }
    refetch();
  }, [id, isYourTurn, refetch]);

  if (loading && !game) return <div className="game-board"><p>Loading game...</p></div>;
  if (error) return <div className="game-board"><p>Error loading game.</p></div>;
  if (!game) return null;

  // FINISHED state
  if (game.status === 'FINISHED') {
    return (
      <div className="game-board">
        <GameOver game={{ ...game, isPlayer1 }} userId={user?.id} />
      </div>
    );
  }

  // WAITING state
  if (game.status === 'WAITING') {
    return (
      <div className="game-board">
        <div className="game-board__waiting">
          <div className="game-board__waiting-spinner" />
          <h3>Waiting for opponent...</h3>
          <p>Share this game ID with a friend:</p>
          <p><strong>{id}</strong></p>
        </div>
      </div>
    );
  }

  // IN_PROGRESS state
  return (
    <div className="game-board">
      <div className="game-board__status">
        <div>
          <div className="game-board__status-label">Your Cards</div>
          <div className="game-board__status-value">{game.yourHand?.length || 0}</div>
        </div>
        <div>
          <div className="game-board__status-label">Draw Pile</div>
          <div className="game-board__status-value">{game.drawPileSize || 0}</div>
        </div>
        <div>
          <div className="game-board__status-label">Opponent Cards</div>
          <div className="game-board__status-value">
            {isPlayer1 ? game.player2HandSize : game.player1HandSize}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'right', marginBottom: '0.5rem' }}>
        <button onClick={handleForfeit} style={{ background: '#c62828', fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}>Forfeit</button>
      </div>

      {turnResult ? (
        <TurnResult
          result={turnResult}
          isPlayer1={isPlayer1}
          userId={user?.id}
          onDismiss={handleDismissResult}
        />
      ) : (
        <>
          <div className={`game-board__turn-indicator ${isYourTurn ? 'game-board__turn-indicator--your-turn' : 'game-board__turn-indicator--waiting'}`}>
            <span>{isYourTurn ? 'Your turn — pick a stat!' : 'Waiting for opponent...'}</span>
            <TurnTimer turnDeadline={game.turnDeadline} isYourTurn={isYourTurn} onExpired={handleTurnExpired} />
          </div>

          {turnError && (
            <p style={{ color: '#c62828', background: '#fdecea', padding: '0.5rem', borderRadius: '4px', margin: '0.5rem 0' }}>
              {turnError}
            </p>
          )}

          {topCard && <DinoCard card={topCard} />}

          {isYourTurn && topCard && (
            <StatSelector
              card={topCard}
              onSelect={handleStatSelect}
              disabled={submitting}
            />
          )}
        </>
      )}
    </div>
  );
}
