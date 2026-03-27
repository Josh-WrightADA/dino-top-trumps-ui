import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../../api/authApi';
import useAuth from '../../hooks/useAuth';
import './AuthForms.css';

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/login'), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Both fields are required.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      if (isAuthenticated) {
        logout();
      }
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.message || 'Reset failed.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="auth-form">
        <h2>Password Reset</h2>
        <p className="reset-password__success" role="status">
          Your password has been reset successfully. Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Reset Password</h2>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <label>
        New Password (at least 8 characters)
        <div className="auth-form__password-field">
          <input
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="auth-form__toggle-password"
            onClick={() => setShowNewPassword(prev => !prev)}
            aria-label={showNewPassword ? 'Hide password' : 'Show password'}
          >
            {showNewPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </label>
      <label>
        Confirm Password
        <div className="auth-form__password-field">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="auth-form__toggle-password"
            onClick={() => setShowConfirmPassword(prev => !prev)}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
      <div className="auth-links">
        <Link to="/login">Back to Login</Link>
      </div>
    </form>
  );
}
