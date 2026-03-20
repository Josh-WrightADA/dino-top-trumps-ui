import { useState, useEffect } from 'react';
import { getCards } from '../../api/gameApi';
import { setDinoAvatar } from '../../api/authApi';
import { DEFAULT_AVATARS } from '../../constants/defaultAvatars';

export default function AvatarPicker({ onClose, onSelect }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selecting, setSelecting] = useState(false);
  const [tab, setTab] = useState('portraits');

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

        <div className="avatar-picker__tabs">
          <button
            className={`avatar-picker__tab ${tab === 'portraits' ? 'avatar-picker__tab--active' : ''}`}
            onClick={() => setTab('portraits')}
          >
            Portraits
          </button>
          <button
            className={`avatar-picker__tab ${tab === 'cards' ? 'avatar-picker__tab--active' : ''}`}
            onClick={() => setTab('cards')}
          >
            Card Art
          </button>
        </div>

        {error && (
          <p style={{ color: '#c62828', background: '#fdecea', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem' }}>
            {error}
          </p>
        )}

        {tab === 'portraits' && (
          <div className="avatar-picker__grid">
            {DEFAULT_AVATARS.map((avatar) => (
              <button
                key={avatar.name}
                className="avatar-picker__card"
                onClick={() => handleSelect(avatar.url)}
                disabled={selecting}
                title={avatar.name}
                aria-label={`Select ${avatar.name} as avatar`}
              >
                <img
                  src={avatar.url}
                  alt={avatar.name}
                  className="avatar-picker__thumbnail"
                />
                <span className="avatar-picker__card-name">{avatar.name}</span>
              </button>
            ))}
          </div>
        )}

        {tab === 'cards' && (
          loading ? (
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
          )
        )}
      </div>
    </div>
  );
}
