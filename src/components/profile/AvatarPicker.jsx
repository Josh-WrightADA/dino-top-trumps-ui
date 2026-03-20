import { useState, useEffect } from 'react';
import { getCards } from '../../api/gameApi';
import { setDinoAvatar } from '../../api/authApi';

export default function AvatarPicker({ onClose, onSelect }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    async function fetchCards() {
      try {
        const res = await getCards();
        setCards(res.data);
      } catch {
        setError('Failed to load cards.');
      } finally {
        setLoading(false);
      }
    }
    fetchCards();
  }, []);

  async function handleSelect(imageUrl) {
    if (!imageUrl) return;
    setSelecting(true);
    setError('');
    try {
      const res = await setDinoAvatar(imageUrl);
      onSelect(res.data.avatarUrl || imageUrl);
    } catch {
      setError('Failed to set avatar. Please try again.');
    } finally {
      setSelecting(false);
    }
  }

  return (
    <div className="avatar-picker" role="dialog" aria-modal="true" aria-label="Choose a dino avatar">
      <div className="avatar-picker__panel">
        <div className="avatar-picker__header">
          <h3>Choose a Dino</h3>
          <button
            className="avatar-picker__close"
            onClick={onClose}
            aria-label="Close"
            disabled={selecting}
          >
            x
          </button>
        </div>

        {error && (
          <p style={{ color: '#c62828', background: '#fdecea', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem' }}>
            {error}
          </p>
        )}

        {loading ? (
          <p>Loading cards...</p>
        ) : (
          <div className="avatar-picker__grid">
            {cards.map((card) => (
              <button
                key={card.id}
                className="avatar-picker__card"
                onClick={() => handleSelect(card.imageUrl)}
                disabled={selecting || !card.imageUrl}
                title={card.name}
                aria-label={`Select ${card.name} as avatar`}
              >
                {card.imageUrl ? (
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="avatar-picker__thumbnail"
                  />
                ) : (
                  <div className="avatar-picker__no-image">{card.name.charAt(0)}</div>
                )}
                <span className="avatar-picker__card-name">{card.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
