import { useState, useEffect } from 'react';
import { getFriends, sendGameInvite } from '../../api/socialApi';

/**
 * Waiting state UI for a game that hasn't started yet.
 * Displays the game code and optional friend invite list.
 */
export default function WaitingForOpponent({ gameId, isPlayer1 }) {
  const [friends, setFriends] = useState([]);
  const [inviteStatus, setInviteStatus] = useState({});

  // Load friends list when the host is waiting
  useEffect(() => {
    if (isPlayer1) {
      getFriends()
        .then((res) => setFriends(res.data))
        .catch((err) => {
          console.warn('Failed to load friends list:', err);
        });
    }
  }, [isPlayer1]);

  async function handleSendInvite(friendId) {
    setInviteStatus((prev) => ({ ...prev, [friendId]: 'sending' }));
    try {
      await sendGameInvite(gameId, friendId);
      setInviteStatus((prev) => ({ ...prev, [friendId]: 'sent' }));
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to send invite.';
      setInviteStatus((prev) => ({ ...prev, [friendId]: message }));
    }
  }

  return (
    <>
      <div className="game-board__waiting">
        <div className="game-board__waiting-spinner" />
        <h3>Waiting for opponent...</h3>
        <p>Send this code to a challenger:</p>
        <p>
          <span
            className="game-board__game-id"
            onClick={() => { navigator.clipboard.writeText(gameId); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigator.clipboard.writeText(gameId); } }}
            role="button"
            tabIndex={0}
            title="Click to copy"
          >
            {gameId}
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
    </>
  );
}
