import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMatchHistory } from '../../api/gameApi';
import useAuth from '../../hooks/useAuth';
import '../game/Game.css';

const PAGE_SIZE = 10;

export default function MatchHistory() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
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

  const totalPages = Math.ceil(matches.length / PAGE_SIZE);
  const start = page * PAGE_SIZE;
  const pageItems = matches.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>Match History</h2>
      {matches.length === 0 ? (
        <p>No matches played yet.</p>
      ) : (
        <>
          <ul className="match-list">
            {pageItems.map((match) => {
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
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination__btn"
                onClick={() => setPage(p => p - 1)}
                disabled={page === 0}
              >
                Previous
              </button>
              <span className="pagination__info">
                Page {page + 1} of {totalPages}
              </span>
              <button
                className="pagination__btn"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages - 1}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
