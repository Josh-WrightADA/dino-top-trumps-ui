import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './Navbar.css';
import '../profile/Avatar.css';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Dino Top Trumps</Link>
      <div className="navbar-links">
        <Link to="/about">How to Play</Link>
        {isAuthenticated ? (
          <>
            <Link to="/lobby">Lobby</Link>
            <Link to="/my-games">My Games</Link>
            <Link to="/cards">Cards</Link>
            <Link to="/quiz">Quiz</Link>
            <Link to="/history">History</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/profile" className="navbar-user navbar-avatar" style={{ textDecoration: 'none', color: 'inherit' }}>
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
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
