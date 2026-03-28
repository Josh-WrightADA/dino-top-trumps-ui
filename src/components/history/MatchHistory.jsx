import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMatchHistory } from '../../api/gameApi';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorMessage from '../shared/ErrorMessage';
import Pagination from '../shared/Pagination';
import './MatchHistory.css';

const PAGE_SIZE = 10;

export default function MatchHistory() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const { user } = useAuth();

  async function fetchHistory() {
    setLoading(true);
    setError('');
    try {
      const res = await getMatchHistory();
      setMatches(res.data);
    } catch {
      setError('Failed to load match history.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  const totalPages = Math.ceil(matches.length / PAGE_SIZE);
  const start = page * PAGE_SIZE;
  const pageItems = matches.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <h2 className="page-heading match-history__heading">Match History</h2>
      {loading && <LoadingSpinner message="Loading history..." />}
      {error && <ErrorMessage message={error} onRetry={fetchHistory} />}
      {!loading && !error && matches.length === 0 && (
        <p>No matches played yet.</p>
      )}
      {!loading && !error && matches.length > 0 && (
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
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
