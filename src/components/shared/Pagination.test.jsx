import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('renders page info text', () => {
    render(<Pagination page={0} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
  });

  it('disables Previous on first page', () => {
    render(<Pagination page={0} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByText('Previous')).toBeDisabled();
    expect(screen.getByText('Next')).toBeEnabled();
  });

  it('disables Next on last page', () => {
    render(<Pagination page={4} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByText('Next')).toBeDisabled();
    expect(screen.getByText('Previous')).toBeEnabled();
  });

  it('calls onPageChange with next page on Next click', () => {
    const onPageChange = vi.fn();
    render(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByText('Next'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange with previous page on Previous click', () => {
    const onPageChange = vi.fn();
    render(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByText('Previous'));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('applies custom className', () => {
    const { container } = render(
      <Pagination page={0} totalPages={3} onPageChange={() => {}} className="custom" />
    );
    expect(container.firstChild).toHaveClass('pagination', 'custom');
  });
});
