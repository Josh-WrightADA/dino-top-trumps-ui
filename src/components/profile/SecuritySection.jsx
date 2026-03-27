import { useState } from 'react';
import { changePassword, deleteAccount } from '../../api/authApi';
import '../auth/AuthForms.css';
import '../shared/Shared.css';
import '../../App.css';
import '../../pages/Profile.css';

export default function SecuritySection({ onLogout, onError, onSuccess, onNavigate }) {
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  async function handleChangePassword(e) {
    e.preventDefault();
    if (newPassword.length < 8) {
      onError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      onError('Passwords do not match.');
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
      setConfirmPassword('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      onSuccess('Password changed successfully.');
    } catch (err) {
      onError(err.response?.data?.detail || err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    try {
      await deleteAccount(deletePassword);
      onLogout();
      onNavigate('/');
    } catch {
      onError('Failed to delete account. Check your password and try again.');
    }
  }

  return (
    <div className="profile__card">
      <h3 className="section-heading profile__security-heading">Security</h3>
      {changingPassword ? (
        <form className="profile__edit-form" onSubmit={handleChangePassword}>
          <label>
            Current Password
            <div className="auth-form__password-field">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-form__toggle-password"
                onClick={() => setShowCurrentPassword(prev => !prev)}
                aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
              >
                {showCurrentPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>
          <label>
            New Password (at least 8 characters)
            <div className="auth-form__password-field">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-form__toggle-password"
                onClick={() => setShowNewPassword(prev => !prev)}
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>
          <label>
            Confirm New Password
            <div className="auth-form__password-field">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-form__toggle-password"
                onClick={() => setShowConfirmPassword(prev => !prev)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>
          <div className="profile__button-row">
            <button className="btn" type="submit" disabled={saving}>{saving ? 'Changing...' : 'Change Password'}</button>
            <button type="button" onClick={() => {
              setChangingPassword(false);
              setShowCurrentPassword(false);
              setShowNewPassword(false);
              setShowConfirmPassword(false);
            }} className="btn--secondary">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="profile__button-row">
          <button className="btn" onClick={() => setChangingPassword(true)}>Change Password</button>
          {!showDeleteConfirm && (
            <button onClick={() => setShowDeleteConfirm(true)} className="btn--danger">Delete Account</button>
          )}
        </div>
      )}
      {showDeleteConfirm && (
        <div className="profile__delete-confirm">
          <p className="profile__delete-warning">This action cannot be undone. Enter your password to confirm.</p>
          <input
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            placeholder="Enter your password"
            className="profile__delete-input"
            aria-label="Password for account deletion"
          />
          <div className="profile__button-row">
            <button onClick={handleDeleteAccount} className="btn--danger" disabled={!deletePassword}>
              Confirm Delete
            </button>
            <button onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); }} className="btn--secondary">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
