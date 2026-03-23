import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';
import { renderWithRouter } from '../../test/helpers/renderHelpers';

vi.mock('../../hooks/useAuth', () => ({
  default: () => ({
    isAuthenticated: true,
    user: { username: 'testuser', displayName: 'Test User', avatarUrl: '' },
    logout: vi.fn(),
  }),
}));

describe('Navbar', () => {
  it('renders brand link', () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByText('Dino Top Trumps')).toBeInTheDocument();
  });

  it('renders authenticated nav links', () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByText('Lobby')).toBeInTheDocument();
    expect(screen.getByText('Cards')).toBeInTheDocument();
    expect(screen.getByText('Quiz')).toBeInTheDocument();
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
  });

  it('renders hamburger menu button with aria attributes', () => {
    renderWithRouter(<Navbar />);
    const hamburger = screen.getByLabelText('Toggle navigation menu');
    expect(hamburger).toBeInTheDocument();
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles menu open state on hamburger click', () => {
    renderWithRouter(<Navbar />);
    const hamburger = screen.getByLabelText('Toggle navigation menu');

    fireEvent.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes menu when a nav link is clicked', () => {
    renderWithRouter(<Navbar />);
    const hamburger = screen.getByLabelText('Toggle navigation menu');

    fireEvent.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(screen.getByText('Lobby'));
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });
});
