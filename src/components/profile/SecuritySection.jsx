import { useState } from 'react';
import { changePassword, deleteAccount } from '../../api/authApi';
import '../shared/Shared.css';
import '../../App.css';

export default function SecuritySection({ onLogout, onError, onSuccess, onNavigate }) {
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleChangePassword(e) {
    e.preventDefault();
    if (newPassword.length < 8) {
      onError('New password must be at least 8 characters.');
      return;
    }
    setSaving(true);
    onError('');
    onSuccess('');
    try {
      await changePassword(currentPassword, newPassword);
      setChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      onSuccess('Password changed successfully.');
    } catch (err) {
      onError(err.response?.data?.detail || err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (!window.confirm('Are you sure? This action cannot be undone.')) return;
    try {
      await deleteAccount();
      onLogout();
      onNavigate('/');
    } catch {
      onError('Failed to delete account.');
    }
  }

  return (
    <div className="profile__card">
      <h3 className="profile__security-heading">Security</h3>
      {changingPassword ? (
        <form className="profile__edit-form" onSubmit={handleChangePassword}>
          <label>
            Current Password
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          <label>
            New Password (at least 8 characters)
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>
          <div className="profile__button-row">
            <button type="submit" disabled={saving}>{saving ? 'Changing...' : 'Change Password'}</button>
            <button type="button" onClick={() => setChangingPassword(false)} className="btn--secondary">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="profile__button-row">
          <button onClick={() => setChangingPassword(true)}>Change Password</button>
          <button onClick={handleDeleteAccount} className="btn--danger">Delete Account</button>
        </div>
      )}
    </div>
  );
}
