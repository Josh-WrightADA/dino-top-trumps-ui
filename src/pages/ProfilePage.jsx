import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, changePassword, deleteAccount } from '../api/authApi';
import useAuth from '../hooks/useAuth';
import '../components/game/Game.css';

const RANK_LABELS = {
  HATCHLING: 'Hatchling',
  HERBIVORE: 'Herbivore',
  CARNIVORE: 'Carnivore',
  APEX: 'Apex',
  METEOR: 'Meteor',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetch() {
      try {
        const res = await getProfile();
        setProfile(res.data);
        setDisplayName(res.data.displayName || '');
      } catch {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await updateProfile({ displayName });
      setProfile(res.data);
      setEditing(false);
      setSuccess('Display name updated.');
    } catch {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await changePassword(currentPassword, newPassword);
      setChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setSuccess('Password changed successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (!window.confirm('Are you sure? This action cannot be undone.')) return;
    try {
      await deleteAccount();
      logout();
      navigate('/');
    } catch {
      setError('Failed to delete account.');
    }
  }

  if (loading) return <div className="page"><p>Loading profile...</p></div>;
  if (error && !profile) return <div className="page"><p style={{ color: '#c62828' }}>{error}</p></div>;

  const winRate = profile?.gamesPlayed > 0
    ? `${Math.round((profile.gamesWon / profile.gamesPlayed) * 100)}%`
    : 'N/A';

  return (
    <div className="page">
      <div className="profile">
        <h2 style={{ marginBottom: '1rem' }}>Profile</h2>

        {error && <p style={{ color: '#c62828', background: '#fdecea', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</p>}
        {success && <p style={{ color: '#2d6a4f', background: '#d8f3dc', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem' }}>{success}</p>}

        {profile ? (
          <>
            <div className="profile__card">
              <div className="profile__stats">
                <div>
                  <div className="profile__stat-label">ELO Rating</div>
                  <div className="profile__stat-value">{profile.eloRating}</div>
                </div>
                <div>
                  <div className="profile__stat-label">Rank</div>
                  <div className="profile__stat-value">{RANK_LABELS[profile.rankTier] || profile.rankTier}</div>
                </div>
                <div>
                  <div className="profile__stat-label">Games Won</div>
                  <div className="profile__stat-value">{profile.gamesWon}</div>
                </div>
                <div>
                  <div className="profile__stat-label">Win Rate</div>
                  <div className="profile__stat-value">{winRate}</div>
                </div>
              </div>
            </div>

            <div className="profile__card">
              <div className="profile__info">
                <p><strong>Username:</strong> {profile.username}</p>
                <p><strong>Display Name:</strong> {profile.displayName || profile.username}</p>
              </div>

              {editing ? (
                <form className="profile__edit-form" onSubmit={handleSave}>
                  <label>
                    Display Name
                    <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                    <button type="button" onClick={() => setEditing(false)} style={{ background: 'transparent', color: '#2d6a4f', border: '2px solid #2d6a4f' }}>Cancel</button>
                  </div>
                </form>
              ) : (
                <button onClick={() => setEditing(true)}>Edit Display Name</button>
              )}
            </div>

            <div className="profile__card">
              <h3 style={{ marginBottom: '0.75rem' }}>Security</h3>
              {changingPassword ? (
                <form className="profile__edit-form" onSubmit={handleChangePassword}>
                  <label>
                    Current Password
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" />
                  </label>
                  <label>
                    New Password
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" />
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" disabled={saving}>{saving ? 'Changing...' : 'Change Password'}</button>
                    <button type="button" onClick={() => setChangingPassword(false)} style={{ background: 'transparent', color: '#2d6a4f', border: '2px solid #2d6a4f' }}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setChangingPassword(true)}>Change Password</button>
                  <button onClick={handleDeleteAccount} style={{ background: '#c62828' }}>Delete Account</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <p>Could not load profile.</p>
        )}
      </div>
    </div>
  );
}
