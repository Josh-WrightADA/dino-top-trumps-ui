import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api/authApi';
import '../components/game/Game.css';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
    try {
      const res = await updateProfile({ displayName });
      setProfile(res.data);
      setEditing(false);
    } catch {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="page"><p>Loading profile...</p></div>;
  if (error && !profile) return <div className="page"><p style={{ color: '#c62828' }}>{error}</p></div>;

  return (
    <div className="page">
      <div className="profile">
        <h2 style={{ marginBottom: '1rem' }}>Profile</h2>

        {error && <p style={{ color: '#c62828', background: '#fdecea', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</p>}

        {profile ? (
          <>
            <div className="profile__card">
              <div className="profile__stats">
                <div>
                  <div className="profile__stat-label">ELO Rating</div>
                  <div className="profile__stat-value">{profile.eloRating}</div>
                </div>
                <div>
                  <div className="profile__stat-label">Games Played</div>
                  <div className="profile__stat-value">{profile.gamesPlayed}</div>
                </div>
                <div>
                  <div className="profile__stat-label">Games Won</div>
                  <div className="profile__stat-value">{profile.gamesWon}</div>
                </div>
                <div>
                  <div className="profile__stat-label">Win Rate</div>
                  <div className="profile__stat-value">
                    {profile.gamesPlayed > 0
                      ? `${Math.round((profile.gamesWon / profile.gamesPlayed) * 100)}%`
                      : 'N/A'}
                  </div>
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
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" disabled={saving}>
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      style={{ background: 'transparent', color: '#2d6a4f', border: '2px solid #2d6a4f' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button onClick={() => setEditing(true)}>Edit Display Name</button>
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
