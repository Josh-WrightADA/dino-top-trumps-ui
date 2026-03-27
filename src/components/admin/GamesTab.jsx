import { useState, useEffect } from 'react';
import { getAdminGames, deleteGame } from '../../api/adminApi';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorMessage from '../shared/ErrorMessage';

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
      setError(err.response?.data?.detail || 'Failed to load games.');
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
      setError(err.response?.data?.detail || 'Failed to delete game.');
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
                <th>Game ID</th>
                <th>Status</th>
                <th>Player 1</th>
                <th>Player 2</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.map((g) => (
                <tr key={g.id}>
                  <td><span className="admin-id">{g.id.slice(0, 8)}...</span></td>
                  <td>{g.status}</td>
                  <td><span className="admin-id">{g.player1Id?.slice(0, 8)}...</span></td>
                  <td><span className="admin-id">{g.player2Id ? `${g.player2Id.slice(0, 8)}...` : '—'}</span></td>
                  <td>{new Date(g.createdAt).toLocaleDateString()}</td>
                  <td>
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
