import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import AdminPage from './AdminPage';
import { renderWithRouter } from '../test/helpers/renderHelpers';

vi.mock('../api/adminApi', () => ({
  getUsers: vi.fn(),
  banUser: vi.fn(),
  unbanUser: vi.fn(),
  getAdminGames: vi.fn(),
  deleteGame: vi.fn(),
  getReports: vi.fn(),
  dismissReport: vi.fn(),
}));

vi.mock('../hooks/useAuth', () => ({
  default: () => ({
    isAuthenticated: true,
    user: { username: 'admin', role: 'ADMIN' },
  }),
}));

import { getUsers, banUser, unbanUser, getAdminGames, getReports } from '../api/adminApi';

const mockUsers = [
  { id: 'user-1', username: 'player1', displayName: 'Player One', email: 'p1@test.com', role: 'ADMIN', status: 'ACTIVE', eloRating: 1200, leaguePoints: 0, rankTier: 'CARNIVORE', gamesPlayed: 10, gamesWon: 7, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'user-2', username: 'player2', displayName: 'Player Two', email: 'p2@test.com', role: 'PLAYER', status: 'ACTIVE', eloRating: 900, leaguePoints: 100, rankTier: 'HERBIVORE', gamesPlayed: 5, gamesWon: 2, createdAt: '2026-01-01T00:00:00Z' },
];

const mockGames = [
  { id: 'game-1', status: 'WAITING', player1Id: 'user-1', player2Id: null, createdAt: '2026-03-20T10:00:00Z' },
];

const mockReports = [
  { id: 'report-1', reporterId: 'user-1', reportedUserId: 'user-2', reason: 'Toxic behaviour', status: 'PENDING', createdAt: '2026-03-20T10:00:00Z' },
];

describe('AdminPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getUsers.mockResolvedValue({ data: mockUsers });
    getAdminGames.mockResolvedValue({ data: mockGames });
    getReports.mockResolvedValue({ data: mockReports });
  });

  it('renders users tab by default', async () => {
    renderWithRouter(<AdminPage />);
    await waitFor(() => {
      expect(screen.getByText('Player One')).toBeInTheDocument();
      expect(screen.getByText('Player Two')).toBeInTheDocument();
    });
  });

  it('shows ban button for non-admin users only', async () => {
    renderWithRouter(<AdminPage />);
    await waitFor(() => {
      const banButtons = screen.getAllByText('Ban');
      expect(banButtons).toHaveLength(1);
    });
  });

  it('bans a user and updates status', async () => {
    banUser.mockResolvedValue({ data: { ...mockUsers[1], status: 'BANNED' } });
    renderWithRouter(<AdminPage />);
    await waitFor(() => screen.getByText('Player Two'));
    fireEvent.click(screen.getByText('Ban'));
    await waitFor(() => {
      expect(banUser).toHaveBeenCalledWith('user-2');
    });
  });

  it('switches to games tab', async () => {
    renderWithRouter(<AdminPage />);
    await waitFor(() => screen.getByText('Player One'));
    fireEvent.click(screen.getByText('Games'));
    await waitFor(() => {
      expect(screen.getByText('WAITING')).toBeInTheDocument();
    });
  });

  it('switches to reports tab', async () => {
    renderWithRouter(<AdminPage />);
    await waitFor(() => screen.getByText('Player One'));
    fireEvent.click(screen.getByText('Reports'));
    await waitFor(() => {
      expect(screen.getByText('Toxic behaviour')).toBeInTheDocument();
    });
  });
});
