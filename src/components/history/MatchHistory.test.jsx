import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import MatchHistory from './MatchHistory';
import { renderWithRouter } from '../../test/helpers/renderHelpers';

vi.mock('../../api/gameApi', () => ({
  getMatchHistory: vi.fn(),
}));

vi.mock('../../hooks/useAuth', () => ({
  default: () => ({ user: { id: 'user-1' } }),
}));

import { getMatchHistory } from '../../api/gameApi';

describe('MatchHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders match list after fetch', async () => {
    getMatchHistory.mockResolvedValue({
      data: [
        { gameId: 'g1', opponentId: 'opp-1', opponentName: 'Alice', winnerId: 'user-1', createdAt: '2026-03-20T10:00:00Z' },
        { gameId: 'g2', opponentId: 'opp-2', opponentName: 'Bob', winnerId: 'opp-2', createdAt: '2026-03-21T10:00:00Z' },
      ],
    });

    renderWithRouter(<MatchHistory />);

    expect(await screen.findByText('vs Alice')).toBeInTheDocument();
    expect(screen.getByText('vs Bob')).toBeInTheDocument();
  });

  it('shows WIN when user is winner', async () => {
    getMatchHistory.mockResolvedValue({
      data: [
        { gameId: 'g1', opponentId: 'opp-1', opponentName: 'Alice', winnerId: 'user-1', createdAt: '2026-03-20T10:00:00Z' },
      ],
    });

    renderWithRouter(<MatchHistory />);

    expect(await screen.findByText('WIN')).toBeInTheDocument();
  });

  it('shows LOSS when user is not winner', async () => {
    getMatchHistory.mockResolvedValue({
      data: [
        { gameId: 'g1', opponentId: 'opp-1', opponentName: 'Alice', winnerId: 'opp-1', createdAt: '2026-03-20T10:00:00Z' },
      ],
    });

    renderWithRouter(<MatchHistory />);

    expect(await screen.findByText('LOSS')).toBeInTheDocument();
  });

  it('shows empty state when no matches', async () => {
    getMatchHistory.mockResolvedValue({ data: [] });

    renderWithRouter(<MatchHistory />);

    expect(await screen.findByText('No matches played yet.')).toBeInTheDocument();
  });
});
