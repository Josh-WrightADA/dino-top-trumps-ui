import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResetPasswordForm from './ResetPasswordForm';

const mockNavigate = vi.fn();
const mockLogout = vi.fn();

vi.mock('../../hooks/useAuth', () => ({
  default: () => ({
    logout: mockLogout,
    isAuthenticated: false,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../api/authApi', () => ({
  resetPassword: vi.fn(),
}));

import { resetPassword } from '../../api/authApi';

function renderWithToken(token = 'valid-reset-token') {
  return render(
    <MemoryRouter initialEntries={[`/reset-password?token=${token}`]}>
      <ResetPasswordForm />
    </MemoryRouter>
  );
}

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders password and confirm password fields', () => {
    renderWithToken();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('shows error for password mismatch', () => {
    renderWithToken();
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password456' } });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Passwords do not match.');
  });

  it('shows error for password too short', () => {
    renderWithToken();
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: 'short' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Password must be at least 8 characters.');
  });

  it('calls reset API with token and shows success message', async () => {
    resetPassword.mockResolvedValue({ data: {} });

    renderWithToken('my-reset-token');
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: 'newpassword1' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'newpassword1' } });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith('my-reset-token', 'newpassword1');
      expect(screen.getByRole('status')).toHaveTextContent('Your password has been reset successfully.');
    });
  });

  it('shows error when reset API fails', async () => {
    resetPassword.mockRejectedValue({
      response: { data: { message: 'Token expired' } },
    });

    renderWithToken();
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: 'newpassword1' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'newpassword1' } });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Token expired');
    });
  });
});
