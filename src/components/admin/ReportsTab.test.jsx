import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReportsTab from './ReportsTab';

vi.mock('../../api/adminApi', () => ({
  getReports: vi.fn(),
  dismissReport: vi.fn(),
}));

import { getReports, dismissReport } from '../../api/adminApi';

const mockReports = [
  { id: 'r1', reporterId: 'user-1111-abcd-efgh', reportedUserId: 'user-2222-abcd-efgh', reason: 'Toxic behaviour', status: 'PENDING', createdAt: '2026-03-20T10:00:00Z' },
  { id: 'r2', reporterId: 'user-3333-abcd-efgh', reportedUserId: 'user-4444-abcd-efgh', reason: 'Cheating', status: 'DISMISSED', createdAt: '2026-03-21T10:00:00Z' },
];

describe('ReportsTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn(() => true);
    getReports.mockResolvedValue({ data: mockReports });
  });

  it('renders reports list after fetch', async () => {
    render(<ReportsTab />);

    expect(await screen.findByText('Toxic behaviour')).toBeInTheDocument();
    expect(screen.getByText('Cheating')).toBeInTheDocument();
  });

  it('shows dismiss button only for pending reports', async () => {
    render(<ReportsTab />);

    await waitFor(() => {
      const dismissButtons = screen.getAllByText('Dismiss');
      expect(dismissButtons).toHaveLength(1);
    });
  });

  it('calls dismissReport when dismiss confirmed', async () => {
    dismissReport.mockResolvedValue({ data: { ...mockReports[0], status: 'DISMISSED' } });

    render(<ReportsTab />);

    await waitFor(() => screen.getByText('Toxic behaviour'));

    fireEvent.click(screen.getByText('Dismiss'));

    await waitFor(() => {
      expect(dismissReport).toHaveBeenCalledWith('r1');
    });
  });
});
