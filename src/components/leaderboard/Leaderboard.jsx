import { useState, useEffect } from 'react';
import { getLeaderboard } from '../../api/gameApi';
import useAuth from '../../hooks/useAuth';
import '../game/Game.css';

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    async function fetch() {
      try {
        const res = await getLeaderboard();
        setPlayers(res.data);
      } catch {
        setError('Failed to load leaderboard.');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;
  if (error) return <p style={{ color: '#c62828' }}>{error}</p>;

  return (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>Leaderboard</h2>
      {players.length === 0 ? (
        <p>No players ranked yet.</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>ELO</th>
              <th>Played</th>
              <th>Won</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr
                key={player.userId}
                className={player.userId === user?.id ? 'leaderboard-table__current-user' : ''}
              >
                <td>{index + 1}</td>
                <td>{player.displayName || player.username}</td>
                <td>{player.eloRating}</td>
                <td>{player.gamesPlayed}</td>
                <td>{player.gamesWon}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
