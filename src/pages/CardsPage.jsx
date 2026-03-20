import { useState, useEffect } from 'react';
import { getCards } from '../api/gameApi';
import DinoCard from '../components/game/DinoCard';
import CardDetailModal from '../components/game/CardDetailModal';

export default function CardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    async function fetchCards() {
      try {
        const res = await getCards();
        setCards(res.data);
      } catch {
        setError('Failed to load cards. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchCards();
  }, []);

  if (loading) return <div className="page"><p>Loading cards...</p></div>;
  if (error) return <div className="page"><p>{error}</p></div>;

  return (
    <div className="page">
      <h1>Card Collection</h1>
      <p>{cards.length} dinosaurs available</p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1.5rem',
        marginTop: '1.5rem',
      }}>
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => setSelectedCard(card)}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') setSelectedCard(card); }}
          >
            <DinoCard card={card} />
          </div>
        ))}
      </div>

      {selectedCard && (
        <CardDetailModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  );
}
