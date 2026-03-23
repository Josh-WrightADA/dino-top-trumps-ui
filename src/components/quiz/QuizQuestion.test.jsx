import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizQuestion from './QuizQuestion';

const mockQuestion = {
  card: {
    id: 'card-1',
    name: 'T-Rex',
    meaning: 'Tyrant Lizard',
    imageUrl: 'http://example.com/trex.jpg',
  },
  choices: ['Stegosaurus', 'T-Rex', 'Velociraptor', 'Triceratops'],
  correctAnswer: 'T-Rex',
};

describe('QuizQuestion', () => {
  it('renders all four choices', () => {
    render(<QuizQuestion question={mockQuestion} onAnswer={vi.fn()} />);
    expect(screen.getByText('Stegosaurus')).toBeInTheDocument();
    expect(screen.getByText('T-Rex')).toBeInTheDocument();
    expect(screen.getByText('Velociraptor')).toBeInTheDocument();
    expect(screen.getByText('Triceratops')).toBeInTheDocument();
  });

  it('calls onAnswer when a choice is clicked', () => {
    const onAnswer = vi.fn();
    render(<QuizQuestion question={mockQuestion} onAnswer={onAnswer} />);
    fireEvent.click(screen.getByText('T-Rex'));
    expect(onAnswer).toHaveBeenCalledWith('T-Rex', false);
  });

  it('shows hint when hint button is clicked', () => {
    render(<QuizQuestion question={mockQuestion} onAnswer={vi.fn()} />);
    fireEvent.click(screen.getByText('Show Hint (reduces points)'));
    expect(screen.getByText(/Tyrant Lizard/)).toBeInTheDocument();
  });

  it('passes hintUsed=true when answering after hint', () => {
    const onAnswer = vi.fn();
    render(<QuizQuestion question={mockQuestion} onAnswer={onAnswer} />);
    fireEvent.click(screen.getByText('Show Hint (reduces points)'));
    fireEvent.click(screen.getByText('T-Rex'));
    expect(onAnswer).toHaveBeenCalledWith('T-Rex', true);
  });

  it('disables choices after answering', () => {
    const onAnswer = vi.fn();
    render(<QuizQuestion question={mockQuestion} onAnswer={onAnswer} />);
    fireEvent.click(screen.getByText('T-Rex'));
    fireEvent.click(screen.getByText('Stegosaurus'));
    expect(onAnswer).toHaveBeenCalledOnce();
  });
});
