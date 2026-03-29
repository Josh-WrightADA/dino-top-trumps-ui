import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Avatar from './Avatar';

describe('Avatar', () => {
  it('renders image when avatarUrl provided', () => {
    render(<Avatar avatarUrl="http://example.com/pic.jpg" name="Alice" />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'http://example.com/pic.jpg');
    expect(img).toHaveAttribute('alt', "Alice's avatar");
  });

  it('renders placeholder with initial when no avatarUrl', () => {
    render(<Avatar name="Bob" />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('applies size class correctly', () => {
    const { container } = render(<Avatar avatarUrl="http://example.com/pic.jpg" name="Alice" size="large" />);

    const img = container.querySelector('img');
    expect(img).toHaveClass('avatar--large');
  });
});
