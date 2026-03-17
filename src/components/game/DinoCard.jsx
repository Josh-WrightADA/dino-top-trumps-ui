import './Game.css';

const DIET_EMOJI = {
  Carnivore: '🥩',
  Herbivore: '🌿',
  Omnivore: '🍽️',
};

const STAT_ORDER = ['height', 'weight', 'intelligence', 'speed', 'strength'];

export default function DinoCard({ card, highlightStat }) {
  if (!card) return null;

  const dietClass = card.diet ? card.diet.toLowerCase() : '';

  return (
    <div className="dino-card">
      <div className="dino-card__header">
        <h3 className="dino-card__name">{card.name}</h3>
        {card.meaning && <div className="dino-card__meaning">"{card.meaning}"</div>}
      </div>

      {card.imageUrl ? (
        <img className="dino-card__image" src={card.imageUrl} alt={card.name} />
      ) : (
        <div className="dino-card__image-placeholder">🦕</div>
      )}

      <div className="dino-card__meta">
        {card.diet && (
          <span className={`dino-card__tag dino-card__tag--${dietClass}`}>
            {DIET_EMOJI[card.diet] || ''} {card.diet}
          </span>
        )}
        {card.era && <span className="dino-card__tag">{card.era}</span>}
      </div>

      <div className="dino-card__stats">
        {STAT_ORDER.map((stat) => (
          <div
            key={stat}
            className="dino-card__stat"
            style={highlightStat === stat ? { fontWeight: 700 } : {}}
          >
            <span className="dino-card__stat-label">{stat}</span>
            <div className="dino-card__stat-bar">
              <div
                className="dino-card__stat-fill"
                style={{
                  width: `${card[stat]}%`,
                  background: highlightStat === stat ? '#1b4332' : '#2d6a4f',
                }}
              />
            </div>
            <span className="dino-card__stat-value">{card[stat]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
