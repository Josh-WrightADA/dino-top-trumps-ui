import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Leaderboard from '../components/leaderboard/Leaderboard';
import { vi } from 'vitest';

vi.mock('../api/gameApi', () => ({
  getLeaderboard: vi.fn(),
}));

vi.mock('../hooks/useAuth', () => ({
  default: () => ({ user: { id: 'user-1' } }),
}));

import { getLeaderboard } from '../api/gameApi';

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('Leaderboard', () => {
  it('calculates win rate correctly', async () => {
    getLeaderboard.mockResolvedValue({
      data: [
        { userId: 'user-1', username: 'player1', displayName: 'Player 1', eloRating: 1050, gamesPlayed: 10, gamesWon: 7, rankTier: 'CARNIVORE' },
        { userId: 'user-2', username: 'player2', displayName: 'Player 2', eloRating: 950, gamesPlayed: 10, gamesWon: 3, rankTier: 'HERBIVORE' },
      ],
    });

    renderWithRouter(<Leaderboard />);

    expect(await screen.findByText('70%')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
  });

  it('shows N/A for zero games played', async () => {
    getLeaderboard.mockResolvedValue({
      data: [
        { userId: 'user-3', username: 'newbie', displayName: 'Newbie', eloRating: 1000, gamesPlayed: 0, gamesWon: 0, rankTier: 'CARNIVORE' },
      ],
    });

    renderWithRouter(<Leaderboard />);

    expect(await screen.findByText('N/A')).toBeInTheDocument();
  });

  it('highlights current user row', async () => {
    getLeaderboard.mockResolvedValue({
      data: [
        { userId: 'user-1', username: 'me', displayName: 'Me', eloRating: 1100, gamesPlayed: 5, gamesWon: 4, rankTier: 'CARNIVORE' },
      ],
    });

    renderWithRouter(<Leaderboard />);

    const row = await screen.findByText('Me');
    expect(row.closest('tr')).toHaveClass('leaderboard-table__current-user');
  });
});
