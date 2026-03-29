import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
  it('renders error message with role alert', () => {
    render(<ErrorMessage message="Something went wrong" />);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('shows retry button only when onRetry provided', () => {
    const { rerender } = render(<ErrorMessage message="Error" />);
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();

    const onRetry = vi.fn();
    rerender(<ErrorMessage message="Error" onRetry={onRetry} />);
    const retryBtn = screen.getByText('Try Again');
    expect(retryBtn).toBeInTheDocument();

    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
