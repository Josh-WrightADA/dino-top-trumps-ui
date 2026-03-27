import { useState } from 'react';
import { updateProfile } from '../../api/authApi';
import '../shared/Shared.css';
import '../../App.css';
import '../../pages/Profile.css';

export default function ProfileInfoSection({ profile, onProfileUpdated, onError, onSuccess }) {
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile.displayName || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [saving, setSaving] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    onError('');
    onSuccess('');
    try {
      const res = await updateProfile({ displayName, bio });
      onProfileUpdated(res.data);
      setEditing(false);
      onSuccess('Profile updated.');
    } catch (err) {
      onError(err.response?.data?.detail || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="profile__card">
      <div className="profile__info">
        <p className="profile__info-text"><strong>Username:</strong> {profile.username}</p>
        <p className="profile__info-text"><strong>Display Name:</strong> {profile.displayName || profile.username}</p>
        {profile.bio && <p className="profile__info-text"><strong>Bio:</strong> {profile.bio}</p>}
        {profile.role === 'ADMIN' && (
          <span className="profile__admin-badge">Admin</span>
        )}
      </div>

      {editing ? (
        <form className="profile__edit-form" onSubmit={handleSave}>
          <label className="profile__edit-label">
            Display Name
            <input
              className="profile__edit-input"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </label>
          <label className="profile__edit-label">
            Bio
            <textarea
              className="profile__bio-input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Tell us about yourself..."
            />
          </label>
          <div className="profile__button-row">
            <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={() => setEditing(false)} className="btn--secondary">Cancel</button>
          </div>
        </form>
      ) : (
        <button className="btn" onClick={() => setEditing(true)}>Edit Profile</button>
      )}
    </div>
  );
}
