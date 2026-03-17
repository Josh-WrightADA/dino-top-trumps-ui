import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StatSelector from '../components/game/StatSelector';

const mockCard = {
  height: 85,
  weight: 95,
  intelligence: 55,
  speed: 50,
  strength: 98,
};

describe('StatSelector', () => {
  it('renders all five stat buttons', () => {
    render(<StatSelector card={mockCard} onSelect={() => {}} />);
    expect(screen.getByText('HEIGHT')).toBeInTheDocument();
    expect(screen.getByText('WEIGHT')).toBeInTheDocument();
    expect(screen.getByText('INTELLIGENCE')).toBeInTheDocument();
    expect(screen.getByText('SPEED')).toBeInTheDocument();
    expect(screen.getByText('STRENGTH')).toBeInTheDocument();
  });

  it('displays stat values from the card', () => {
    render(<StatSelector card={mockCard} onSelect={() => {}} />);
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('98')).toBeInTheDocument();
  });

  it('calls onSelect with the correct stat when clicked', () => {
    const onSelect = vi.fn();
    render(<StatSelector card={mockCard} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('STRENGTH'));
    expect(onSelect).toHaveBeenCalledWith('STRENGTH');
  });

  it('disables buttons when disabled prop is true', () => {
    render(<StatSelector card={mockCard} onSelect={() => {}} disabled />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('renders nothing when card is null', () => {
    const { container } = render(<StatSelector card={null} onSelect={() => {}} />);
    expect(container.innerHTML).toBe('');
  });
});
