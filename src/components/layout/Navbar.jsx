import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './Navbar.css';
import '../profile/Avatar.css';
import '../../pages/Profile.css';

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
      <Link to="/" className="navbar-brand" onClick={closeMenu}>
        <img
          src="https://res.cloudinary.com/djnj9zlw3/image/upload/v1774360272/logo_igimhm.png"
          alt=""
          className="navbar-brand__logo"
        />
        Dino Top Trumps
      </Link>
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
        <NavLink to="/about" className="navbar-links__item" onClick={closeMenu}>How to Play</NavLink>
        {isAuthenticated ? (
          <>
            <NavLink to="/lobby" className="navbar-links__item" onClick={closeMenu}>Lobby</NavLink>
            <NavLink to="/my-games" className="navbar-links__item" onClick={closeMenu}>My Games</NavLink>
            <NavLink to="/cards" className="navbar-links__item" onClick={closeMenu}>Cards</NavLink>
            <NavLink to="/quiz" className="navbar-links__item" onClick={closeMenu}>Quiz</NavLink>
            <NavLink to="/history" className="navbar-links__item" onClick={closeMenu}>History</NavLink>
            <NavLink to="/leaderboard" className="navbar-links__item" onClick={closeMenu}>Leaderboard</NavLink>
            <NavLink to="/friends" className="navbar-links__item" onClick={closeMenu}>Friends</NavLink>
            {user?.role === 'ADMIN' && (
              <NavLink to="/admin" className="navbar-links__item" onClick={closeMenu}>Admin</NavLink>
            )}
            <NavLink to="/profile" className="navbar-user navbar-avatar navbar-avatar--link" onClick={closeMenu}>
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={`${user.displayName || user.username} avatar`} className="avatar avatar--small" />
              ) : (
                <div className="avatar-placeholder avatar-placeholder--small">
                  {(user?.username || 'U').charAt(0)}
                </div>
              )}
              {user?.displayName || user?.username}
              {user?.role === 'ADMIN' && (
                <span className="profile__admin-badge">ADMIN</span>
              )}
            </NavLink>
            <button onClick={handleLogout} className="navbar-logout">Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="navbar-links__item" onClick={closeMenu}>Login</NavLink>
            <NavLink to="/register" className="navbar-links__item" onClick={closeMenu}>Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
