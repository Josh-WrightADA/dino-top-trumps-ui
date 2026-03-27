import { useState } from 'react';
import useCards from '../hooks/useCards';
import QuizGame from '../components/quiz/QuizGame';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import '../components/quiz/Quiz.css';

export default function QuizPage() {
  const { cards, loading, error, refetch } = useCards();
  const [started, setStarted] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  function handleStart() {
    setGameKey((k) => k + 1);
    setStarted(true);
  }

  return (
    <div className="quiz-page">
      {loading && <LoadingSpinner message="Loading quiz..." />}
      {error && <ErrorMessage message="Failed to load cards. Please try again." onRetry={refetch} />}
      {!loading && !error && !started && (
        <>
          <h1 className="page-heading quiz-page__title">Dino Quiz</h1>
          <p className="quiz-page__subtitle">
            Test your dinosaur knowledge! Identify 10 dinosaurs from their images.
            Use hints for partial credit, or go for the full 10 points per question.
          </p>
          <button className="quiz-page__start-btn" onClick={handleStart}>
            Start Quiz
          </button>
        </>
      )}
      {!loading && !error && started && (
        <QuizGame key={gameKey} cards={cards} onRestart={handleStart} />
      )}
    </div>
  );
}
