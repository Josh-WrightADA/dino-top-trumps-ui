// TODO: Build out leaderboard display in Phase 2

import { useState, useEffect } from 'react';
import { getLeaderboard } from '../../api/gameApi';

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await getLeaderboard();
        setPlayers(res.data);
      } catch {
        // TODO: handle error
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;

  return (
    <div>
      <h2>Leaderboard</h2>
      {players.length === 0 ? (
        <p>No players ranked yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>ELO</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={player.id || index}>
                <td>{index + 1}</td>
                <td>{player.username}</td>
                <td>{player.elo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
