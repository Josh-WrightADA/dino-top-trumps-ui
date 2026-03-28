import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeaderboard } from '../../api/gameApi';
import useAuth from '../../hooks/useAuth';
import RankBadge from '../rank/RankBadge';
import Avatar from '../shared/Avatar';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorMessage from '../shared/ErrorMessage';
import Pagination from '../shared/Pagination';
import { formatWinRate } from '../../utils/formatWinRate';
import './Leaderboard.css';
import '../profile/Avatar.css';

const PAGE_SIZE = 10;

function getRowClassName(player, index, start, userId) {
  const classes = ['leaderboard-table__row'];
  if (player.userId === userId) classes.push('leaderboard-table__current-user');
  if (start + index < 3) classes.push(`leaderboard-table__row--top-${start + index + 1}`);
  return classes.join(' ');
}

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const { user } = useAuth();

  async function fetchLeaderboard() {
    setLoading(true);
    setError('');
    try {
      const res = await getLeaderboard();
      setPlayers(res.data);
    } catch {
      setError('Failed to load leaderboard.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const totalPages = Math.ceil(players.length / PAGE_SIZE);
  const start = page * PAGE_SIZE;
  const pageItems = players.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <h2 className="page-heading leaderboard__heading">Leaderboard</h2>
      {loading && <LoadingSpinner message="Loading leaderboard..." />}
      {error && <ErrorMessage message={error} onRetry={fetchLeaderboard} />}
      {!loading && !error && players.length === 0 && (
        <p>No players ranked yet.</p>
      )}
      {!loading && !error && players.length > 0 && (
        <>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th className="leaderboard-table__header">Rank</th>
                <th className="leaderboard-table__header">Player</th>
                <th className="leaderboard-table__header">Tier</th>
                <th className="leaderboard-table__header">LP</th>
                <th className="leaderboard-table__header">Played</th>
                <th className="leaderboard-table__header">Won</th>
                <th className="leaderboard-table__header">Win %</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((player, index) => (
                <tr
                  key={player.userId}
                  className={getRowClassName(player, index, start, user?.id)}
                >
                  <td className="leaderboard-table__cell">{start + index + 1}</td>
                  <td className="leaderboard-table__cell">
                    <Link
                      to={player.userId === user?.id ? '/profile' : `/player/${player.userId}`}
                      className="leaderboard-table__player-link"
                    >
                      {player.avatarUrl ? (
                        <img
                          src={player.avatarUrl}
                          alt=""
                          className="avatar avatar--medium leaderboard-table__avatar"
                        />
                      ) : (
                        <div className="avatar-placeholder avatar-placeholder--medium leaderboard-table__avatar-placeholder">
                          {(player.displayName || player.username || 'U').charAt(0)}
                        </div>
                      )}
                      {player.displayName || player.username}
                    </Link>
                  </td>
                  <td className="leaderboard-table__cell"><RankBadge tierKey={player.rankTier} /></td>
                  <td className="leaderboard-table__cell">{player.leaguePoints}</td>
                  <td className="leaderboard-table__cell">{player.gamesPlayed}</td>
                  <td className="leaderboard-table__cell">{player.gamesWon}</td>
                  <td className="leaderboard-table__cell">
                    {formatWinRate(player.gamesWon, player.gamesPlayed)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
