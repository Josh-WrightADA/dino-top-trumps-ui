import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';
import { renderWithRouter } from '../../test/helpers/renderHelpers';

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../../hooks/useAuth', () => ({
  default: () => ({ login: mockLogin }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../api/authApi', () => ({
  login: vi.fn(),
}));

import { login as loginApi } from '../../api/authApi';

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders username and password fields', () => {
    renderWithRouter(<LoginForm />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders the Login button', () => {
    renderWithRouter(<LoginForm />);
    expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
  });

  it('shows error when fields are empty on submit', async () => {
    renderWithRouter(<LoginForm />);
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }));
    expect(screen.getByRole('alert')).toHaveTextContent('Username and password are required.');
  });

  it('calls login API with correct credentials on submit', async () => {
    loginApi.mockResolvedValue({ data: { accessToken: 'fake-token' } });

    renderWithRouter(<LoginForm />);
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'dinoking' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(loginApi).toHaveBeenCalledWith('dinoking', 'password123');
      expect(mockLogin).toHaveBeenCalledWith('fake-token');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows error message when login fails', async () => {
    loginApi.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });

    renderWithRouter(<LoginForm />);
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'dinoking' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');
    });
  });

  it('disables button while submitting', async () => {
    let resolveLogin;
    loginApi.mockImplementation(() => new Promise(resolve => { resolveLogin = resolve; }));

    renderWithRouter(<LoginForm />);
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'dinoking' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }));

    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();

    resolveLogin({ data: { accessToken: 'tok' } });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^login$/i })).not.toBeDisabled();
    });
  });
});
