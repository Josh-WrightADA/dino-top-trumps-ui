import { useRef } from 'react';
import '../profile/Avatar.css';
import '../shared/Shared.css';

export default function AvatarSection({ profile, uploadingAvatar, onFileChange, onPickerOpen }) {
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    onFileChange(e);
  }

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

      <div className="avatar-section__actions">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="visually-hidden"
          onChange={handleFileChange}
          aria-label="Upload avatar photo"
        />
        <button
          type="button"
          className="btn"
          onClick={() => fileInputRef.current.click()}
          disabled={uploadingAvatar}
        >
          {uploadingAvatar ? 'Uploading...' : 'Upload Photo'}
        </button>
        <button
          type="button"
          onClick={onPickerOpen}
          disabled={uploadingAvatar}
          className="btn--secondary"
        >
          Choose a Dino
        </button>
      </div>
    </div>
  );
}
