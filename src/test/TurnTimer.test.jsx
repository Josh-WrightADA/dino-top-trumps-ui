import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import TurnTimer from '../components/game/TurnTimer';

describe('TurnTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when turnDeadline is null', () => {
    const { container } = render(<TurnTimer turnDeadline={null} isYourTurn={true} />);
    expect(container.innerHTML).toBe('');
  });

  it('displays seconds remaining until deadline', () => {
    const deadline = new Date(Date.now() + 25000).toISOString();
    render(<TurnTimer turnDeadline={deadline} isYourTurn={true} />);
    expect(screen.getByText('25s')).toBeInTheDocument();
  });

  it('shows "Time left" when it is your turn', () => {
    const deadline = new Date(Date.now() + 20000).toISOString();
    render(<TurnTimer turnDeadline={deadline} isYourTurn={true} />);
    expect(screen.getByText('Time left')).toBeInTheDocument();
  });

  it('shows "Opponent time" when it is not your turn', () => {
    const deadline = new Date(Date.now() + 20000).toISOString();
    render(<TurnTimer turnDeadline={deadline} isYourTurn={false} />);
    expect(screen.getByText('Opponent time')).toBeInTheDocument();
  });

  it('counts down every second', () => {
    const deadline = new Date(Date.now() + 15000).toISOString();
    render(<TurnTimer turnDeadline={deadline} isYourTurn={true} />);
    expect(screen.getByText('15s')).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByText('14s')).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(3000); });
    expect(screen.getByText('11s')).toBeInTheDocument();
  });

  it('does not go below zero', () => {
    const deadline = new Date(Date.now() + 2000).toISOString();
    render(<TurnTimer turnDeadline={deadline} isYourTurn={true} />);

    act(() => { vi.advanceTimersByTime(5000); });
    expect(screen.getByText('0s')).toBeInTheDocument();
  });

  it('applies urgent class at 10 seconds', () => {
    const deadline = new Date(Date.now() + 10000).toISOString();
    const { container } = render(<TurnTimer turnDeadline={deadline} isYourTurn={true} />);
    expect(container.firstChild.classList.contains('turn-timer--urgent')).toBe(true);
  });

  it('applies critical class at 5 seconds', () => {
    const deadline = new Date(Date.now() + 5000).toISOString();
    const { container } = render(<TurnTimer turnDeadline={deadline} isYourTurn={true} />);
    expect(container.firstChild.classList.contains('turn-timer--critical')).toBe(true);
  });
});
