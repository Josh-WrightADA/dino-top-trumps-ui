import { useState } from 'react';
import QuizQuestion from './QuizQuestion';
import QuizSummary from './QuizSummary';
import { generateQuizQuestions, calculateScore } from './quizLogic';
import './Quiz.css';

export default function QuizGame({ cards }) {
  const [questions] = useState(() => generateQuizQuestions(cards, 10));
  const [currentRound, setCurrentRound] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [results, setResults] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswer, setLastAnswer] = useState(null);

  if (questions.length === 0) {
    return <p className="quiz__error">Not enough cards to generate a quiz.</p>;
  }

  const isFinished = currentRound >= questions.length && !showResult;
  const question = questions[currentRound];

  function handleAnswer(selectedAnswer, usedHint) {
    const isCorrect = selectedAnswer === question.correctAnswer;
    const score = calculateScore(isCorrect, usedHint);

    setLastAnswer({ selectedAnswer, isCorrect, usedHint, score, question });
    setTotalScore((prev) => prev + score);
    setResults((prev) => [...prev, { isCorrect, usedHint, score, cardName: question.card.name }]);
    setShowResult(true);
  }

  function handleNextRound() {
    setShowResult(false);
    setLastAnswer(null);
    setCurrentRound((prev) => prev + 1);
  }

  function handleRestart() {
    setCurrentRound(0);
    setTotalScore(0);
    setResults([]);
    setShowResult(false);
    setLastAnswer(null);
  }

  if (isFinished) {
    return (
      <QuizSummary
        totalScore={totalScore}
        results={results}
        totalRounds={questions.length}
        onRestart={handleRestart}
      />
    );
  }

  if (showResult && lastAnswer) {
    const { question: q, isCorrect, score } = lastAnswer;
    return (
      <div className="quiz__result">
        <div className="quiz__progress">
          Round {currentRound + 1} of {questions.length}
        </div>
        <h2 className={`quiz__result-title ${isCorrect ? 'quiz__result-title--correct' : 'quiz__result-title--wrong'}`}>
          {isCorrect ? 'Correct!' : 'Wrong!'}
        </h2>
        <p className="quiz__result-score">+{score} points</p>
        <div className="quiz__card-reveal">
          {q.card.imageUrl && (
            <img src={q.card.imageUrl} alt={q.card.name} className="quiz__card-image" />
          )}
          <div className="quiz__card-info">
            <h3 className="quiz__card-name">{q.card.name}</h3>
            <p className="quiz__card-meaning">{q.card.meaning}</p>
            <p className="quiz__card-diet">{q.card.diet} — {q.card.era}</p>
            {q.card.funFact && (
              <div className="quiz__fun-fact">
                <strong>Did you know?</strong> {q.card.funFact}
              </div>
            )}
          </div>
        </div>
        <button className="quiz__next-btn" onClick={handleNextRound}>
          {currentRound + 1 < questions.length ? 'Next Question' : 'See Results'}
        </button>
      </div>
    );
  }

  return (
    <div className="quiz__round">
      <div className="quiz__progress">
        Round {currentRound + 1} of {questions.length} — Score: {totalScore}
      </div>
      <QuizQuestion question={question} onAnswer={handleAnswer} />
    </div>
  );
}
