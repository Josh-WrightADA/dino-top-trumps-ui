import { Link } from 'react-router-dom';
import '../App.css';
import './NotFound.css';

export default function NotFoundPage() {
  return (
    <div className="page page--centered">
      <h1 className="page-heading heading--gradient">404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="btn not-found__back-btn">Back to Home</Link>
    </div>
  );
}
