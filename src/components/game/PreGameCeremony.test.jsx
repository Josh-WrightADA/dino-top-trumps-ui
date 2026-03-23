import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import PreGameCeremony from './PreGameCeremony';

vi.mock('../../api/authApi', () => ({
  getPublicProfile: vi.fn(),
}));

vi.mock('../rank/RankBadge', () => ({
  default: ({ tierKey }) => <span data-testid="rank-badge">{tierKey}</span>,
}));

import { getPublicProfile } from '../../api/authApi';

describe('PreGameCeremony', () => {
  const defaultProps = {
    opponentId: 'opp-1',
    currentTurnPlayerId: 'me-1',
    currentPlayerId: 'me-1',
    onComplete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    getPublicProfile.mockResolvedValue({
      data: {
        displayName: 'DinoKing',
        avatarUrl: 'http://example.com/avatar.jpg',
        bio: 'I love dinosaurs',
        rankTier: 'CARNIVORE',
        leaguePoints: 50,
      },
    });
  });

  it('shows opponent label in stage 1', async () => {
    render(<PreGameCeremony {...defaultProps} />);
    expect(screen.getByText(/your opponent is/i)).toBeInTheDocument();
  });

  it('fetches opponent profile on mount', async () => {
    render(<PreGameCeremony {...defaultProps} />);
    await waitFor(() => {
      expect(getPublicProfile).toHaveBeenCalledWith('opp-1');
    });
  });

  it('displays opponent name when profile loads', async () => {
    render(<PreGameCeremony {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('DinoKing')).toBeInTheDocument();
    });
  });

  it('shows start game button in final stage', async () => {
    // Render and fast-forward through stages using act
    vi.useFakeTimers();
    render(<PreGameCeremony {...defaultProps} />);

    // Resolve the profile fetch
    await act(async () => {
      await Promise.resolve();
    });

    // Advance through stage 1 → 2
    act(() => { vi.advanceTimersByTime(3000); });
    // Advance through stage 2 → 3
    act(() => { vi.advanceTimersByTime(3000); });

    expect(screen.getByText(/start game/i)).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('calls onComplete when start button clicked', async () => {
    vi.useFakeTimers();
    render(<PreGameCeremony {...defaultProps} />);

    await act(async () => { await Promise.resolve(); });
    act(() => { vi.advanceTimersByTime(3000); });
    act(() => { vi.advanceTimersByTime(3000); });

    fireEvent.click(screen.getByText(/start game/i));
    expect(defaultProps.onComplete).toHaveBeenCalledOnce();

    vi.useRealTimers();
  });
});
