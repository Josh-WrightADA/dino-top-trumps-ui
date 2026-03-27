import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeaderboard } from '../../api/gameApi';
import useAuth from '../../hooks/useAuth';
import RankBadge from '../rank/RankBadge';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorMessage from '../shared/ErrorMessage';
import Pagination from '../shared/Pagination';
import { formatWinRate } from '../../utils/formatWinRate';
import '../game/Game.css';
import '../profile/Avatar.css';

const PAGE_SIZE = 10;

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

  return (
    <div>
      <h2 className="page-heading leaderboard__heading">Leaderboard</h2>
      {loading && <LoadingSpinner message="Loading leaderboard..." />}
      {error && <ErrorMessage message={error} onRetry={fetchLeaderboard} />}
      {!loading && !error && players.length === 0 && (
        <p>No players ranked yet.</p>
      )}
      {!loading && !error && players.length > 0 && (() => {
        const totalPages = Math.ceil(players.length / PAGE_SIZE);
        const start = page * PAGE_SIZE;
        const pageItems = players.slice(start, start + PAGE_SIZE);
        return (
          <>
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Tier</th>
                  <th>LP</th>
                  <th>Played</th>
                  <th>Won</th>
                  <th>Win %</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((player, index) => (
                  <tr
                    key={player.userId}
                    className={player.userId === user?.id ? 'leaderboard-table__current-user' : ''}
                  >
                    <td>{start + index + 1}</td>
                    <td>
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
                    <td><RankBadge tierKey={player.rankTier} /></td>
                    <td>{player.leaguePoints}</td>
                    <td>{player.gamesPlayed}</td>
                    <td>{player.gamesWon}</td>
                    <td>
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
        );
      })()}
    </div>
  );
}
