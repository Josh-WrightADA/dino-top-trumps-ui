import { useState } from 'react';
import './Game.css';

const STAT_ORDER = ['height', 'weight', 'intelligence', 'speed', 'strength'];

export default function DinoCard({ card, highlightStat }) {
  const [imgError, setImgError] = useState(false);

  if (!card) return null;

  const dietClass = card.diet ? card.diet.toLowerCase() : '';

  return (
    <div className="dino-card">
      <div className="dino-card__header">
        <h3 className="dino-card__name">{card.name}</h3>
        {card.meaning && <div className="dino-card__meaning">"{card.meaning}"</div>}
      </div>

      <div className="dino-card__image-wrapper">
        {card.imageUrl && !imgError ? (
          <img
            className="dino-card__image"
            src={card.imageUrl}
            alt={card.name}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="dino-card__image-placeholder">DINO</div>
        )}
      </div>

      <div className="dino-card__meta">
        {card.diet && (
          <span className={`dino-card__tag dino-card__tag--${dietClass}`}>
            {card.diet}
          </span>
        )}
        {card.era && <span className="dino-card__tag">{card.era}</span>}
      </div>

      <div className="dino-card__stats">
        {STAT_ORDER.map((stat) => (
          <div
            key={stat}
            className={`dino-card__stat${highlightStat === stat ? ' dino-card__stat--highlighted' : ''}`}
          >
            <span className="dino-card__stat-label">{stat}</span>
            <div className="dino-card__stat-bar">
              <div
                className={`dino-card__stat-fill${highlightStat === stat ? ' dino-card__stat-fill--highlighted' : ''}`}
                style={{ width: `${Math.min(card[stat], 100)}%` }}
              />
            </div>
            <span className="dino-card__stat-value">{card[stat]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
