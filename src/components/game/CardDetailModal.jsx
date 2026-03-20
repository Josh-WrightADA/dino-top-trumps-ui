import './Game.css';

const STAT_ORDER = ['height', 'weight', 'intelligence', 'speed', 'strength'];

export default function CardDetailModal({ card, onClose }) {
  if (!card) return null;

  const dietClass = card.diet ? card.diet.toLowerCase() : '';

  return (
    <div className="card-modal" role="dialog" aria-modal="true" aria-label={card.name}>
      <div className="card-modal__backdrop" onClick={onClose} />
      <div className="card-modal__panel">
        <div className="card-modal__header">
          <div>
            <h2 className="card-modal__name">{card.name}</h2>
            {card.meaning && <div className="card-modal__meaning">"{card.meaning}"</div>}
          </div>
          <button className="card-modal__close" onClick={onClose} aria-label="Close">x</button>
        </div>

        {card.imageUrl ? (
          <img className="card-modal__image" src={card.imageUrl} alt={card.name} />
        ) : (
          <div className="card-modal__image-placeholder">DINO</div>
        )}

        <div className="card-modal__meta">
          {card.diet && (
            <span className={`dino-card__tag dino-card__tag--${dietClass}`}>{card.diet}</span>
          )}
          {card.era && <span className="dino-card__tag">{card.era}</span>}
        </div>

        {card.description && (
          <p className="card-modal__description">{card.description}</p>
        )}

        <div className="card-modal__stats">
          {STAT_ORDER.map((stat) => (
            <div key={stat} className="dino-card__stat">
              <span className="dino-card__stat-label">{stat}</span>
              <div className="dino-card__stat-bar">
                <div className="dino-card__stat-fill" style={{ width: `${card[stat]}%` }} />
              </div>
              <span className="dino-card__stat-value">{card[stat]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
