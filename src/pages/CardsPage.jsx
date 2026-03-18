import { useState, useEffect } from 'react';
import { getCards } from '../api/gameApi';
import DinoCard from '../components/game/DinoCard';

export default function CardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          <DinoCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
