import { STAT_ORDER } from '../../constants/statOrder';

/**
 * Reusable stat bars for dinosaur cards.
 * Used by DinoCard (game board) and CardDetailModal (gallery).
 */
export default function CardStats({ card, highlightStat }) {
  return (
    <>
      {STAT_ORDER.map((stat) => {
        const isHighlighted = highlightStat === stat;
        return (
          <div
            key={stat}
            className={`dino-card__stat${isHighlighted ? ' dino-card__stat--highlighted' : ''}`}
          >
            <span className="dino-card__stat-label">{stat}</span>
            <div className="dino-card__stat-bar">
              <div
                className={`dino-card__stat-fill${isHighlighted ? ' dino-card__stat-fill--highlighted' : ''}`}
                style={{ width: `${Math.min(card[stat], 100)}%` }}
              />
            </div>
            <span className="dino-card__stat-value">{card[stat]}</span>
          </div>
        );
      })}
    </>
  );
}
