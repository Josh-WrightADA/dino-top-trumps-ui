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

  it('uses small size by default (20px)', () => {
    render(<RankBadge tierKey="METEOR" />);
    const img = screen.getByAltText('Meteor badge');
    expect(img.style.width).toBe('20px');
    expect(img.style.height).toBe('20px');
  });

  it('uses medium size when specified (28px)', () => {
    render(<RankBadge tierKey="METEOR" size="medium" />);
    const img = screen.getByAltText('Meteor badge');
    expect(img.style.width).toBe('28px');
    expect(img.style.height).toBe('28px');
  });

  it('uses large size when specified (36px)', () => {
    render(<RankBadge tierKey="METEOR" size="large" />);
    const img = screen.getByAltText('Meteor badge');
    expect(img.style.width).toBe('36px');
    expect(img.style.height).toBe('36px');
  });
});
