import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api/authApi';
import useAuth from '../hooks/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await getProfile();
        setProfile(res.data);
      } catch {
        // TODO: handle error
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading) return <div className="page"><p>Loading profile...</p></div>;

  return (
    <div className="page">
      <h2>Profile</h2>
      {profile ? (
        <div>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>ELO:</strong> {profile.elo}</p>
          {/* TODO: Add edit profile form */}
        </div>
      ) : (
        <p>Could not load profile.</p>
      )}
    </div>
  );
}
