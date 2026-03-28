import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../../api/authApi';
import useAuth from '../../hooks/useAuth';
import PasswordField from './PasswordField';
import { extractErrorMessage } from '../../utils/extractErrorMessage';
import './AuthForms.css';

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      setError(extractErrorMessage(err, 'Reset failed.'));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="auth-form">
        <h2 className="auth-form__title">Password Reset</h2>
        <p className="auth-form__success" role="status">
          Your password has been reset successfully. Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="auth-form__title">Reset Password</h2>
      {error && <p className="auth-form__error" role="alert">{error}</p>}
      <PasswordField
        label="New Password (at least 8 characters)"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        autoComplete="new-password"
      />
      <PasswordField
        label="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
      />
      <button className="auth-form__submit" type="submit" disabled={loading}>
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
      <div className="auth-links">
        <Link to="/login">Back to Login</Link>
      </div>
    </form>
  );
}
