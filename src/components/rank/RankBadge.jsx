import { getRankTier } from '../../constants/rankTiers';
import '../game/Game.css';

export default function RankBadge({ tierKey, size = 'small' }) {
  const tier = getRankTier(tierKey);

  return (
    <span className="rank-badge">
      {tier.badgeUrl && (
        <img
          src={tier.badgeUrl}
          alt={`${tier.label} badge`}
          className={`rank-badge__icon rank-badge__icon--${size}`}
        />
      )}
      <span className="rank-badge__label">{tier.label}</span>
    </span>
  );
}
