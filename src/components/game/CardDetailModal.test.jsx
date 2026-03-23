import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CardDetailModal from './CardDetailModal';
import { mockCard } from '../../test/helpers/mockFixtures';

const card = {
  ...mockCard,
  id: '1',
  name: 'Tyrannosaurus Rex',
  meaning: 'Tyrant Lizard King',
  era: 'Late Cretaceous',
  description: 'The most fearsome predator to ever walk the Earth.',
  imageUrl: 'https://example.com/trex.jpg',
  height: 95,
  weight: 90,
  intelligence: 70,
  speed: 60,
  strength: 98,
};

describe('CardDetailModal', () => {
  it('renders nothing when card is null', () => {
    const { container } = render(<CardDetailModal card={null} onClose={() => {}} />);
    expect(container.innerHTML).toBe('');
  });

  it('displays the card name and meaning', () => {
    render(<CardDetailModal card={card} onClose={() => {}} />);
    expect(screen.getByText('Tyrannosaurus Rex')).toBeInTheDocument();
    expect(screen.getByText('"Tyrant Lizard King"')).toBeInTheDocument();
  });

  it('displays the card description', () => {
    render(<CardDetailModal card={card} onClose={() => {}} />);
    expect(screen.getByText('The most fearsome predator to ever walk the Earth.')).toBeInTheDocument();
  });

  it('displays diet and era tags', () => {
    render(<CardDetailModal card={card} onClose={() => {}} />);
    expect(screen.getByText('Carnivore')).toBeInTheDocument();
    expect(screen.getByText('Late Cretaceous')).toBeInTheDocument();
  });

  it('displays all five stats', () => {
    render(<CardDetailModal card={card} onClose={() => {}} />);
    expect(screen.getByText('95')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(screen.getByText('70')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
    expect(screen.getByText('98')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<CardDetailModal card={card} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(<CardDetailModal card={card} onClose={onClose} />);
    fireEvent.click(container.querySelector('.card-modal__backdrop'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders image when imageUrl is provided', () => {
    render(<CardDetailModal card={card} onClose={() => {}} />);
    const img = screen.getByAltText('Tyrannosaurus Rex');
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://example.com/trex.jpg');
  });
});
