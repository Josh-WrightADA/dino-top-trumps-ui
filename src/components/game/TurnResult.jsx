import './Game.css';

export default function TurnResult({ result, isPlayer1, userId, player1Card, player2Card, onDismiss }) {
  if (!result) return null;

  const yourScore = isPlayer1 ? result.player1StatValue : result.player2StatValue;
  const theirScore = isPlayer1 ? result.player2StatValue : result.player1StatValue;
  const isDraw = !result.winnerPlayerId;

  // Prefer server-authoritative winnerPlayerId when userId is available.
  // Falls back to score comparison only when userId is not provided (e.g. tests).
  const youWon = userId
    ? result.winnerPlayerId === userId
    : yourScore > theirScore;

  let outcomeClass = 'turn-result--draw';
  let outcomeText = 'Draw! Both keep their cards.';
  if (!isDraw) {
    if (youWon) {
      outcomeClass = 'turn-result--won';
      outcomeText = 'You won this round!';
    } else {
      outcomeClass = 'turn-result--lost';
      outcomeText = 'You lost this round.';
    }
  }

  const yourCard = isPlayer1 ? player1Card : player2Card;
  const theirCard = isPlayer1 ? player2Card : player1Card;

  return (
    <div className={`turn-result ${outcomeClass}`}>
      <div className="turn-result__stat">{result.chosenStat}</div>
      <div className="turn-result__cards">
        <div className="turn-result__card">
          {yourCard?.imageUrl && (
            <img src={yourCard.imageUrl} alt={yourCard.name} className="turn-result__card-image" />
          )}
          <span className="turn-result__card-name">{yourCard?.name || 'Unknown'}</span>
        </div>
        <span className="turn-result__vs">VS</span>
        <div className="turn-result__card">
          {theirCard?.imageUrl && (
            <img src={theirCard.imageUrl} alt={theirCard.name} className="turn-result__card-image" />
          )}
          <span className="turn-result__card-name">{theirCard?.name || 'Unknown'}</span>
        </div>
      </div>
      <div className="turn-result__comparison">
        <div className="turn-result__score">
          <div className="turn-result__score-label">You</div>
          <div className="turn-result__score-value">{yourScore}</div>
        </div>
        <div className="turn-result__vs">VS</div>
        <div className="turn-result__score">
          <div className="turn-result__score-label">Opponent</div>
          <div className="turn-result__score-value">{theirScore}</div>
        </div>
      </div>
      <div className="turn-result__outcome">{outcomeText}</div>
      <button className="turn-result__dismiss" onClick={onDismiss}>Continue</button>
    </div>
  );
}
