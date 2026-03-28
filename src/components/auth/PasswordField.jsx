import { useState } from 'react';

export default function PasswordField({ label, value, onChange, autoComplete, id }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className="auth-form__label" htmlFor={id}>
      {label}
      <div className="auth-form__password-field">
        <input
          id={id}
          className="auth-form__input"
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="auth-form__toggle-password"
          onClick={() => setShowPassword(prev => !prev)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
    </label>
  );
}
