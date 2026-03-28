import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../../api/authApi';
import useAuth from '../../hooks/useAuth';
import PasswordField from './PasswordField';
import './AuthForms.css';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginApi(username, password);
      login(res.data.accessToken);
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.detail || err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="auth-form__title">Login</h2>
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
      <PasswordField
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      <button className="auth-form__submit" type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <div className="auth-links">
        <Link to="/register" className="auth-links__link">Create an account</Link>
        <Link to="/forgot-password" className="auth-links__link">Forgot password?</Link>
      </div>
    </form>
  );
}
