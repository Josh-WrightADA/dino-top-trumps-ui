import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../api/authApi';
import PasswordField from './PasswordField';
import './AuthForms.css';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function validate() {
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      return 'All fields are required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters.';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.detail || err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="auth-form__title">Register</h2>
      {error && <p className="auth-form__error" role="alert">{error}</p>}
      <label className="auth-form__label">
        Username
        <input
          className="auth-form__input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
      </label>
      <label className="auth-form__label">
        Email
        <input
          className="auth-form__input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </label>
      <PasswordField
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
      />
      <PasswordField
        label="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
      />
      <button className="auth-form__submit" type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      <div className="auth-links">
        <Link to="/login" className="auth-links__link">Already have an account? Login</Link>
      </div>
    </form>
  );
}
