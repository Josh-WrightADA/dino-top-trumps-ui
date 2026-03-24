import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import HomePage from './HomePage';
import { renderWithRouter } from '../test/helpers/renderHelpers';
import { mockCards } from '../test/helpers/mockFixtures';

let mockIsAuthenticated = true;

vi.mock('../hooks/useAuth', () => ({
  default: () => ({
    isAuthenticated: mockIsAuthenticated,
  }),
}));

vi.mock('../api/gameApi', () => ({
  getCards: () => Promise.resolve({ data: mockCards }),
}));

const mockObserverInstances = [];

beforeEach(() => {
  mockIsAuthenticated = true;
  mockObserverInstances.length = 0;

  globalThis.IntersectionObserver = class {
    constructor(callback) {
      this.observe = vi.fn();
      this.disconnect = vi.fn();
      this.callback = callback;
      mockObserverInstances.push(this);
    }
  };
});

describe('HomePage', () => {
  it('renders hero title and tagline', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('Dino')).toBeInTheDocument();
    expect(screen.getByText('Top Trumps')).toBeInTheDocument();
    expect(screen.getByText(/Collect\. Battle\. Dominate/)).toBeInTheDocument();
  });

  it('renders Enter the Arena CTA when authenticated', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('Enter the Arena')).toBeInTheDocument();
    expect(screen.getByText('Enter the Arena').closest('a')).toHaveAttribute('href', '/lobby');
  });

  it('renders Join the Arena and Sign In CTAs when unauthenticated', () => {
    mockIsAuthenticated = false;
    renderWithRouter(<HomePage />);
    expect(screen.getByText('Join the Arena')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders all four feature cards', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('Card Battles')).toBeInTheDocument();
    expect(screen.getByText('Ranked Play')).toBeInTheDocument();
    expect(screen.getByText('Dino Quiz')).toBeInTheDocument();
    expect(screen.getByText('Card Gallery')).toBeInTheDocument();
  });

  it('feature cards link to correct pages when authenticated', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('Card Battles').closest('a')).toHaveAttribute('href', '/lobby');
    expect(screen.getByText('Ranked Play').closest('a')).toHaveAttribute('href', '/leaderboard');
    expect(screen.getByText('Dino Quiz').closest('a')).toHaveAttribute('href', '/quiz');
    expect(screen.getByText('Card Gallery').closest('a')).toHaveAttribute('href', '/cards');
  });

  it('feature cards are not links when unauthenticated', () => {
    mockIsAuthenticated = false;
    renderWithRouter(<HomePage />);
    expect(screen.getByText('Card Battles').closest('a')).toBeNull();
  });

  it('feature cards start without animate class', () => {
    renderWithRouter(<HomePage />);
    const card = screen.getByText('Card Battles').closest('.home__feature-card');
    expect(card.className).not.toContain('home__feature-card--animate');
  });

  it('feature cards get animate class when intersection observer triggers', async () => {
    renderWithRouter(<HomePage />);

    const observer = mockObserverInstances.find(
      (obs) => obs.observe.mock.calls.length > 0
    );
    expect(observer).toBeDefined();

    act(() => {
      observer.callback([{ isIntersecting: true }]);
    });

    const card = screen.getByText('Card Battles').closest('.home__feature-card');
    expect(card.className).toContain('home__feature-card--animate');
    expect(observer.disconnect).toHaveBeenCalled();
  });

  it('renders card marquee after API loads', async () => {
    renderWithRouter(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText('36 Dinosaurs. One Champion.')).toBeInTheDocument();
    });
  });

  it('renders showcase link when authenticated', async () => {
    renderWithRouter(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText(/Explore the full collection/)).toBeInTheDocument();
    });
  });

  it('hides showcase link when unauthenticated', async () => {
    mockIsAuthenticated = false;
    renderWithRouter(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText('36 Dinosaurs. One Champion.')).toBeInTheDocument();
    });
    expect(screen.queryByText(/Explore the full collection/)).not.toBeInTheDocument();
  });
});
