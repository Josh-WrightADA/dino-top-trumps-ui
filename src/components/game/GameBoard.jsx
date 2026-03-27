import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import usePolling from '../../hooks/usePolling';
import { getGameState, playTurn, forfeitGame, getCards } from '../../api/gameApi';
import { getFriends, sendGameInvite } from '../../api/socialApi';
import StatSelector from './StatSelector';
import TurnResult from './TurnResult';
import GameOver from './GameOver';
import TurnTimer from './TurnTimer';
import PreGameCeremony from './PreGameCeremony';
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
  const [showCeremony, setShowCeremony] = useState(false);
  const lastSeenTurnRef = useRef(0);
  const ceremonyShownRef = useRef(false);

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

  // Show ceremony once when the game first becomes IN_PROGRESS with no turns played
  useEffect(() => {
    if (
      game?.status === 'IN_PROGRESS' &&
      !game?.lastTurn &&
      !ceremonyShownRef.current &&
      !sessionStorage.getItem(`ceremony-${id}`)
    ) {
      ceremonyShownRef.current = true;
      sessionStorage.setItem(`ceremony-${id}`, 'true');
      setShowCeremony(true);
    }
  }, [game?.status, game?.lastTurn, id]);

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
      } catch (err) {
        console.warn('Failed to load card cache:', err);
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
  const opponentId = game?.player1Id === user?.id ? game?.player2Id : game?.player1Id;

  // Load friends list when game is WAITING and current user is the host
  useEffect(() => {
    if (game?.status === 'WAITING' && isPlayer1) {
      getFriends()
        .then((res) => setFriends(res.data))
        .catch((err) => {
          console.warn('Failed to load friends list:', err);
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
      } catch (err) {
        console.warn('Forfeit request failed (may already be forfeited):', err);
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
          <p>Send this code to a challenger:</p>
          <p>
            <span
              className="game-board__game-id"
              onClick={() => { navigator.clipboard.writeText(id); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigator.clipboard.writeText(id); } }}
              role="button"
              tabIndex={0}
              title="Click to copy"
            >
              {id}
            </span>
          </p>
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
