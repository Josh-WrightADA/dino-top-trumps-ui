import { useRef } from 'react';
import './Avatar.css';

export default function AvatarSection({ profile, uploadingAvatar, onFileChange, onPickerOpen }) {
  const fileInputRef = useRef(null);

  return (
    <div className="profile__card avatar-section">
      {profile.avatarUrl ? (
        <img
          src={profile.avatarUrl}
          alt="Your avatar"
          className="avatar avatar--large"
        />
      ) : (
        <div className="avatar-placeholder avatar-placeholder--large">
          {(profile.username || 'U').charAt(0)}
        </div>
      )}

      <p className="avatar-section__hint">Choose how you appear to other players</p>

      <div className="avatar-section__actions">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="visually-hidden"
          onChange={onFileChange}
          aria-label="Upload avatar photo"
        />
        <button
          type="button"
          className="avatar-section__action-btn"
          onClick={() => fileInputRef.current.click()}
          disabled={uploadingAvatar}
        >
          <span className="avatar-section__action-label">
            {uploadingAvatar ? 'Uploading...' : 'Upload Photo'}
          </span>
          <span className="avatar-section__action-desc">Use your own image</span>
        </button>
        <button
          type="button"
          onClick={onPickerOpen}
          disabled={uploadingAvatar}
          className="avatar-section__action-btn"
        >
          <span className="avatar-section__action-label">Choose Dinosaur</span>
          <span className="avatar-section__action-desc">Pick from the gallery</span>
        </button>
      </div>
    </div>
  );
}
