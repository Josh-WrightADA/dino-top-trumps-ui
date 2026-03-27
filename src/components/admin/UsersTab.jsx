import { useState, useEffect } from 'react';
import { getUsers, banUser, unbanUser } from '../../api/adminApi';
import RankBadge from '../rank/RankBadge';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorMessage from '../shared/ErrorMessage';

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchUsers() {
    setLoading(true);
    setError('');
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchUsers(); }, []);

  async function handleBan(userId) {
    if (!window.confirm('Are you sure you want to ban this user?')) return;
    try {
      const res = await banUser(userId);
      setUsers((prev) => prev.map((u) => (u.id === userId ? res.data : u)));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to ban user.');
    }
  }

  async function handleUnban(userId) {
    try {
      const res = await unbanUser(userId);
      setUsers((prev) => prev.map((u) => (u.id === userId ? res.data : u)));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to unban user.');
    }
  }

  if (loading) return <LoadingSpinner message="Loading users..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchUsers} />;

  return (
    <div>
      {users.length === 0 ? (
        <p className="admin-empty">No users found.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Display Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>LP</th>
                <th>Rank</th>
                <th>Games Played</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.displayName || '—'}</td>
                  <td>
                    <span className={`admin-role ${u.role === 'ADMIN' ? 'admin-role--admin' : 'admin-role--user'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-status ${u.status === 'ACTIVE' ? 'admin-status--active' : 'admin-status--banned'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>{u.leaguePoints}</td>
                  <td><RankBadge tierKey={u.rankTier} size="small" /></td>
                  <td>{u.gamesPlayed}</td>
                  <td>
                    <div className="admin-table__actions">
                      {u.role !== 'ADMIN' && (
                        u.status === 'ACTIVE' ? (
                          <button className="btn btn--danger btn--small" onClick={() => handleBan(u.id)}>
                            Ban
                          </button>
                        ) : (
                          <button className="btn btn--secondary btn--small" onClick={() => handleUnban(u.id)}>
                            Unban
                          </button>
                        )
                      )}
                    </div>
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
