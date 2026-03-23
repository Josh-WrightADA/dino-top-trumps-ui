import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createGame } from '../../api/gameApi';
import { getProfile } from '../../api/authApi';
import RankBadge from '../rank/RankBadge';
import '../shared/Shared.css';
import './Game.css';

export default function GameOver({ game, userId }) {
  const navigate = useNavigate();
  const [rematchLoading, setRematchLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getProfile();
        setProfile(res.data);
      } catch {
        // Non-critical — ELO just won't display
      }
    }
    fetchProfile();
  }, []);

  if (!game) return null;

  const youWon = game.winnerId === userId;
  const p1Cards = game.player1HandSize;
  const p2Cards = game.player2HandSize;

  function getGameOverMessage(gameState, isWinner) {
    const reason = gameState.gameEndReason;
    if (reason === 'TIMEOUT') {
      return isWinner ? 'Your opponent ran out of time!' : 'You ran out of time!';
    }
    if (reason === 'FORFEIT') {
      return isWinner ? 'Your opponent forfeited!' : 'You forfeited the game.';
    }
    // NORMAL or null (backward compat)
    return isWinner ? 'You collected all the cards!' : 'Your opponent collected all the cards.';
  }

  async function handleRematch() {
    setRematchLoading(true);
    try {
      const res = await createGame();
      navigate(`/game/${res.data.id}`);
    } catch {
      navigate('/lobby');
    }
  }

  return (
    <div className="game-over">
      <div className="game-over__trophy">{youWon ? 'VICTORY' : 'DEFEAT'}</div>
      <h2 className={`game-over__title ${youWon ? 'game-over__title--won' : 'game-over__title--lost'}`}>
        {youWon ? 'Victory!' : 'Defeat'}
      </h2>
      <p className="game-over__subtitle">
        {getGameOverMessage(game, youWon)}
      </p>

      <div className="game-over__stats">
        <div className="game-over__stat">
          <div className="game-over__stat-label">Your Cards</div>
          <div className="game-over__stat-value">
            {game.isPlayer1 ? p1Cards : p2Cards}
          </div>
        </div>
        <div className="game-over__stat">
          <div className="game-over__stat-label">Opponent Cards</div>
          <div className="game-over__stat-value">
            {game.isPlayer1 ? p2Cards : p1Cards}
          </div>
        </div>
        {profile && (
          <>
            <div className="game-over__stat">
              <div className="game-over__stat-label">League Points</div>
              <div className="game-over__stat-value">{profile.leaguePoints}</div>
            </div>
            <div className="game-over__stat">
              <div className="game-over__stat-label">Rank</div>
              <div className="game-over__stat-value">
                <RankBadge tierKey={profile.rankTier} />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="game-over__actions">
        <button onClick={handleRematch} disabled={rematchLoading}>
          {rematchLoading ? 'Creating...' : 'New Game'}
        </button>
        <Link to="/lobby"><button className="btn--secondary">Lobby</button></Link>
        <Link to="/leaderboard"><button className="btn--secondary">Leaderboard</button></Link>
      </div>
    </div>
  );
}
