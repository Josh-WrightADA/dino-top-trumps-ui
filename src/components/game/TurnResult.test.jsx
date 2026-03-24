import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TurnResult from './TurnResult';

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
    expect(screen.getByText('You lost this round.')).toBeInTheDocument();
  });

  it('displays card images when provided', () => {
    const p1Card = { name: 'T-Rex', imageUrl: 'http://example.com/trex.jpg' };
    const p2Card = { name: 'Stego', imageUrl: 'http://example.com/stego.jpg' };
    render(<TurnResult result={winResult} isPlayer1={true} player1Card={p1Card} player2Card={p2Card} onDismiss={() => {}} />);
    expect(screen.getByAltText('T-Rex')).toBeInTheDocument();
    expect(screen.getByAltText('Stego')).toBeInTheDocument();
  });

  it('shows card names when provided', () => {
    const p1Card = { name: 'T-Rex', imageUrl: '' };
    const p2Card = { name: 'Stego', imageUrl: '' };
    render(<TurnResult result={winResult} isPlayer1={true} player1Card={p1Card} player2Card={p2Card} onDismiss={() => {}} />);
    expect(screen.getByText('T-Rex')).toBeInTheDocument();
    expect(screen.getByText('Stego')).toBeInTheDocument();
  });

  it('shows Unknown when card props are missing', () => {
    render(<TurnResult result={winResult} isPlayer1={true} onDismiss={() => {}} />);
    const unknowns = screen.getAllByText('Unknown');
    expect(unknowns).toHaveLength(2);
  });

  it('auto-dismisses after 8 seconds', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<TurnResult result={winResult} isPlayer1={true} onDismiss={onDismiss} />);
    expect(onDismiss).not.toHaveBeenCalled();
    vi.advanceTimersByTime(8000);
    expect(onDismiss).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });

  it('renders auto-dismiss progress bar', () => {
    const { container } = render(<TurnResult result={winResult} isPlayer1={true} onDismiss={() => {}} />);
    expect(container.querySelector('.turn-result__auto-dismiss-bar')).toBeInTheDocument();
  });
});
