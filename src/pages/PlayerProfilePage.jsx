import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicProfile } from '../api/authApi';
import { sendFriendRequest, reportUser } from '../api/socialApi';
import PlayerStatsCard from '../components/profile/PlayerStatsCard';
import Avatar from '../components/shared/Avatar';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import { extractErrorMessage } from '../utils/extractErrorMessage';
import { formatWinRate } from '../utils/formatWinRate';
import '../components/profile/Profile.css';
import '../components/profile/Avatar.css';
import './PlayerProfile.css';
import './Profile.css';

export default function PlayerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add Friend state
  const [friendSending, setFriendSending] = useState(false);
  const [friendMessage, setFriendMessage] = useState('');
  const [friendError, setFriendError] = useState('');

  // Report state
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSending, setReportSending] = useState(false);
  const [reportMessage, setReportMessage] = useState('');
  const [reportError, setReportError] = useState('');

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

  async function handleAddFriend() {
    setFriendSending(true);
    setFriendMessage('');
    setFriendError('');
    try {
      await sendFriendRequest(id);
      setFriendMessage('Friend request sent!');
    } catch (err) {
      setFriendError(extractErrorMessage(err, 'Failed to send friend request.'));
    } finally {
      setFriendSending(false);
    }
  }

  async function handleReport(e) {
    e.preventDefault();
    setReportSending(true);
    setReportMessage('');
    setReportError('');
    try {
      await reportUser(id, reportReason);
      setReportMessage('Report submitted. Thank you.');
      setReportReason('');
      setReportOpen(false);
    } catch (err) {
      setReportError(extractErrorMessage(err, 'Failed to submit report.'));
    } finally {
      setReportSending(false);
    }
  }

  const winRate = formatWinRate(profile?.gamesWon, profile?.gamesPlayed);

  return (
    <div className="page">
      <button className="btn btn--secondary player-profile__back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      {loading && <LoadingSpinner message="Loading player profile..." />}
      {error && <ErrorMessage message={error} onRetry={fetchProfile} />}

      {!loading && !error && profile && (
        <div className="profile">
          <div className="player-profile__header">
            <Avatar
              avatarUrl={profile.avatarUrl}
              name={profile.displayName || profile.username}
              size="large"
              className="avatar--glow"
            />
            <h2 className="player-profile__name">{profile.displayName || profile.username}</h2>
          </div>

          <PlayerStatsCard stats={[
            { label: 'League Points', value: profile.leaguePoints },
            { label: 'Rank', value: profile.rankTier },
            { label: 'Games Played', value: profile.gamesPlayed },
            { label: 'Win Rate', value: winRate },
          ]} />

          {/* Social actions */}
          <div className="player-profile__actions">
            <div className="player-profile__action-row">
              <button
                className="btn btn--primary btn--small"
                onClick={handleAddFriend}
                disabled={friendSending || !!friendMessage}
              >
                {friendSending ? 'Sending...' : 'Add Friend'}
              </button>
              <button
                className="btn btn--secondary btn--small"
                onClick={() => {
                  setReportOpen((prev) => !prev);
                  setReportError('');
                  setReportMessage('');
                }}
              >
                {reportOpen ? 'Cancel' : 'Report'}
              </button>
            </div>

            {friendMessage && (
              <p className="profile__alert--success" role="status">{friendMessage}</p>
            )}
            {friendError && (
              <p className="profile__alert--error" role="alert">{friendError}</p>
            )}
            {reportMessage && (
              <p className="profile__alert--success" role="status">{reportMessage}</p>
            )}

            {reportOpen && (
              <form className="player-profile__report-form" onSubmit={handleReport}>
                <label className="player-profile__report-label" htmlFor="report-reason">
                  Reason (min 5 characters)
                </label>
                <textarea
                  id="report-reason"
                  className="player-profile__report-textarea"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  rows={3}
                  minLength={5}
                  maxLength={500}
                  placeholder="Describe the issue..."
                  required
                />
                {reportError && (
                  <p className="profile__alert--error" role="alert">{reportError}</p>
                )}
                <button
                  type="submit"
                  className="btn btn--danger btn--small"
                  disabled={reportSending || reportReason.trim().length < 5}
                >
                  {reportSending ? 'Submitting...' : 'Submit Report'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
