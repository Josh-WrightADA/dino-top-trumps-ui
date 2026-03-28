import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getFriends, getPendingRequests, removeFriend,
  acceptFriendRequest, declineFriendRequest, sendFriendRequest,
  getPendingInvites, acceptGameInvite, declineGameInvite,
} from '../api/socialApi';
import { getLeaderboard } from '../api/gameApi';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import './Friends.css';

export default function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchFeedback, setSearchFeedback] = useState({ userId: null, message: '', type: '' });
  const navigate = useNavigate();

  async function handleSearch() {
    if (searchQuery.trim().length < 2) return;
    setSearching(true);
    setSearchResults([]);
    try {
      const res = await getLeaderboard();
      const filtered = res.data.filter(player =>
        player.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (player.displayName && player.displayName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSearchResults(filtered);
    } catch (err) {
      console.warn('Failed to search players:', err);
    } finally {
      setSearching(false);
    }
  }

  async function handleAddFriend(userId) {
    setSearchFeedback({ userId, message: '', type: '' });
    try {
      await sendFriendRequest(userId);
      setSearchFeedback({ userId, message: 'Request sent!', type: 'success' });
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Failed to send request.';
      setSearchFeedback({ userId, message: detail, type: 'error' });
    }
  }

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [friendsRes, requestsRes, invitesRes] = await Promise.all([
        getFriends(),
        getPendingRequests(),
        getPendingInvites(),
      ]);
      setFriends(friendsRes.data);
      setRequests(requestsRes.data);
      setInvites(invitesRes.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load friends data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function handleAcceptRequest(friendshipId) {
    try {
      await acceptFriendRequest(friendshipId);
      await fetchAll();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to accept request.');
    }
  }

  async function handleDeclineRequest(friendshipId) {
    try {
      await declineFriendRequest(friendshipId);
      setRequests((prev) => prev.filter((r) => r.id !== friendshipId));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to decline request.');
    }
  }

  async function handleRemoveFriend(friendshipId) {
    if (!window.confirm('Remove this friend?')) return;
    try {
      await removeFriend(friendshipId);
      setFriends((prev) => prev.filter((f) => f.id !== friendshipId));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to remove friend.');
    }
  }

  async function handleAcceptInvite(inviteId, gameId) {
    try {
      await acceptGameInvite(inviteId);
      navigate(`/game/${gameId}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to accept game invite.');
    }
  }

  async function handleDeclineInvite(inviteId) {
    try {
      await declineGameInvite(inviteId);
      setInvites((prev) => prev.filter((i) => i.id !== inviteId));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to decline game invite.');
    }
  }

  if (loading) return <div className="page"><LoadingSpinner message="Loading friends..." /></div>;

  return (
    <div className="page">
      <h1 className="page-heading friends-page__title">Friends</h1>

      {error && <ErrorMessage message={error} onRetry={fetchAll} />}

      {/* Add a Friend */}
      <div className="friends__search">
        <h3 className="section-heading friends__search-title">Add a Friend</h3>
        <div className="friends__search-input-row">
          <input
            type="text"
            placeholder="Search by username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="friends__search-input"
            aria-label="Search for friends"
          />
          <button className="btn" onClick={handleSearch} disabled={searching || searchQuery.trim().length < 2}>
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>
        {searchResults.length > 0 && (
          <div className="friends__search-results">
            {searchResults.map(player => (
              <div key={player.userId} className="friends__search-result">
                <span>{player.displayName || player.username}</span>
                <div className="friends__search-result-actions">
                  <button
                    className="btn--secondary btn--small"
                    onClick={() => handleAddFriend(player.userId)}
                    disabled={searchFeedback.userId === player.userId && searchFeedback.type === 'success'}
                  >
                    {searchFeedback.userId === player.userId && searchFeedback.type === 'success'
                      ? 'Sent!'
                      : 'Add Friend'}
                  </button>
                  {searchFeedback.userId === player.userId && searchFeedback.message && (
                    <span
                      className={`friends-page__feedback friends-page__feedback--${searchFeedback.type}`}
                      role={searchFeedback.type === 'error' ? 'alert' : 'status'}
                    >
                      {searchFeedback.message}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Friend Requests */}
      <section className="friends-page__section">
        <h2 className="section-heading friends-page__section-title">
          Pending Requests {requests.length > 0 && `(${requests.length})`}
        </h2>
        {requests.length === 0 ? (
          <p className="friends-page__empty">No pending requests — your allies are out hunting.</p>
        ) : (
          <ul className="friends-page__list">
            {requests.map((req) => (
              <li key={req.id} className="friends-page__card">
                <div className="friends-page__card-info">
                  <span className="friends-page__card-label">From</span>
                  <span className="friends-page__card-value">{req.requesterId.slice(0, 12)}...</span>
                  <span className="friends-page__card-meta">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="friends-page__card-actions">
                  <button
                    className="btn--primary btn--small"
                    onClick={() => handleAcceptRequest(req.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn--secondary btn--small"
                    onClick={() => handleDeclineRequest(req.id)}
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* My Friends */}
      <section className="friends-page__section">
        <h2 className="section-heading friends-page__section-title">
          My Friends {friends.length > 0 && `(${friends.length})`}
        </h2>
        {friends.length === 0 ? (
          <p className="friends-page__empty">
            No allies in your pack yet. Search above to find players!
          </p>
        ) : (
          <ul className="friends-page__list">
            {friends.map((f) => (
              <li key={f.id} className="friends-page__card">
                <div className="friends-page__card-info">
                  <span className="friends-page__card-label">Friend ID</span>
                  <span className="friends-page__card-value">{f.addresseeId.slice(0, 12)}...</span>
                  <span className="friends-page__card-meta">
                    Since {new Date(f.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="friends-page__card-actions">
                  <button
                    className="btn--danger btn--small"
                    onClick={() => handleRemoveFriend(f.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Pending Game Invites */}
      <section className="friends-page__section">
        <h2 className="section-heading friends-page__section-title">
          Game Invites {invites.length > 0 && `(${invites.length})`}
        </h2>
        {invites.length === 0 ? (
          <p className="friends-page__empty">No battle invites waiting — challenge a friend from the game board!</p>
        ) : (
          <ul className="friends-page__list">
            {invites.map((inv) => (
              <li key={inv.id} className="friends-page__card">
                <div className="friends-page__card-info">
                  <span className="friends-page__card-label">Game</span>
                  <span className="friends-page__card-value friends-page__game-link">
                    {inv.gameId.slice(0, 12)}...
                  </span>
                  <span className="friends-page__card-meta">
                    From {inv.inviterId.slice(0, 8)}...
                    {inv.expiresAt && ` · Expires ${new Date(inv.expiresAt).toLocaleTimeString()}`}
                  </span>
                </div>
                <div className="friends-page__card-actions">
                  <button
                    className="btn--primary btn--small"
                    onClick={() => handleAcceptInvite(inv.id, inv.gameId)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn--secondary btn--small"
                    onClick={() => handleDeclineInvite(inv.id)}
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
