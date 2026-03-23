import { useState, useEffect } from 'react';
import { getCards } from '../api/gameApi';
import QuizGame from '../components/quiz/QuizGame';
import '../components/quiz/Quiz.css';

export default function QuizPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await getCards();
        setCards(response.data);
      } catch {
        setError('Failed to load cards. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchCards();
  }, []);

  if (loading) return <div className="quiz-page"><p>Loading quiz...</p></div>;
  if (error) return <div className="quiz-page"><p className="quiz__error" role="alert">{error}</p></div>;

  return (
    <div className="quiz-page">
      {!started ? (
        <>
          <h1 className="quiz-page__title">Dino Quiz</h1>
          <p className="quiz-page__subtitle">
            Test your dinosaur knowledge! Identify 10 dinosaurs from their images.
            Use hints for partial credit, or go for the full 10 points per question.
          </p>
          <button className="quiz-page__start-btn" onClick={() => setStarted(true)}>
            Start Quiz
          </button>
        </>
      ) : (
        <QuizGame key={started} cards={cards} />
      )}
    </div>
  );
}
