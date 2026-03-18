import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame, getAvailableGames, joinGame } from '../../api/gameApi';
import '../game/Game.css';

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
    } catch {
      // Silent — available games is optional
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
        <h2>Game Lobby</h2>
        <button onClick={handleCreate} disabled={loading}>
          {loading ? 'Creating...' : 'Create Game'}
        </button>
      </div>

      {error && <p style={{ color: '#c62828', background: '#fdecea', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</p>}

      <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Available Games</h3>
        {gamesLoading ? (
          <p style={{ color: '#888' }}>Loading...</p>
        ) : games.length === 0 ? (
          <p style={{ color: '#888' }}>No games waiting for players. Create one above.</p>
        ) : (
          <ul className="lobby__game-list">
            {games.map((game) => (
              <li key={game.id} className="lobby__game-item">
                <span>Game {game.id.substring(0, 8)}...</span>
                <button onClick={() => handleJoin(game.id)} disabled={loading}>Join</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Join by Game ID</h3>
        <form onSubmit={handleJoinById} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Paste game ID here..."
            value={joinGameId}
            onChange={(e) => setJoinGameId(e.target.value)}
            style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.9rem' }}
          />
          <button type="submit" disabled={loading || !joinGameId.trim()}>Join</button>
        </form>
      </div>
    </div>
  );
}
