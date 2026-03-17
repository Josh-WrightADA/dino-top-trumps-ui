import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame, joinGame } from '../../api/gameApi';
import '../game/Game.css';

export default function GameLobby() {
  const [joinGameId, setJoinGameId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  async function handleJoin(e) {
    e.preventDefault();
    if (!joinGameId.trim()) return;
    setLoading(true);
    setError('');
    try {
      await joinGame(joinGameId.trim());
      navigate(`/game/${joinGameId.trim()}`);
    } catch {
      setError('Failed to join game. Check the game ID.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lobby">
      <div className="lobby__header">
        <h2>Game Lobby</h2>
      </div>

      {error && <p style={{ color: '#c62828', background: '#fdecea', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</p>}

      <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Create a New Game</h3>
        <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>Start a game and share the ID with a friend to play.</p>
        <button onClick={handleCreate} disabled={loading}>
          {loading ? 'Creating...' : 'Create Game'}
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Join a Game</h3>
        <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>Enter a game ID from a friend to join their game.</p>
        <form onSubmit={handleJoin} style={{ display: 'flex', gap: '0.5rem' }}>
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
