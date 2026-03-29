import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import UsersTab from './UsersTab';

vi.mock('../../api/adminApi', () => ({
  getUsers: vi.fn(),
  banUser: vi.fn(),
  unbanUser: vi.fn(),
}));

vi.mock('../rank/RankBadge', () => ({
  default: ({ tierKey }) => <span data-testid="rank-badge">{tierKey}</span>,
}));

import { getUsers } from '../../api/adminApi';

const mockUsers = [
  { id: 'u1', username: 'admin1', displayName: 'Admin One', role: 'ADMIN', status: 'ACTIVE', leaguePoints: 500, rankTier: 'APEX', gamesPlayed: 20 },
  { id: 'u2', username: 'player1', displayName: 'Player One', role: 'PLAYER', status: 'ACTIVE', leaguePoints: 100, rankTier: 'HERBIVORE', gamesPlayed: 5 },
  { id: 'u3', username: 'banned1', displayName: 'Banned One', role: 'PLAYER', status: 'BANNED', leaguePoints: 50, rankTier: 'HERBIVORE', gamesPlayed: 3 },
];

describe('UsersTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getUsers.mockResolvedValue({ data: mockUsers });
  });

  it('renders user list after fetch', async () => {
    render(<UsersTab />);

    expect(await screen.findByText('Admin One')).toBeInTheDocument();
    expect(screen.getByText('Player One')).toBeInTheDocument();
    expect(screen.getByText('Banned One')).toBeInTheDocument();
  });

  it('shows ban button for active non-admin users', async () => {
    render(<UsersTab />);

    await waitFor(() => {
      const banButtons = screen.getAllByText('Ban');
      expect(banButtons).toHaveLength(1);
    });
  });

  it('hides ban button for admin users', async () => {
    getUsers.mockResolvedValue({ data: [mockUsers[0]] });

    render(<UsersTab />);

    await waitFor(() => {
      expect(screen.getByText('Admin One')).toBeInTheDocument();
    });

    expect(screen.queryByText('Ban')).not.toBeInTheDocument();
    expect(screen.queryByText('Unban')).not.toBeInTheDocument();
  });

  it('shows unban button for banned users', async () => {
    render(<UsersTab />);

    await waitFor(() => {
      const unbanButtons = screen.getAllByText('Unban');
      expect(unbanButtons).toHaveLength(1);
    });
  });
});
