import '../profile/Avatar.css';

/**
 * Reusable avatar component. Renders an image when avatarUrl is provided,
 * otherwise renders a placeholder with the user's initial.
 *
 * @param {string} [avatarUrl] - URL of the avatar image
 * @param {string} [name]      - Display name or username (used for alt text and initial)
 * @param {'small'|'medium'|'large'} [size='medium'] - Size variant
 * @param {string} [className] - Additional CSS classes to append
 */
export default function Avatar({ avatarUrl, name = 'U', size = 'medium', className = '' }) {
  const initial = (name || 'U').charAt(0).toUpperCase();
  const extra = className ? ` ${className}` : '';

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`${name}'s avatar`}
        className={`avatar avatar--${size}${extra}`}
      />
    );
  }

  return (
    <div className={`avatar-placeholder avatar-placeholder--${size}${extra}`}>
      {initial}
    </div>
  );
}
