import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PasswordField from './PasswordField';

describe('PasswordField', () => {
  it('renders a label and a password input', () => {
    render(
      <PasswordField label="Password" value="" onChange={() => {}} autoComplete="current-password" />
    );
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  });

  it('toggles visibility when the show/hide button is clicked', () => {
    render(
      <PasswordField label="Password" value="secret" onChange={() => {}} autoComplete="current-password" />
    );

    const input = screen.getByLabelText('Password');
    const toggleButton = screen.getByRole('button', { name: 'Show password' });

    expect(input).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('has correct aria-label on the toggle button', () => {
    render(
      <PasswordField label="Password" value="" onChange={() => {}} autoComplete="new-password" />
    );
    expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument();
  });

  it('calls onChange when the input value changes', () => {
    const handleChange = vi.fn();
    render(
      <PasswordField label="Password" value="" onChange={handleChange} autoComplete="current-password" />
    );

    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'newpass' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('applies the provided id to the input', () => {
    render(
      <PasswordField label="Password" value="" onChange={() => {}} autoComplete="current-password" id="my-password" />
    );
    expect(screen.getByLabelText('Password')).toHaveAttribute('id', 'my-password');
  });
});
