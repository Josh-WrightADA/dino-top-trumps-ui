import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

vi.mock('../../hooks/useAuth', () => ({
  default: vi.fn(),
}));

import useAuth from '../../hooks/useAuth';

function renderWithRoutes(authValue, requiredRole) {
  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute requiredRole={requiredRole}>
              <p>Protected content</p>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<p>Login page</p>} />
        <Route path="/lobby" element={<p>Lobby page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to /login', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, user: null });

    renderWithRoutes({ isAuthenticated: false, user: null });

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('redirects users without required role to /lobby', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: { role: 'PLAYER' } });

    renderWithRoutes({ isAuthenticated: true, user: { role: 'PLAYER' } }, 'ADMIN');

    expect(screen.getByText('Lobby page')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('renders children when authenticated and authorized', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: { role: 'ADMIN' } });

    renderWithRoutes({ isAuthenticated: true, user: { role: 'ADMIN' } }, 'ADMIN');

    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });
});
