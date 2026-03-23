import { Link } from 'react-router-dom';
import '../App.css';

export default function NotFoundPage() {
  return (
    <div className="page page--centered">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">
        <button className="not-found__back-btn">Back to Home</button>
      </Link>
    </div>
  );
}
