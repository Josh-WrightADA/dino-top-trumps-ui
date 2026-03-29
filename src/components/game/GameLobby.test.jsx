import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('../../api/gameApi', () => ({
  createGame: vi.fn(),
  getAvailableGames: vi.fn(),
  joinGame: vi.fn(),
}));

vi.mock('../../hooks/usePolling', () => ({
  default: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: vi.fn() };
});

import GameLobby from './GameLobby';
import { createGame, joinGame } from '../../api/gameApi';
import usePolling from '../../hooks/usePolling';
import { useNavigate } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';

function renderLobby() {
  return render(
    <MemoryRouter>
      <GameLobby />
    </MemoryRouter>
  );
}

describe('GameLobby', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    usePolling.mockReturnValue({ data: [], loading: false });
  });

  it('renders available games from polling data', () => {
    usePolling.mockReturnValue({
      data: [
        { id: 'game-1', hostName: 'Alice' },
        { id: 'game-2', hostName: 'Bob' },
      ],
      loading: false,
    });

    renderLobby();

    expect(screen.getByText("Alice's Game")).toBeInTheDocument();
    expect(screen.getByText("Bob's Game")).toBeInTheDocument();
  });

  it('creates a game and navigates on success', async () => {
    createGame.mockResolvedValue({ data: { id: 'new-game-1' } });

    renderLobby();

    fireEvent.click(screen.getByText('Create Game'));

    await waitFor(() => {
      expect(createGame).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/game/new-game-1');
    });
  });

  it('shows error when join fails with 400', async () => {
    usePolling.mockReturnValue({
      data: [{ id: 'game-1', hostName: 'Alice' }],
      loading: false,
    });
    joinGame.mockRejectedValue({ response: { status: 400 } });

    renderLobby();

    const joinButtons = screen.getAllByText('Join');
    fireEvent.click(joinButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Cannot join this game. It may be full or your own.')).toBeInTheDocument();
    });
  });

  it('shows empty state when no games available', () => {
    usePolling.mockReturnValue({ data: [], loading: false });

    renderLobby();

    expect(screen.getByText('No battles waiting — be the first to enter the arena!')).toBeInTheDocument();
  });
});
