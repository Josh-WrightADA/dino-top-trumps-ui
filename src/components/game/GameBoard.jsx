// TODO: Build out full game board UI in Phase 2
// Will display current cards, allow stat selection, show results

import { useParams } from 'react-router-dom';
import usePolling from '../../hooks/usePolling';
import { getGameState } from '../../api/gameApi';

export default function GameBoard() {
  const { id } = useParams();
  const { data: game, loading, error } = usePolling(() => getGameState(id), 3000);

  if (loading) return <p>Loading game...</p>;
  if (error) return <p>Error loading game.</p>;

  return (
    <div>
      <h2>Game #{id}</h2>
      <p>Status: {game?.status}</p>
      {/* TODO: Render DinoCard, StatSelector, TurnResult based on game state */}
      <pre>{JSON.stringify(game, null, 2)}</pre>
    </div>
  );
}
