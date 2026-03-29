import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CardStats from './CardStats';
import { mockCard } from '../../test/helpers/mockFixtures';

describe('CardStats', () => {
  it('renders all five stats', () => {
    render(<CardStats card={mockCard} />);

    expect(screen.getByText('height')).toBeInTheDocument();
    expect(screen.getByText('weight')).toBeInTheDocument();
    expect(screen.getByText('intelligence')).toBeInTheDocument();
    expect(screen.getByText('speed')).toBeInTheDocument();
    expect(screen.getByText('strength')).toBeInTheDocument();
  });

  it('highlights the selected stat with highlighted class', () => {
    render(<CardStats card={mockCard} highlightStat="speed" />);

    const speedLabel = screen.getByText('speed');
    const statDiv = speedLabel.closest('.dino-card__stat');
    expect(statDiv).toHaveClass('dino-card__stat--highlighted');

    const heightLabel = screen.getByText('height');
    const heightDiv = heightLabel.closest('.dino-card__stat');
    expect(heightDiv).not.toHaveClass('dino-card__stat--highlighted');
  });

  it('caps stat bar width at 100%', () => {
    const overflowCard = { ...mockCard, strength: 150 };
    render(<CardStats card={overflowCard} />);

    const strengthValue = screen.getByText('150');
    const statDiv = strengthValue.closest('.dino-card__stat');
    const fill = statDiv.querySelector('.dino-card__stat-fill');
    expect(fill.style.width).toBe('100%');
  });
});
