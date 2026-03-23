import { getRankTier } from '../../constants/rankTiers';
import '../game/Game.css';

export default function RankBadge({ tierKey, size = 'small' }) {
  const tier = getRankTier(tierKey);

  const sizeMap = {
    small: 20,
    medium: 28,
    large: 36,
  };

  const px = sizeMap[size] || sizeMap.small;

  return (
    <span className="rank-badge">
      {tier.badgeUrl && (
        <img
          src={tier.badgeUrl}
          alt={`${tier.label} badge`}
          className={`rank-badge__icon rank-badge__icon--${size}`}
          style={{ width: `${px}px`, height: `${px}px` }}
        />
      )}
      <span className="rank-badge__label">{tier.label}</span>
    </span>
  );
}
