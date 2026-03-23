import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GameOver from './GameOver';
import { renderWithRouter } from '../../test/helpers/renderHelpers';

describe('GameOver', () => {
  const wonGame = {
    winnerId: 'user-1',
    player1HandSize: 35,
    player2HandSize: 0,
    isPlayer1: true,
  };

  const lostGame = {
    winnerId: 'user-2',
    player1HandSize: 0,
    player2HandSize: 35,
    isPlayer1: true,
  };

  it('shows victory when user won', () => {
    renderWithRouter(<GameOver game={wonGame} userId="user-1" />);
    expect(screen.getByText('Victory!')).toBeInTheDocument();
    expect(screen.getByText('VICTORY')).toBeInTheDocument();
  });

  it('shows defeat when user lost', () => {
    renderWithRouter(<GameOver game={lostGame} userId="user-1" />);
    expect(screen.getByText('Defeat')).toBeInTheDocument();
    expect(screen.getByText('DEFEAT')).toBeInTheDocument();
  });

  it('shows new game and leaderboard links', () => {
    renderWithRouter(<GameOver game={wonGame} userId="user-1" />);
    expect(screen.getByText('New Game')).toBeInTheDocument();
    expect(screen.getByText('Lobby')).toBeInTheDocument();
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
  });

  it('renders nothing when game is null', () => {
    const { container } = renderWithRouter(<GameOver game={null} userId="user-1" />);
    expect(container.innerHTML).toBe('');
  });
});
