import { useState, useEffect } from 'react';
import { getCards } from '../api/gameApi';
import DinoCard from '../components/game/DinoCard';
import CardDetailModal from '../components/game/CardDetailModal';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import '../App.css';

export default function CardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);

  async function fetchCards() {
    setLoading(true);
    setError('');
    try {
      const res = await getCards();
      setCards(res.data);
    } catch {
      setError('Failed to load cards. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <div className="page">
      <h1 className="page-heading">Card Collection</h1>
      {loading && <LoadingSpinner message="Loading cards..." />}
      {error && <ErrorMessage message={error} onRetry={fetchCards} />}
      {!loading && !error && (
        <>
          <p>{cards.length} dinosaurs available</p>
          <div className="cards-page__grid">
            {cards.map((card) => (
              <button
                key={card.id}
                className="cards-page__card-btn"
                onClick={() => setSelectedCard(card)}
                aria-label={`View details for ${card.name}`}
              >
                <DinoCard card={card} />
              </button>
            ))}
          </div>
        </>
      )}

      {selectedCard && (
        <CardDetailModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  );
}
