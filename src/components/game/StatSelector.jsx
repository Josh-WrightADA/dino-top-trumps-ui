import './Game.css';

const STATS = ['HEIGHT', 'WEIGHT', 'INTELLIGENCE', 'SPEED', 'STRENGTH'];

export default function StatSelector({ card, onSelect, disabled }) {
  if (!card) return null;

  const statValues = {
    HEIGHT: card.height,
    WEIGHT: card.weight,
    INTELLIGENCE: card.intelligence,
    SPEED: card.speed,
    STRENGTH: card.strength,
  };

  return (
    <div className="stat-selector">
      <div className="stat-selector__title">Choose a stat to compare</div>
      <div className="stat-selector__grid">
        {STATS.map((stat) => (
          <button
            key={stat}
            className="stat-selector__btn"
            onClick={() => onSelect(stat)}
            disabled={disabled}
          >
            <span className="stat-selector__btn-label">{stat}</span>
            <span className="stat-selector__btn-value">{statValues[stat]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
