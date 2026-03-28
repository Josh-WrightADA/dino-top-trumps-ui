import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, uploadAvatar } from '../api/authApi';
import useAuth from '../hooks/useAuth';
import AvatarSection from '../components/profile/AvatarSection';
import ProfileInfoSection from '../components/profile/ProfileInfoSection';
import SecuritySection from '../components/profile/SecuritySection';
import AvatarPicker from '../components/profile/AvatarPicker';
import PlayerStatsCard from '../components/profile/PlayerStatsCard';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import '../components/profile/Profile.css';
import '../components/profile/Avatar.css';
import { formatWinRate } from '../utils/formatWinRate';
import '../App.css';
import './Profile.css';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const { logout, refreshProfile } = useAuth();
  const navigate = useNavigate();

  async function fetchProfile() {
    setLoading(true);
    setError('');
    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch {
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  async function handleAvatarFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPEG, PNG, or WebP images are allowed.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be smaller than 2MB.');
      return;
    }

    setUploadingAvatar(true);
    setError('');
    setSuccess('');
    try {
      const res = await uploadAvatar(file);
      setProfile((prev) => ({ ...prev, avatarUrl: res.data.avatarUrl }));
      setSuccess('Avatar updated.');
      refreshProfile();
    } catch {
      setError('Failed to upload avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  }

  function handleDinoAvatarSelected(avatarUrl) {
    setProfile((prev) => ({ ...prev, avatarUrl }));
    setShowAvatarPicker(false);
    refreshProfile();
    setSuccess('Avatar updated.');
  }

  const winRate = formatWinRate(profile?.gamesWon, profile?.gamesPlayed);

  return (
    <div className="page">
      <div className="profile">
        <h2 className="page-heading profile__heading">Profile</h2>

        {error && profile && <p className="profile__alert--error" role="alert">{error}</p>}
        {success && <p className="profile__alert--success" role="status">{success}</p>}

        {loading && <LoadingSpinner message="Loading profile..." />}

        {!loading && error && !profile && (
          <ErrorMessage message={error} onRetry={fetchProfile} />
        )}

        {!loading && profile && (
          <>
            <AvatarSection
              profile={profile}
              uploadingAvatar={uploadingAvatar}
              onFileChange={handleAvatarFileChange}
              onPickerOpen={() => setShowAvatarPicker(true)}
            />

            <PlayerStatsCard stats={[
              { label: 'League Points', value: profile.leaguePoints != null ? profile.leaguePoints : profile.eloRating },
              { label: 'Rank', value: profile.rankTier },
              { label: 'Games Won', value: profile.gamesWon },
              { label: 'Win Rate', value: winRate },
            ]} />

            <ProfileInfoSection
              profile={profile}
              onProfileUpdated={(updated) => setProfile(updated)}
              onError={setError}
              onSuccess={setSuccess}
            />

            <SecuritySection
              onLogout={logout}
              onError={setError}
              onSuccess={setSuccess}
              onNavigate={navigate}
            />
          </>
        )}
      </div>

      {showAvatarPicker && (
        <AvatarPicker
          onClose={() => setShowAvatarPicker(false)}
          onSelect={handleDinoAvatarSelected}
        />
      )}
    </div>
  );
}
