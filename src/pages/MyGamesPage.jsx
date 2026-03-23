import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getActiveGames } from '../api/gameApi';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import '../components/game/Game.css';
import '../App.css';

export default function MyGamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchGames() {
    setLoading(true);
    setError('');
    try {
      const res = await getActiveGames();
      setGames(res.data);
    } catch {
      setError('Failed to load your games.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGames();
  }, []);

  function getStatusClass(status) {
    if (status === 'WAITING') return 'match-item__result--pending';
    if (status === 'IN_PROGRESS') return 'match-item__result--won';
    return 'match-item__result--lost';
  }

  return (
    <div className="page">
      <h2 className="my-games__heading">My Games</h2>
      {loading && <LoadingSpinner message="Loading your games..." />}
      {error && <ErrorMessage message={error} onRetry={fetchGames} />}
      {!loading && !error && games.length === 0 && (
        <p>No active games. <Link to="/lobby">Create or join one.</Link></p>
      )}
      {!loading && !error && games.length > 0 && (
        <ul className="match-list">
          {games.map((game) => (
            <li key={game.id} className="match-item">
              <span>Game {game.id.substring(0, 8)}...</span>
              <span className={`match-item__result ${getStatusClass(game.status)}`}>
                {game.status}
              </span>
              <Link to={`/game/${game.id}`}><button>Resume</button></Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
