import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPasswordForm from './ForgotPasswordForm';
import { renderWithRouter } from '../../test/helpers/renderHelpers';

vi.mock('../../api/authApi', () => ({
  forgotPassword: vi.fn(),
}));

import { forgotPassword } from '../../api/authApi';

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the email field', () => {
    renderWithRouter(<ForgotPasswordForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('shows error when email is empty', () => {
    renderWithRouter(<ForgotPasswordForm />);
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    expect(screen.getByRole('alert')).toHaveTextContent('Email is required.');
  });

  it('calls forgot password API and shows success message', async () => {
    forgotPassword.mockResolvedValue({ data: {} });

    renderWithRouter(<ForgotPasswordForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@test.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(forgotPassword).toHaveBeenCalledWith('user@test.com');
      expect(screen.getByRole('status')).toHaveTextContent('If that email exists, a reset link has been sent.');
    });
  });

  it('shows error message when API call fails', async () => {
    forgotPassword.mockRejectedValue(new Error('Network error'));

    renderWithRouter(<ForgotPasswordForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@test.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong. Please try again.');
    });
  });
});
