import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import usePolling from '../../hooks/usePolling';
import { getGameState, playTurn, forfeitGame, getCards } from '../../api/gameApi';
import { getFriends, sendGameInvite } from '../../api/socialApi';
import DinoCard from './DinoCard';
import StatSelector from './StatSelector';
import TurnResult from './TurnResult';
import GameOver from './GameOver';
import TurnTimer from './TurnTimer';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorMessage from '../shared/ErrorMessage';
import '../shared/Shared.css';
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
  const [showCoinFlip, setShowCoinFlip] = useState(false);
  const lastSeenTurnRef = useRef(0);
  const coinFlipShownRef = useRef(false);

  // Friends invite state
  const [friends, setFriends] = useState([]);
  const [inviteStatus, setInviteStatus] = useState({});

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

  // Show coin flip once when the game first becomes IN_PROGRESS with no turns played
  useEffect(() => {
    if (
      game?.status === 'IN_PROGRESS' &&
      !game?.lastTurn &&
      !coinFlipShownRef.current
    ) {
      coinFlipShownRef.current = true;
      setShowCoinFlip(true);
      const timer = setTimeout(() => setShowCoinFlip(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [game?.status, game?.lastTurn]);

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

  // Load friends list when game is WAITING and current user is the host
  useEffect(() => {
    if (game?.status === 'WAITING' && isPlayer1) {
      getFriends()
        .then((res) => setFriends(res.data))
        .catch(() => {
          // Friends list unavailable — silently skip
        });
    }
  }, [game?.status, isPlayer1]);

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

  async function handleSendInvite(friendId) {
    setInviteStatus((prev) => ({ ...prev, [friendId]: 'sending' }));
    try {
      await sendGameInvite(id, friendId);
      setInviteStatus((prev) => ({ ...prev, [friendId]: 'sent' }));
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to send invite.';
      setInviteStatus((prev) => ({ ...prev, [friendId]: message }));
    }
  }

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
        <div className="game-board__waiting">
          <div className="game-board__waiting-spinner" />
          <h3>Waiting for opponent...</h3>
          <p>Share this game ID with a friend:</p>
          <p><strong>{id}</strong></p>
        </div>

        {isPlayer1 && friends.length > 0 && (
          <div className="game-board__invite-friends">
            <h4 className="game-board__invite-title">Invite a Friend</h4>
            <ul className="game-board__invite-list">
              {friends.map((f) => {
                const friendId = f.addresseeId;
                const status = inviteStatus[friendId];
                return (
                  <li key={f.id} className="game-board__invite-row">
                    <span className="game-board__invite-id">{friendId.slice(0, 12)}...</span>
                    {status === 'sent' ? (
                      <span className="game-board__invite-sent">Invited</span>
                    ) : (
                      <button
                        className="btn--secondary btn--small"
                        onClick={() => handleSendInvite(friendId)}
                        disabled={status === 'sending'}
                      >
                        {status === 'sending' ? 'Sending...' : 'Invite'}
                      </button>
                    )}
                    {status && status !== 'sent' && status !== 'sending' && (
                      <span className="game-board__invite-error">{status}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // IN_PROGRESS state
  return (
    <div className="game-board">
      {showCoinFlip && (
        <div className="game-board__coin-flip">
          <h2 className="game-board__coin-flip-title">Coin Flip!</h2>
          <p className="game-board__coin-flip-result">
            {game.currentTurnPlayerId === user?.id
              ? "You go first!"
              : "Your opponent goes first!"}
          </p>
        </div>
      )}

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

      <div className="game-board__forfeit-row">
        <button onClick={handleForfeit} className="btn--danger btn--small">Forfeit</button>
      </div>

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
          <div
            className={`game-board__turn-indicator ${isYourTurn ? 'game-board__turn-indicator--your-turn' : 'game-board__turn-indicator--waiting'}`}
            aria-live="polite"
          >
            <span>{isYourTurn ? 'Your turn — pick a stat!' : 'Waiting for opponent...'}</span>
            <TurnTimer turnDeadline={game.turnDeadline} isYourTurn={isYourTurn} onExpired={handleTurnExpired} />
          </div>

          {turnError && (
            <p className="game-board__turn-error" role="alert">
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
