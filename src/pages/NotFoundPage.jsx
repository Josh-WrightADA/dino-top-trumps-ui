import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '3rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">
        <button style={{ marginTop: '1rem' }}>Back to Home</button>
      </Link>
    </div>
  );
}
