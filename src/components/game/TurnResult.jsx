import './Game.css';

export default function TurnResult({ result, isPlayer1, userId, onDismiss }) {
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

  return (
    <div className={`turn-result ${outcomeClass}`}>
      <div className="turn-result__stat">{result.chosenStat}</div>
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
