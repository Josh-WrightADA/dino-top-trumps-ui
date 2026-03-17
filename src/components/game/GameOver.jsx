import { Link } from 'react-router-dom';
import './Game.css';

export default function GameOver({ game, userId }) {
  if (!game) return null;

  const youWon = game.winnerId === userId;
  const p1Cards = game.player1HandSize;
  const p2Cards = game.player2HandSize;

  return (
    <div className="game-over">
      <div className="game-over__trophy">{youWon ? 'VICTORY' : 'DEFEAT'}</div>
      <h2 className={`game-over__title ${youWon ? 'game-over__title--won' : 'game-over__title--lost'}`}>
        {youWon ? 'Victory!' : 'Defeat'}
      </h2>
      <p className="game-over__subtitle">
        {youWon ? 'You collected all the cards!' : 'Your opponent collected all the cards.'}
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
      </div>

      <div className="game-over__actions">
        <Link to="/lobby"><button>Play Again</button></Link>
        <Link to="/leaderboard"><button style={{ background: 'transparent', color: '#2d6a4f', border: '2px solid #2d6a4f' }}>Leaderboard</button></Link>
      </div>
    </div>
  );
}
