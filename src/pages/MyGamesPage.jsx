import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getActiveGames } from '../api/gameApi';

export default function MyGamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetch() {
      try {
        const res = await getActiveGames();
        setGames(res.data);
      } catch {
        setError('Failed to load your games.');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading) return <div className="page"><p>Loading your games...</p></div>;
  if (error) return <div className="page"><p style={{ color: '#c62828' }}>{error}</p></div>;

  return (
    <div className="page">
      <h2 style={{ marginBottom: '1rem' }}>My Games</h2>
      {games.length === 0 ? (
        <p>No active games. <Link to="/lobby">Create or join one.</Link></p>
      ) : (
        <ul className="match-list">
          {games.map((game) => (
            <li key={game.id} className="match-item">
              <span>Game {game.id.substring(0, 8)}...</span>
              <span className={`match-item__result ${game.status === 'WAITING' ? 'match-item__result--won' : 'match-item__result--lost'}`}>
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
