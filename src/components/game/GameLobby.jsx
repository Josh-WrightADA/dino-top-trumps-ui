import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame, getAvailableGames, joinGame } from '../../api/gameApi';
import ErrorMessage from '../shared/ErrorMessage';
import LoadingSpinner from '../shared/LoadingSpinner';
import './GameLobby.css';

export default function GameLobby() {
  const [games, setGames] = useState([]);
  const [joinGameId, setJoinGameId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [gamesLoading, setGamesLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchGames() {
    try {
      const res = await getAvailableGames();
      setGames(res.data);
    } catch (err) {
      console.warn('Failed to fetch available games:', err);
    } finally {
      setGamesLoading(false);
    }
  }

  useEffect(() => {
    fetchGames();
    const interval = setInterval(fetchGames, 5000);
    return () => clearInterval(interval);
  }, []);

  async function handleCreate() {
    setLoading(true);
    setError('');
    try {
      const res = await createGame();
      navigate(`/game/${res.data.id}`);
    } catch {
      setError('Failed to create game.');
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(gameId) {
    setLoading(true);
    setError('');
    try {
      await joinGame(gameId);
      navigate(`/game/${gameId}`);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 400) {
        setError('Cannot join this game. It may be full or your own.');
      } else if (status === 404) {
        setError('Game not found.');
      } else {
        setError('Failed to join game.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinById(e) {
    e.preventDefault();
    if (!joinGameId.trim()) return;
    await handleJoin(joinGameId.trim());
  }

  return (
    <div className="lobby">
      <div className="lobby__header">
        <h2 className="lobby__title">Game Lobby</h2>
        <button className="lobby__create-btn" onClick={handleCreate} disabled={loading}>
          {loading ? 'Creating...' : 'Create Game'}
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => setError('')} />}

      <div className="lobby__section">
        <h3 className="lobby__section-title">Available Games</h3>
        {gamesLoading ? (
          <LoadingSpinner message="Loading games..." />
        ) : games.length === 0 ? (
          <p className="lobby__empty-state">No battles waiting — be the first to enter the arena!</p>
        ) : (
          <ul className="lobby__game-list">
            {games.map((game) => (
              <li key={game.id} className="lobby__game-item">
                <span>{game.hostName || 'Unknown'}'s Game</span>
                <button className="btn btn--small lobby__join-btn" onClick={() => handleJoin(game.id)} disabled={loading}>Join</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="lobby__tier-info">
        <span className="lobby__tier-label">Ranks:</span>
        <span className="lobby__tier-pill lobby__tier-pill--hatchling">Hatchling</span>
        <span className="lobby__tier-pill lobby__tier-pill--herbivore">Herbivore</span>
        <span className="lobby__tier-pill lobby__tier-pill--carnivore">Carnivore</span>
        <span className="lobby__tier-pill lobby__tier-pill--apex">Apex</span>
        <span className="lobby__tier-pill lobby__tier-pill--meteor">Meteor</span>
      </div>

      <div className="lobby__section">
        <h3 className="lobby__section-title">Join by Game ID</h3>
        <form onSubmit={handleJoinById} className="lobby__join-form">
          <input
            type="text"
            placeholder="Paste game ID here..."
            value={joinGameId}
            onChange={(e) => setJoinGameId(e.target.value)}
            className="lobby__join-input"
            aria-label="Game ID"
          />
          <button className="btn" type="submit" disabled={loading || !joinGameId.trim()}>Join</button>
        </form>
      </div>
    </div>
  );
}
