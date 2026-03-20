import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicProfile } from '../api/authApi';
import RankBadge from '../components/rank/RankBadge';
import '../components/game/Game.css';
import '../components/profile/Avatar.css';

export default function PlayerProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetch() {
      try {
        const res = await getPublicProfile(id);
        setProfile(res.data);
      } catch {
        setError('Player not found.');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id]);

  if (loading) return <div className="page"><p>Loading player profile...</p></div>;
  if (error) return <div className="page"><p style={{ color: '#c62828' }}>{error}</p></div>;

  const winRate = profile.gamesPlayed > 0
    ? `${Math.round((profile.gamesWon / profile.gamesPlayed) * 100)}%`
    : 'N/A';

  return (
    <div className="page">
      <div className="profile">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem', gap: '0.75rem' }}>
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
          <h2 style={{ margin: 0 }}>{profile.displayName || profile.username}</h2>
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
    </div>
  );
}
