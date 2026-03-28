import { useState } from 'react';
import CardStats from './CardStats';
import './DinoCard.css';

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
        <CardStats card={card} highlightStat={highlightStat} />
      </div>
    </div>
  );
}
