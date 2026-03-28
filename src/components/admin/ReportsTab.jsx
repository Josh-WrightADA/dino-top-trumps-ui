import { useState, useEffect } from 'react';
import { getReports, dismissReport } from '../../api/adminApi';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorMessage from '../shared/ErrorMessage';
import { extractErrorMessage } from '../../utils/extractErrorMessage';

export default function ReportsTab() {
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
      setError(extractErrorMessage(err, 'Failed to load reports.'));
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
      setError(extractErrorMessage(err, 'Failed to dismiss report.'));
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
                <th className="admin-table__header">Reporter</th>
                <th className="admin-table__header">Reported User</th>
                <th className="admin-table__header">Reason</th>
                <th className="admin-table__header">Status</th>
                <th className="admin-table__header">Created At</th>
                <th className="admin-table__header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td className="admin-table__cell"><span className="admin-id">{r.reporterId.slice(0, 8)}...</span></td>
                  <td className="admin-table__cell"><span className="admin-id">{r.reportedUserId.slice(0, 8)}...</span></td>
                  <td className="admin-table__cell"><span className="admin-reason" title={r.reason}>{r.reason}</span></td>
                  <td className="admin-table__cell">
                    <span className={`admin-status ${r.status === 'PENDING' ? 'admin-status--pending' : 'admin-status--dismissed'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="admin-table__cell">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="admin-table__cell">
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
