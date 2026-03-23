import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicProfile } from '../api/authApi';
import RankBadge from '../components/rank/RankBadge';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import '../components/game/Game.css';
import '../components/profile/Avatar.css';
import '../App.css';

export default function PlayerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getPublicProfile(id);
      setProfile(res.data);
    } catch {
      setError('Player not found.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const winRate = profile && profile.gamesPlayed > 0
    ? `${Math.round((profile.gamesWon / profile.gamesPlayed) * 100)}%`
    : 'N/A';

  return (
    <div className="page">
      <button className="btn--secondary player-profile__back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      {loading && <LoadingSpinner message="Loading player profile..." />}
      {error && <ErrorMessage message={error} onRetry={fetchProfile} />}

      {!loading && !error && profile && (
        <div className="profile">
          <div className="player-profile__header">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={`${profile.displayName || profile.username}'s avatar`}
                className="avatar avatar--large"
              />
            ) : (
              <div className="avatar-placeholder avatar-placeholder--large">
                {(profile.displayName || profile.username || 'U').charAt(0)}
              </div>
            )}
            <h2 className="player-profile__name">{profile.displayName || profile.username}</h2>
          </div>

          <div className="profile__card">
            <div className="profile__stats">
              <div>
                <div className="profile__stat-label">ELO Rating</div>
                <div className="profile__stat-value">{profile.eloRating}</div>
              </div>
              <div>
                <div className="profile__stat-label">Rank</div>
                <div className="profile__stat-value"><RankBadge tierKey={profile.rankTier} size="medium" /></div>
              </div>
              <div>
                <div className="profile__stat-label">Games Played</div>
                <div className="profile__stat-value">{profile.gamesPlayed}</div>
              </div>
              <div>
                <div className="profile__stat-label">Win Rate</div>
                <div className="profile__stat-value">{winRate}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
