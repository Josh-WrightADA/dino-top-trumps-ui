import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizSummary from './QuizSummary';

const mockResults = [
  { isCorrect: true, usedHint: false, score: 10, cardName: 'T-Rex' },
  { isCorrect: true, usedHint: true, score: 5, cardName: 'Velociraptor' },
  { isCorrect: false, usedHint: false, score: 0, cardName: 'Stegosaurus' },
];

describe('QuizSummary', () => {
  it('displays total score', () => {
    render(<QuizSummary totalScore={15} results={mockResults} totalRounds={3} onRestart={vi.fn()} />);
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('/ 30')).toBeInTheDocument();
  });

  it('displays correct count', () => {
    render(<QuizSummary totalScore={15} results={mockResults} totalRounds={3} onRestart={vi.fn()} />);
    expect(screen.getByText('2 of 3 correct')).toBeInTheDocument();
  });

  it('displays rank title', () => {
    render(<QuizSummary totalScore={75} results={mockResults} totalRounds={10} onRestart={vi.fn()} />);
    expect(screen.getByText('Carnivore Expert')).toBeInTheDocument();
  });

  it('calls onRestart when play again is clicked', () => {
    const onRestart = vi.fn();
    render(<QuizSummary totalScore={15} results={mockResults} totalRounds={3} onRestart={onRestart} />);
    fireEvent.click(screen.getByText('Play Again'));
    expect(onRestart).toHaveBeenCalledOnce();
  });
});
