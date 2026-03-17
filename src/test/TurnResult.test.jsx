import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TurnResult from '../components/game/TurnResult';

describe('TurnResult', () => {
  const winResult = {
    chosenStat: 'STRENGTH',
    player1StatValue: 98,
    player2StatValue: 40,
    winnerPlayerId: 'player1-id',
    activePlayerId: 'player1-id',
  };

  const loseResult = {
    chosenStat: 'SPEED',
    player1StatValue: 50,
    player2StatValue: 90,
    winnerPlayerId: 'player2-id',
    activePlayerId: 'player1-id',
  };

  const drawResult = {
    chosenStat: 'INTELLIGENCE',
    player1StatValue: 55,
    player2StatValue: 55,
    winnerPlayerId: null,
    activePlayerId: 'player1-id',
  };

  it('shows winning message when your score is higher', () => {
    render(<TurnResult result={winResult} isPlayer1={true} onDismiss={() => {}} />);
    expect(screen.getByText('You won this round!')).toBeInTheDocument();
    expect(screen.getByText('98')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
  });

  it('shows losing message when opponent score is higher', () => {
    render(<TurnResult result={loseResult} isPlayer1={true} onDismiss={() => {}} />);
    expect(screen.getByText('You lost this round.')).toBeInTheDocument();
  });

  it('shows draw message when scores are equal', () => {
    render(<TurnResult result={drawResult} isPlayer1={true} onDismiss={() => {}} />);
    expect(screen.getByText('Draw! Both keep their cards.')).toBeInTheDocument();
  });

  it('displays the chosen stat', () => {
    render(<TurnResult result={winResult} isPlayer1={true} onDismiss={() => {}} />);
    expect(screen.getByText('STRENGTH')).toBeInTheDocument();
  });

  it('calls onDismiss when continue button is clicked', () => {
    const onDismiss = vi.fn();
    render(<TurnResult result={winResult} isPlayer1={true} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByText('Continue'));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('renders nothing when result is null', () => {
    const { container } = render(<TurnResult result={null} isPlayer1={true} onDismiss={() => {}} />);
    expect(container.innerHTML).toBe('');
  });

  it('swaps scores correctly for player2 perspective', () => {
    render(<TurnResult result={winResult} isPlayer1={false} onDismiss={() => {}} />);
    // Player2 sees player2StatValue as "You" and player1StatValue as "Opponent"
    expect(screen.getByText('You lost this round.')).toBeInTheDocument();
  });
});
