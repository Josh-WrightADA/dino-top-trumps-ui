import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SecuritySection from './SecuritySection';

describe('SecuritySection', () => {
  const defaultProps = {
    onLogout: vi.fn(),
    onError: vi.fn(),
    onSuccess: vi.fn(),
    onNavigate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders change password and delete account buttons', () => {
    render(<SecuritySection {...defaultProps} />);
    expect(screen.getByText('Change Password')).toBeInTheDocument();
    expect(screen.getByText('Delete Account')).toBeInTheDocument();
  });

  it('shows password form when change password is clicked', () => {
    render(<SecuritySection {...defaultProps} />);
    fireEvent.click(screen.getByText('Change Password'));
    expect(screen.getByText('Current Password')).toBeInTheDocument();
    expect(screen.getByText('Confirm New Password')).toBeInTheDocument();
  });

  it('shows password visibility toggles in change password form', () => {
    render(<SecuritySection {...defaultProps} />);
    fireEvent.click(screen.getByText('Change Password'));
    const showButtons = screen.getAllByText('Show');
    expect(showButtons.length).toBeGreaterThanOrEqual(3);
  });

  it('validates password mismatch before submit', () => {
    render(<SecuritySection {...defaultProps} />);
    fireEvent.click(screen.getByText('Change Password'));

    const inputs = screen.getAllByDisplayValue('');
    fireEvent.change(inputs[0], { target: { value: 'oldpassword1' } });
    fireEvent.change(inputs[1], { target: { value: 'newpassword1' } });
    fireEvent.change(inputs[2], { target: { value: 'newpassword2' } });

    // Submit button text is "Change Password" — there are two elements with this text
    // (the form submit button and the original toggle button which is now hidden)
    // Use getAllByText and click the submit button (type="submit")
    const submitBtn = screen.getByRole('button', { name: /change password/i });
    fireEvent.click(submitBtn);
    expect(defaultProps.onError).toHaveBeenCalledWith('Passwords do not match.');
  });

  it('shows inline delete confirmation when delete is clicked', () => {
    render(<SecuritySection {...defaultProps} />);
    fireEvent.click(screen.getByText('Delete Account'));
    expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
  });

  it('cancel hides delete confirmation', () => {
    render(<SecuritySection {...defaultProps} />);
    fireEvent.click(screen.getByText('Delete Account'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText(/this action cannot be undone/i)).not.toBeInTheDocument();
  });

  it('confirm delete button is disabled without password', () => {
    render(<SecuritySection {...defaultProps} />);
    fireEvent.click(screen.getByText('Delete Account'));
    expect(screen.getByText('Confirm Delete')).toBeDisabled();
  });
});
