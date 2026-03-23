import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './Navbar.css';
import '../profile/Avatar.css';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" onClick={closeMenu}>Dino Top Trumps</Link>
      <button
        className="navbar-hamburger"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        <span className="navbar-hamburger__bar" />
        <span className="navbar-hamburger__bar" />
        <span className="navbar-hamburger__bar" />
      </button>
      <div className={`navbar-links${menuOpen ? ' navbar-links--open' : ''}`}>
        <Link to="/about" onClick={closeMenu}>How to Play</Link>
        {isAuthenticated ? (
          <>
            <Link to="/lobby" onClick={closeMenu}>Lobby</Link>
            <Link to="/my-games" onClick={closeMenu}>My Games</Link>
            <Link to="/cards" onClick={closeMenu}>Cards</Link>
            <Link to="/quiz" onClick={closeMenu}>Quiz</Link>
            <Link to="/history" onClick={closeMenu}>History</Link>
            <Link to="/leaderboard" onClick={closeMenu}>Leaderboard</Link>
            <Link to="/profile" onClick={closeMenu}>Profile</Link>
            <Link to="/profile" className="navbar-user navbar-avatar navbar-avatar--link" onClick={closeMenu}>
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="avatar avatar--small" />
              ) : (
                <div className="avatar-placeholder avatar-placeholder--small">
                  {(user?.username || 'U').charAt(0)}
                </div>
              )}
              {user?.displayName || user?.username}
            </Link>
            <button onClick={handleLogout} className="navbar-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>Login</Link>
            <Link to="/register" onClick={closeMenu}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
