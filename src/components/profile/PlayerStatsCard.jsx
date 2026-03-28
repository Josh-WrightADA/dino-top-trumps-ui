import RankBadge from '../rank/RankBadge';

/**
 * Reusable stats card for profile pages.
 * Renders a grid of stat label/value pairs with an optional rank badge.
 */
export default function PlayerStatsCard({ stats }) {
  return (
    <div className="profile__card">
      <div className="profile__stats">
        {stats.map(({ label, value }) => (
          <div key={label}>
            <div className="profile__stat-label">{label}</div>
            <div className="profile__stat-value">
              {label === 'Rank' ? <RankBadge tierKey={value} size="medium" /> : value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
