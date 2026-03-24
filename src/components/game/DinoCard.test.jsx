import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DinoCard from './DinoCard';
import { mockCard } from '../../test/helpers/mockFixtures';

const card = {
  ...mockCard,
  id: '123',
  meaning: 'Tyrant Lizard King',
  imageUrl: null,
  height: 85,
  weight: 95,
  intelligence: 55,
  speed: 50,
  strength: 98,
};

describe('DinoCard', () => {
  it('renders card name and meaning', () => {
    render(<DinoCard card={card} />);
    expect(screen.getByText('T-Rex')).toBeInTheDocument();
    expect(screen.getByText('"Tyrant Lizard King"')).toBeInTheDocument();
  });

  it('renders diet and era tags', () => {
    render(<DinoCard card={card} />);
    expect(screen.getByText('Carnivore')).toBeInTheDocument();
    expect(screen.getByText('Cretaceous')).toBeInTheDocument();
  });

  it('renders all five stat values', () => {
    render(<DinoCard card={card} />);
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('95')).toBeInTheDocument();
    expect(screen.getByText('55')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('98')).toBeInTheDocument();
  });

  it('renders placeholder when no image', () => {
    render(<DinoCard card={card} />);
    expect(screen.getByText('DINO')).toBeInTheDocument();
  });

  it('renders nothing when card is null', () => {
    const { container } = render(<DinoCard card={null} />);
    expect(container.innerHTML).toBe('');
  });

});
