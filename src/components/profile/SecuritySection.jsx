import { useState } from 'react';
import { changePassword, deleteAccount } from '../../api/authApi';
import PasswordField from '../auth/PasswordField';
import { extractErrorMessage } from '../../utils/extractErrorMessage';
import '../auth/AuthForms.css';
import '../../App.css';
import '../../pages/Profile.css';

export default function SecuritySection({ onLogout, onError, onSuccess, onNavigate }) {
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      onSuccess('Password changed successfully.');
    } catch (err) {
      onError(extractErrorMessage(err, 'Failed to change password.'));
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
          <PasswordField
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />
          <PasswordField
            label="New Password (at least 8 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
          <PasswordField
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          <div className="profile__button-row">
            <button className="btn" type="submit" disabled={saving}>{saving ? 'Changing...' : 'Change Password'}</button>
            <button type="button" onClick={() => {
              setChangingPassword(false);
            }} className="btn btn--secondary">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="profile__button-row">
          <button className="btn" onClick={() => setChangingPassword(true)}>Change Password</button>
          {!showDeleteConfirm && (
            <button onClick={() => setShowDeleteConfirm(true)} className="btn btn--danger">Delete Account</button>
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
            <button onClick={handleDeleteAccount} className="btn btn--danger" disabled={!deletePassword}>
              Confirm Delete
            </button>
            <button onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); }} className="btn btn--secondary">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
