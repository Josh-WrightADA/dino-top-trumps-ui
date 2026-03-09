import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame, getAvailableGames, joinGame } from '../../api/gameApi';

export default function GameLobby() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function fetchGames() {
    try {
      const res = await getAvailableGames();
      setGames(res.data);
    } catch (err) {
      setError('Failed to load games.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGames();
  }, []);

  async function handleCreate() {
    try {
      const res = await createGame();
      navigate(`/game/${res.data.id}`);
    } catch (err) {
      setError('Failed to create game.');
    }
  }

  async function handleJoin(gameId) {
    try {
      await joinGame(gameId);
      navigate(`/game/${gameId}`);
    } catch (err) {
      setError('Failed to join game.');
    }
  }

  return (
    <div>
      <h2>Game Lobby</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleCreate}>Create New Game</button>
      <h3>Available Games</h3>
      {loading ? (
        <p>Loading...</p>
      ) : games.length === 0 ? (
        <p>No games available. Create one!</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              Game #{game.id} - {game.status}
              <button onClick={() => handleJoin(game.id)}>Join</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
