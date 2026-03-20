import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AvatarPicker from '../components/profile/AvatarPicker';
import { DEFAULT_AVATARS } from '../constants/defaultAvatars';

vi.mock('../api/gameApi', () => ({
  getCards: vi.fn(() => Promise.resolve({
    data: [
      { id: '1', name: 'T-Rex', imageUrl: 'https://example.com/trex.jpg' },
      { id: '2', name: 'Stegosaurus', imageUrl: 'https://example.com/stego.jpg' },
    ],
  })),
}));

vi.mock('../api/authApi', () => ({
  setDinoAvatar: vi.fn(() => Promise.resolve({ data: { avatarUrl: 'https://example.com/avatar.png' } })),
}));

describe('AvatarPicker', () => {
  const onClose = vi.fn();
  const onSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the dialog with Portraits tab active by default', () => {
    render(<AvatarPicker onClose={onClose} onSelect={onSelect} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Portraits')).toBeInTheDocument();
    expect(screen.getByText('Card Art')).toBeInTheDocument();
  });

  it('shows all default portrait avatars on Portraits tab', () => {
    render(<AvatarPicker onClose={onClose} onSelect={onSelect} />);
    DEFAULT_AVATARS.forEach((avatar) => {
      expect(screen.getByTitle(avatar.name)).toBeInTheDocument();
    });
  });

  it('switches to Card Art tab and shows card images', async () => {
    render(<AvatarPicker onClose={onClose} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Card Art'));
    await waitFor(() => {
      expect(screen.getByTitle('T-Rex')).toBeInTheDocument();
      expect(screen.getByTitle('Stegosaurus')).toBeInTheDocument();
    });
  });

  it('hides portraits when Card Art tab is active', async () => {
    render(<AvatarPicker onClose={onClose} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Card Art'));
    await waitFor(() => {
      expect(screen.queryByTitle(DEFAULT_AVATARS[0].name)).not.toBeInTheDocument();
    });
  });

  it('calls onClose when close button is clicked', () => {
    render(<AvatarPicker onClose={onClose} onSelect={onSelect} />);
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls setDinoAvatar and onSelect when a portrait is clicked', async () => {
    const { setDinoAvatar } = await import('../api/authApi');
    render(<AvatarPicker onClose={onClose} onSelect={onSelect} />);
    fireEvent.click(screen.getByLabelText(`Select ${DEFAULT_AVATARS[0].name} as avatar`));
    await waitFor(() => {
      expect(setDinoAvatar).toHaveBeenCalledWith(DEFAULT_AVATARS[0].url);
      expect(onSelect).toHaveBeenCalledWith('https://example.com/avatar.png');
    });
  });
});
