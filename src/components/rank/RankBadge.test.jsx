import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RankBadge from './RankBadge';

describe('RankBadge', () => {
  it('renders the tier label for a known tier', () => {
    render(<RankBadge tierKey="CARNIVORE" />);
    expect(screen.getByText('Carnivore')).toBeInTheDocument();
  });

  it('renders the badge image with correct alt text', () => {
    render(<RankBadge tierKey="APEX" />);
    const img = screen.getByAltText('Apex badge');
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('badges/apex');
  });

  it('renders all five tier badges', () => {
    const tiers = ['HATCHLING', 'HERBIVORE', 'CARNIVORE', 'APEX', 'METEOR'];
    const labels = ['Hatchling', 'Herbivore', 'Carnivore', 'Apex', 'Meteor'];
    tiers.forEach((tier, i) => {
      const { unmount } = render(<RankBadge tierKey={tier} />);
      expect(screen.getByText(labels[i])).toBeInTheDocument();
      unmount();
    });
  });

  it('falls back to tierKey as label for unknown tier', () => {
    render(<RankBadge tierKey="UNKNOWN_TIER" />);
    expect(screen.getByText('UNKNOWN_TIER')).toBeInTheDocument();
  });

  it('does not render an image for unknown tier', () => {
    const { container } = render(<RankBadge tierKey="UNKNOWN_TIER" />);
    expect(container.querySelector('img')).toBeNull();
  });

  it('uses small size class by default', () => {
    render(<RankBadge tierKey="METEOR" />);
    const img = screen.getByAltText('Meteor badge');
    expect(img).toHaveClass('rank-badge__icon--small');
  });

  it('uses medium size class when specified', () => {
    render(<RankBadge tierKey="METEOR" size="medium" />);
    const img = screen.getByAltText('Meteor badge');
    expect(img).toHaveClass('rank-badge__icon--medium');
  });

  it('uses large size class when specified', () => {
    render(<RankBadge tierKey="METEOR" size="large" />);
    const img = screen.getByAltText('Meteor badge');
    expect(img).toHaveClass('rank-badge__icon--large');
  });
});
