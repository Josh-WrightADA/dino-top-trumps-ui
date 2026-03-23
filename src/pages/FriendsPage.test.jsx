import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import FriendsPage from './FriendsPage';
import { renderWithRouter } from '../test/helpers/renderHelpers';

vi.mock('../api/socialApi', () => ({
  getFriends: vi.fn(),
  getPendingRequests: vi.fn(),
  getPendingInvites: vi.fn(),
  acceptFriendRequest: vi.fn(),
  declineFriendRequest: vi.fn(),
  removeFriend: vi.fn(),
  acceptGameInvite: vi.fn(),
  declineGameInvite: vi.fn(),
}));

vi.mock('../hooks/useAuth', () => ({
  default: () => ({
    isAuthenticated: true,
    user: { username: 'testuser', id: 'user-1' },
  }),
}));

import { getFriends, getPendingRequests, getPendingInvites, acceptFriendRequest, declineFriendRequest } from '../api/socialApi';

describe('FriendsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty states when no data', async () => {
    getFriends.mockResolvedValue({ data: [] });
    getPendingRequests.mockResolvedValue({ data: [] });
    getPendingInvites.mockResolvedValue({ data: [] });

    renderWithRouter(<FriendsPage />);
    await waitFor(() => {
      expect(screen.getByText(/no pending friend requests/i)).toBeInTheDocument();
      expect(screen.getByText(/no friends yet/i)).toBeInTheDocument();
    });
  });

  it('renders pending requests with accept/decline buttons', async () => {
    getFriends.mockResolvedValue({ data: [] });
    getPendingRequests.mockResolvedValue({ data: [
      { id: 'fr-1', requesterId: 'user-2', addresseeId: 'user-1', status: 'PENDING', createdAt: '2026-03-20T10:00:00Z', updatedAt: '2026-03-20T10:00:00Z' },
    ] });
    getPendingInvites.mockResolvedValue({ data: [] });

    renderWithRouter(<FriendsPage />);
    await waitFor(() => {
      expect(screen.getByText('Accept')).toBeInTheDocument();
      expect(screen.getByText('Decline')).toBeInTheDocument();
    });
  });

  it('accepts a friend request', async () => {
    getFriends.mockResolvedValue({ data: [] });
    getPendingRequests.mockResolvedValue({ data: [
      { id: 'fr-1', requesterId: 'user-2', addresseeId: 'user-1', status: 'PENDING', createdAt: '2026-03-20T10:00:00Z', updatedAt: '2026-03-20T10:00:00Z' },
    ] });
    getPendingInvites.mockResolvedValue({ data: [] });
    acceptFriendRequest.mockResolvedValue({ data: { id: 'fr-1', status: 'ACCEPTED' } });

    renderWithRouter(<FriendsPage />);
    await waitFor(() => screen.getByText('Accept'));
    fireEvent.click(screen.getByText('Accept'));
    await waitFor(() => {
      expect(acceptFriendRequest).toHaveBeenCalledWith('fr-1');
    });
  });

  it('declines a friend request', async () => {
    getFriends.mockResolvedValue({ data: [] });
    getPendingRequests.mockResolvedValue({ data: [
      { id: 'fr-1', requesterId: 'user-2', addresseeId: 'user-1', status: 'PENDING', createdAt: '2026-03-20T10:00:00Z', updatedAt: '2026-03-20T10:00:00Z' },
    ] });
    getPendingInvites.mockResolvedValue({ data: [] });
    declineFriendRequest.mockResolvedValue({ data: { id: 'fr-1', status: 'DECLINED' } });

    renderWithRouter(<FriendsPage />);
    await waitFor(() => screen.getByText('Decline'));
    fireEvent.click(screen.getByText('Decline'));
    await waitFor(() => {
      expect(declineFriendRequest).toHaveBeenCalledWith('fr-1');
    });
  });
});
