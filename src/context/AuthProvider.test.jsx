import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from './AuthProvider';
import { AuthContext } from './AuthContext';
import { useContext } from 'react';

vi.mock('../api/authApi', () => ({
  getProfile: vi.fn(),
}));

import { getProfile } from '../api/authApi';

// Build a valid JWT-like token with a future expiry
function buildToken(payload) {
  const header = btoa(JSON.stringify({ alg: 'HS256' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
}

function TestConsumer() {
  const ctx = useContext(AuthContext);
  return (
    <div>
      <p data-testid="user">{ctx.user ? ctx.user.username : 'none'}</p>
      <p data-testid="authenticated">{String(ctx.isAuthenticated)}</p>
      <button onClick={() => ctx.login(buildToken({ sub: 'user-1', username: 'loginuser', role: 'PLAYER', exp: Math.floor(Date.now() / 1000) + 3600 }))}>
        do-login
      </button>
      <button onClick={() => ctx.logout()}>do-logout</button>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    getProfile.mockResolvedValue({ data: { avatarUrl: null, displayName: null, role: 'PLAYER' } });
  });

  it('returns null user when no token in localStorage', () => {
    render(
      <AuthProvider><TestConsumer /></AuthProvider>
    );
    expect(screen.getByTestId('user')).toHaveTextContent('none');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });

  it('provides user context when a valid token exists in localStorage', () => {
    const token = buildToken({ sub: 'user-1', username: 'storeduser', role: 'PLAYER', exp: Math.floor(Date.now() / 1000) + 3600 });
    localStorage.setItem('token', token);

    render(
      <AuthProvider><TestConsumer /></AuthProvider>
    );
    expect(screen.getByTestId('user')).toHaveTextContent('storeduser');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
  });

  it('clears expired tokens from localStorage', () => {
    const token = buildToken({ sub: 'user-1', username: 'expired', role: 'PLAYER', exp: Math.floor(Date.now() / 1000) - 3600 });
    localStorage.setItem('token', token);

    render(
      <AuthProvider><TestConsumer /></AuthProvider>
    );
    expect(screen.getByTestId('user')).toHaveTextContent('none');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('login() stores token and sets user', async () => {
    render(
      <AuthProvider><TestConsumer /></AuthProvider>
    );

    fireEvent.click(screen.getByText('do-login'));

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('loginuser');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(localStorage.getItem('token')).toBeTruthy();
    });
  });

  it('logout() clears token and user', async () => {
    const token = buildToken({ sub: 'user-1', username: 'storeduser', role: 'PLAYER', exp: Math.floor(Date.now() / 1000) + 3600 });
    localStorage.setItem('token', token);

    render(
      <AuthProvider><TestConsumer /></AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('storeduser');

    fireEvent.click(screen.getByText('do-logout'));

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('none');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
