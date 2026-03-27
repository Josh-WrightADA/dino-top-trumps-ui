import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from './RegisterForm';
import { renderWithRouter } from '../../test/helpers/renderHelpers';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../api/authApi', () => ({
  register: vi.fn(),
}));

import { register } from '../../api/authApi';

function fillForm({ username = 'newuser', email = 'new@test.com', password = 'password123', confirm = 'password123' } = {}) {
  fireEvent.change(screen.getByLabelText(/^username$/i), { target: { value: username } });
  fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: email } });
  fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: password } });
  fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: confirm } });
}

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all required fields', () => {
    renderWithRouter(<RegisterForm />);
    expect(screen.getByLabelText(/^username$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('shows validation error for password too short', () => {
    renderWithRouter(<RegisterForm />);
    fillForm({ password: 'short', confirm: 'short' });
    fireEvent.click(screen.getByRole('button', { name: /^register$/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Password must be at least 8 characters.');
  });

  it('shows validation error for password mismatch', () => {
    renderWithRouter(<RegisterForm />);
    fillForm({ password: 'password123', confirm: 'password456' });
    fireEvent.click(screen.getByRole('button', { name: /^register$/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Passwords do not match.');
  });

  it('calls register API and navigates on valid submit', async () => {
    register.mockResolvedValue({ data: {} });

    renderWithRouter(<RegisterForm />);
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /^register$/i }));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith('newuser', 'new@test.com', 'password123');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('shows error message when registration fails', async () => {
    register.mockRejectedValue({
      response: { data: { message: 'Username already taken' } },
    });

    renderWithRouter(<RegisterForm />);
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /^register$/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Username already taken');
    });
  });
});
