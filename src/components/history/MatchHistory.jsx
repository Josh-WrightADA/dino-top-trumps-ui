import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMatchHistory } from '../../api/gameApi';
import useAuth from '../../hooks/useAuth';
import '../game/Game.css';

export default function MatchHistory() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    async function fetch() {
      try {
        const res = await getMatchHistory();
        setMatches(res.data);
      } catch {
        setError('Failed to load match history.');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading) return <p>Loading history...</p>;
  if (error) return <p style={{ color: '#c62828' }}>{error}</p>;

  return (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>Match History</h2>
      {matches.length === 0 ? (
        <p>No matches played yet.</p>
      ) : (
        <ul className="match-list">
          {matches.map((match) => {
            const won = match.winnerId === user?.id;
            return (
              <li key={match.gameId} className="match-item">
                <Link to={`/player/${match.opponentId}`} className="match-item__opponent">
                  vs {match.opponentName ?? `${match.opponentId?.substring(0, 8)}...`}
                </Link>
                <span className="match-item__date">
                  {new Date(match.createdAt).toLocaleDateString()}
                </span>
                <span className={`match-item__result ${won ? 'match-item__result--won' : 'match-item__result--lost'}`}>
                  {won ? 'WIN' : 'LOSS'}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
