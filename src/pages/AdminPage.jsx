import { useState, useEffect } from 'react';
import {
  getUsers, banUser, unbanUser,
  getAdminGames, deleteGame,
  getReports, dismissReport,
} from '../api/adminApi';
import RankBadge from '../components/rank/RankBadge';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import '../components/shared/Shared.css';
import './Admin.css';

const TABS = ['Users', 'Games', 'Reports'];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('Users');

  return (
    <div className="page">
      <h1 className="page-heading admin-page__title">Admin Panel</h1>
      <div className="admin-page__tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`admin-page__tab${activeTab === tab ? ' admin-page__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Users' && <UsersTab />}
      {activeTab === 'Games' && <GamesTab />}
      {activeTab === 'Reports' && <ReportsTab />}
    </div>
  );
}

function UsersTab() {
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
                    <span className={u.role === 'ADMIN' ? 'admin-role--admin' : 'admin-role--user'}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={u.status === 'ACTIVE' ? 'admin-status--active' : 'admin-status--banned'}>
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

function GamesTab() {
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

function ReportsTab() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchReports() {
    setLoading(true);
    setError('');
    try {
      const res = await getReports();
      setReports(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load reports.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchReports(); }, []);

  async function handleDismiss(reportId) {
    if (!window.confirm('Are you sure you want to dismiss this report?')) return;
    try {
      const res = await dismissReport(reportId);
      setReports((prev) => prev.map((r) => (r.id === reportId ? res.data : r)));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to dismiss report.');
    }
  }

  if (loading) return <LoadingSpinner message="Loading reports..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchReports} />;

  return (
    <div>
      {reports.length === 0 ? (
        <p className="admin-empty">No reports found.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reporter</th>
                <th>Reported User</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td><span className="admin-id">{r.reporterId.slice(0, 8)}...</span></td>
                  <td><span className="admin-id">{r.reportedUserId.slice(0, 8)}...</span></td>
                  <td><span className="admin-reason" title={r.reason}>{r.reason}</span></td>
                  <td>
                    <span className={r.status === 'PENDING' ? 'admin-status--pending' : 'admin-status--dismissed'}>
                      {r.status}
                    </span>
                  </td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td>
                    {r.status === 'PENDING' && (
                      <button className="btn btn--secondary btn--small" onClick={() => handleDismiss(r.id)}>
                        Dismiss
                      </button>
                    )}
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
