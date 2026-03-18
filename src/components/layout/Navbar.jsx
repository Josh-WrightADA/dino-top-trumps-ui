import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './Navbar.css';

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
            <Link to="/history">History</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/profile">Profile</Link>
            <span className="navbar-user">{user?.username}</span>
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
