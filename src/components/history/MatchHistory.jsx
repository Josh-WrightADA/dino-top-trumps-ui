// TODO: Build out match history list in Phase 2

import { useState, useEffect } from 'react';
import { getMatchHistory } from '../../api/gameApi';

export default function MatchHistory() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await getMatchHistory();
        setMatches(res.data);
      } catch {
        // TODO: handle error
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading) return <p>Loading history...</p>;

  return (
    <div>
      <h2>Match History</h2>
      {matches.length === 0 ? (
        <p>No matches played yet.</p>
      ) : (
        <ul>
          {matches.map((match) => (
            <li key={match.id}>
              Game #{match.id} - {match.result || match.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
