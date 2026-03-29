import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GamesTab from './GamesTab';

vi.mock('../../api/adminApi', () => ({
  getAdminGames: vi.fn(),
  deleteGame: vi.fn(),
}));

import { getAdminGames, deleteGame } from '../../api/adminApi';

const mockGames = [
  { id: 'game-0001-abcd-efgh', status: 'WAITING', player1Id: 'user-1111-abcd-efgh', player2Id: null, createdAt: '2026-03-20T10:00:00Z' },
  { id: 'game-0002-abcd-efgh', status: 'IN_PROGRESS', player1Id: 'user-1111-abcd-efgh', player2Id: 'user-2222-abcd-efgh', createdAt: '2026-03-21T10:00:00Z' },
];

describe('GamesTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn(() => true);
    getAdminGames.mockResolvedValue({ data: mockGames });
  });

  it('renders games list after fetch', async () => {
    render(<GamesTab />);

    expect(await screen.findByText('WAITING')).toBeInTheDocument();
    expect(screen.getByText('IN_PROGRESS')).toBeInTheDocument();
  });

  it('calls deleteGame when delete confirmed', async () => {
    deleteGame.mockResolvedValue({});

    render(<GamesTab />);

    await waitFor(() => screen.getByText('WAITING'));

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteGame).toHaveBeenCalledWith('game-0001-abcd-efgh');
    });
  });

  it('shows empty state when no games', async () => {
    getAdminGames.mockResolvedValue({ data: [] });

    render(<GamesTab />);

    expect(await screen.findByText('No games found.')).toBeInTheDocument();
  });
});
