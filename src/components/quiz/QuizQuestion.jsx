import { useState } from 'react';

export default function QuizQuestion({ question, onAnswer }) {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [hintUsed, setHintUsed] = useState(false);

  function handleChoiceClick(choice) {
    if (selectedChoice) return;
    setSelectedChoice(choice);
    onAnswer(choice, hintUsed);
  }

  function handleHint() {
    if (hintUsed || selectedChoice) return;
    setHintUsed(true);
  }

  return (
    <div className="quiz-question">
      <h2 className="quiz-question__title">Which dinosaur is this?</h2>

      {question.card.imageUrl && (
        <div className="quiz-question__image-container">
          <img
            src={question.card.imageUrl}
            alt="Mystery dinosaur"
            className="quiz-question__image"
          />
        </div>
      )}

      {hintUsed && (
        <p className="quiz-question__hint">
          Hint: This name means <strong>&quot;{question.card.meaning}&quot;</strong>
          <span className="quiz-question__hint-penalty"> (5 pts max)</span>
        </p>
      )}

      <div className="quiz-question__choices">
        {question.choices.map((choice) => (
          <button
            key={choice}
            className={`quiz-question__choice ${selectedChoice === choice ? 'quiz-question__choice--selected' : ''}`}
            onClick={() => handleChoiceClick(choice)}
            disabled={selectedChoice !== null}
          >
            {choice}
          </button>
        ))}
      </div>

      {!hintUsed && !selectedChoice && (
        <button className="quiz-question__hint-btn" onClick={handleHint}>
          Show Hint (reduces points)
        </button>
      )}
    </div>
  );
}
