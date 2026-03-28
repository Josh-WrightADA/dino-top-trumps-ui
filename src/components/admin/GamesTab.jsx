import { useState, useEffect } from 'react';
import { getAdminGames, deleteGame } from '../../api/adminApi';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorMessage from '../shared/ErrorMessage';
import { extractErrorMessage } from '../../utils/extractErrorMessage';

export default function GamesTab() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchGames() {
    setLoading(true);
    setError('');
    try {
      const res = await getAdminGames();
      setGames(res.data);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to load games.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchGames(); }, []);

  async function handleDelete(gameId) {
    if (!window.confirm('Delete this game? This cannot be undone.')) return;
    try {
      await deleteGame(gameId);
      setGames((prev) => prev.filter((g) => g.id !== gameId));
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to delete game.'));
    }
  }

  if (loading) return <LoadingSpinner message="Loading games..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchGames} />;

  return (
    <div>
      {games.length === 0 ? (
        <p className="admin-empty">No games found.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-table__header">Game ID</th>
                <th className="admin-table__header">Status</th>
                <th className="admin-table__header">Player 1</th>
                <th className="admin-table__header">Player 2</th>
                <th className="admin-table__header">Created At</th>
                <th className="admin-table__header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.map((g) => (
                <tr key={g.id}>
                  <td className="admin-table__cell"><span className="admin-id">{g.id.slice(0, 8)}...</span></td>
                  <td className="admin-table__cell">{g.status}</td>
                  <td className="admin-table__cell"><span className="admin-id">{g.player1Id?.slice(0, 8)}...</span></td>
                  <td className="admin-table__cell"><span className="admin-id">{g.player2Id ? `${g.player2Id.slice(0, 8)}...` : '—'}</span></td>
                  <td className="admin-table__cell">{new Date(g.createdAt).toLocaleDateString()}</td>
                  <td className="admin-table__cell">
                    <button className="btn btn--danger btn--small" onClick={() => handleDelete(g.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
