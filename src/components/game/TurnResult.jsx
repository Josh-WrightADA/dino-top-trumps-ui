import { useState, useEffect } from 'react';
import './TurnResult.css';

export default function TurnResult({ result, isPlayer1, userId, player1Card, player2Card, onDismiss }) {
  const [yourImgError, setYourImgError] = useState(false);
  const [theirImgError, setTheirImgError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 8000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!result) return null;

  const yourScore = isPlayer1 ? result.player1StatValue : result.player2StatValue;
  const theirScore = isPlayer1 ? result.player2StatValue : result.player1StatValue;
  const isDraw = !result.winnerPlayerId;

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
      <div className="turn-result__stat-heading">{result.chosenStat}</div>
      <div className="turn-result__cards">
        <div className="turn-result__card">
          {yourCard?.imageUrl && !yourImgError && (
            <img
              src={yourCard.imageUrl}
              alt={yourCard.name}
              className="turn-result__card-image"
              onError={() => setYourImgError(true)}
            />
          )}
          <span className="turn-result__card-name">{yourCard?.name || 'Unknown'}</span>
          <span className="turn-result__card-score">{yourScore}</span>
        </div>
        <span className="turn-result__vs">VS</span>
        <div className="turn-result__card">
          {theirCard?.imageUrl && !theirImgError && (
            <img
              src={theirCard.imageUrl}
              alt={theirCard.name}
              className="turn-result__card-image"
              onError={() => setTheirImgError(true)}
            />
          )}
          <span className="turn-result__card-name">{theirCard?.name || 'Unknown'}</span>
          <span className="turn-result__card-score">{theirScore}</span>
        </div>
      </div>
      <div className="turn-result__outcome" role="alert">{outcomeText}</div>
      <button className="turn-result__dismiss" onClick={onDismiss}>Continue</button>
      <div className="turn-result__auto-dismiss-bar" />
    </div>
  );
}
