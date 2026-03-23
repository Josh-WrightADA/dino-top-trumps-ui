import { getRankTitle } from './quizLogic';

export default function QuizSummary({ totalScore, results, totalRounds, onRestart }) {
  const correctCount = results.filter((r) => r.isCorrect).length;
  const rankTitle = getRankTitle(totalScore);
  const maxScore = totalRounds * 10;

  return (
    <div className="quiz-summary">
      <h2 className="quiz-summary__title">Quiz Complete!</h2>

      <div className="quiz-summary__score-display">
        <span className="quiz-summary__score">{totalScore}</span>
        <span className="quiz-summary__max">/ {maxScore}</span>
      </div>

      <p className="quiz-summary__rank">{rankTitle}</p>
      <p className="quiz-summary__correct">
        {correctCount} of {totalRounds} correct
      </p>

      <div className="quiz-summary__breakdown">
        <h3 className="quiz-summary__breakdown-title">Round Breakdown</h3>
        <ul className="quiz-summary__rounds">
          {results.map((result, index) => (
            <li
              key={index}
              className={`quiz-summary__round ${result.isCorrect ? 'quiz-summary__round--correct' : 'quiz-summary__round--wrong'}`}
            >
              <span className="quiz-summary__round-number">R{index + 1}</span>
              <span className="quiz-summary__round-name">{result.cardName}</span>
              <span className="quiz-summary__round-score">
                {result.isCorrect ? (result.usedHint ? '+5' : '+10') : '0'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <button className="quiz-summary__restart-btn" onClick={onRestart}>
        Play Again
      </button>
    </div>
  );
}
