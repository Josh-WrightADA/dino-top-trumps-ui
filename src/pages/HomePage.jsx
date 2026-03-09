import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '3rem' }}>
      <h1>Dino Top Trumps</h1>
      <p>Battle your friends with dinosaur cards!</p>
      {isAuthenticated ? (
        <Link to="/lobby">
          <button style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
            Go to Lobby
          </button>
        </Link>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
          <Link to="/login"><button>Login</button></Link>
          <Link to="/register"><button>Register</button></Link>
        </div>
      )}
    </div>
  );
}
