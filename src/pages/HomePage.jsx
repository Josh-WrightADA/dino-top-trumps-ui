import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Home.css';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page home-page">
      <h1>Dino Top Trumps</h1>
      <p>Battle your friends with dinosaur cards!</p>
      {isAuthenticated ? (
        <Link to="/lobby">
          <button className="home-page__cta">
            Go to Lobby
          </button>
        </Link>
      ) : (
        <div className="home-page__auth-buttons">
          <Link to="/login"><button>Login</button></Link>
          <Link to="/register"><button>Register</button></Link>
        </div>
      )}
    </div>
  );
}
