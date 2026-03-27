import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import useGameBoard from '../../hooks/useGameBoard';
import { playTurn, forfeitGame } from '../../api/gameApi';
import StatSelector from './StatSelector';
import TurnResult from './TurnResult';
import GameOver from './GameOver';
import TurnTimer from './TurnTimer';
import PreGameCeremony from './PreGameCeremony';
import WaitingForOpponent from './WaitingForOpponent';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorMessage from '../shared/ErrorMessage';
import '../shared/Shared.css';
import './Game.css';

export default function GameBoard() {
  const { id } = useParams();

  const {
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
    lastSeenTurnRef,
  } = useGameBoard(id);

  const [submitting, setSubmitting] = useState(false);
  const [turnError, setTurnError] = useState('');

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
  }, [id, submitting, isYourTurn, setTurnResult, lastSeenTurnRef]);

  const handleDismissResult = useCallback(() => {
    setTurnResult(null);
  }, [setTurnResult]);

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
      } catch (err) {
        console.warn('Forfeit request failed (may already be forfeited):', err);
      }
    }
    refetch();
  }, [id, isYourTurn, refetch]);

  if (loading && !game) return <div className="game-board"><LoadingSpinner message="Loading game..." /></div>;
  if (error) return <div className="game-board"><ErrorMessage message="Error loading game." onRetry={refetch} /></div>;
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
        <WaitingForOpponent gameId={id} isPlayer1={isPlayer1} />
      </div>
    );
  }

  // IN_PROGRESS — pre-game ceremony
  if (showCeremony) {
    return (
      <div className="game-board">
        <PreGameCeremony
          opponentId={opponentId}
          currentTurnPlayerId={game.currentTurnPlayerId}
          currentPlayerId={user?.id}
          onComplete={() => setShowCeremony(false)}
        />
      </div>
    );
  }

  // IN_PROGRESS — active game
  return (
    <div className="game-board">
      {/* Compact status line */}
      <div className="game-board__status">
        <span className="game-board__status-item">
          <strong>{game.yourHand?.length || 0}</strong> cards
        </span>
        <span className="game-board__status-divider">·</span>
        <span className="game-board__status-item">
          Draw: <strong>{game.drawPileSize || 0}</strong>
        </span>
        <span className="game-board__status-divider">·</span>
        <span className="game-board__status-item">
          Opp: <strong>{isPlayer1 ? game.player2HandSize : game.player1HandSize}</strong>
        </span>
        <button onClick={handleForfeit} className="btn--danger btn--small">Forfeit</button>
      </div>

      {/* Turn indicator — full width, outside grid */}
      {!turnResult && (
        <div
          className={`game-board__turn-bar ${isYourTurn ? 'game-board__turn-bar--your-turn' : 'game-board__turn-bar--waiting'}`}
          aria-live="polite"
        >
          <span>{isYourTurn ? 'Your turn — pick a stat!' : 'Waiting for opponent...'}</span>
          <TurnTimer turnDeadline={game.turnDeadline} isYourTurn={isYourTurn} onExpired={handleTurnExpired} />
        </div>
      )}

      {turnError && (
        <p className="game-board__turn-error" role="alert">{turnError}</p>
      )}

      <div className="game-board__play-area">
        {turnResult ? (
          <TurnResult
            result={turnResult}
            isPlayer1={isPlayer1}
            userId={user?.id}
            player1Card={cardCache[turnResult?.player1CardId] || null}
            player2Card={cardCache[turnResult?.player2CardId] || null}
            onDismiss={handleDismissResult}
          />
        ) : (
          <>
            {/* Left: Image display (NOT DinoCard) */}
            <div className="game-board__card-display">
              {topCard?.imageUrl && (
                <img
                  className="game-board__card-image"
                  src={topCard.imageUrl}
                  alt={topCard.name}
                />
              )}
              {topCard && (
                <div className="game-board__card-overlay">
                  <h3 className="game-board__card-name">{topCard.name}</h3>
                  {topCard.meaning && (
                    <div className="game-board__card-meaning">"{topCard.meaning}"</div>
                  )}
                  <div className="game-board__card-tags">
                    {topCard.diet && (
                      <span className={`dino-card__tag dino-card__tag--${topCard.diet.toLowerCase()}`}>
                        {topCard.diet}
                      </span>
                    )}
                    {topCard.era && <span className="dino-card__tag">{topCard.era}</span>}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Controls */}
            <div className="game-board__controls">
              {isYourTurn && topCard && (
                <StatSelector
                  card={topCard}
                  onSelect={handleStatSelect}
                  disabled={submitting}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
