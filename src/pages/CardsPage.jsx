import { useState } from 'react';
import useCards from '../hooks/useCards';
import DinoCard from '../components/game/DinoCard';
import CardDetailModal from '../components/game/CardDetailModal';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import '../App.css';

export default function CardsPage() {
  const { cards, loading, error, refetch } = useCards();
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <div className="page">
      <h1 className="page-heading">Card Collection</h1>
      {loading && <LoadingSpinner message="Loading cards..." />}
      {error && <ErrorMessage message="Failed to load cards. Please try again." onRetry={refetch} />}
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
