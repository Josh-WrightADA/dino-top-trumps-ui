import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getCards } from '../api/gameApi';
import './Home.css';

const FEATURE_ITEMS = [
  {
    key: 'battle',
    iconUrl: 'https://res.cloudinary.com/djnj9zlw3/image/upload/v1774360272/swords_aije99.png',
    title: 'Card Battles',
    description: 'Challenge opponents in real-time dinosaur duels.',
    link: '/lobby',
    requiresAuth: true,
  },
  {
    key: 'rank',
    iconUrl: 'https://res.cloudinary.com/djnj9zlw3/image/upload/v1774360272/trophy_ovchnj.png',
    title: 'Ranked Play',
    description: 'Climb from Hatchling to Meteor. Rise through the ranks.',
    link: '/leaderboard',
    requiresAuth: true,
  },
  {
    key: 'quiz',
    iconUrl: 'https://res.cloudinary.com/djnj9zlw3/image/upload/v1774360272/skullicon_jjvkzu.png',
    title: 'Dino Quiz',
    description: 'Test your prehistoric knowledge. 10 rounds, hints, fun facts.',
    link: '/quiz',
    requiresAuth: true,
  },
  {
    key: 'gallery',
    iconUrl: 'https://res.cloudinary.com/djnj9zlw3/image/upload/v1774360276/cards_qzkjju.png',
    title: 'Card Gallery',
    description: '36 unique dinosaurs. Browse stats, lore, and art.',
    link: '/cards',
    requiresAuth: true,
  },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [showcaseCards, setShowcaseCards] = useState([]);
  const [heroCards, setHeroCards] = useState([]);
  const featuresRef = useRef(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);

  useEffect(() => {
    getCards()
      .then((res) => {
        const cards = res.data;
        const shuffled = [...cards].sort(() => Math.random() - 0.5);
        setHeroCards(shuffled.slice(0, 3));
        setShowcaseCards(shuffled);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!featuresRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFeaturesVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(featuresRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home">
      {/* Atmospheric embers */}
      <div className="home__atmosphere" aria-hidden="true">
        <div className="home__ember home__ember--1" />
        <div className="home__ember home__ember--2" />
        <div className="home__ember home__ember--3" />
        <div className="home__ember home__ember--4" />
        <div className="home__ember home__ember--5" />
        <div className="home__ember home__ember--6" />
      </div>

      {/* Hero Section */}
      <section className="home__hero">
        <div className="home__hero-cards" aria-hidden="true">
          {heroCards.map((card, i) => (
            <div
              key={card.id}
              className={`home__hero-card home__hero-card--${i + 1}`}
            >
              <img src={card.imageUrl} alt="" className="home__hero-card-img" />
            </div>
          ))}
        </div>

        <div className="home__hero-content">
          <h1 className="home__title">
            <span className="home__title-line">Dino</span>
            <span className="home__title-line home__title-line--accent">Top Trumps</span>
          </h1>
          <p className="home__tagline">
            Collect. Battle. Dominate the prehistoric arena.
          </p>
          <div className="home__cta-group">
            {isAuthenticated ? (
              <Link to="/lobby" className="home__cta home__cta--primary">
                Enter the Arena
              </Link>
            ) : (
              <>
                <Link to="/register" className="home__cta home__cta--primary">
                  Join the Arena
                </Link>
                <Link to="/login" className="home__cta home__cta--secondary">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        <button
          className="home__scroll-hint"
          onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll to features"
        >
          <span className="home__scroll-chevron" />
        </button>
      </section>
      <section className="home__features" ref={featuresRef}>
        <div className="home__features-grid">
          {FEATURE_ITEMS.map((feature, i) => {
            const content = (
              <div className={`home__feature-card${featuresVisible ? ` home__feature-card--animate home__feature-card--delay-${i + 1}` : ''}`}>
                <span className="home__feature-icon" aria-hidden="true">
                  <img src={feature.iconUrl} alt="" className="home__feature-icon-img" />
                </span>
                <h3 className="home__feature-title">{feature.title}</h3>
                <p className="home__feature-desc">{feature.description}</p>
              </div>
            );

            if (feature.requiresAuth && !isAuthenticated) {
              return <div key={feature.key}>{content}</div>;
            }

            return (
              <Link key={feature.key} to={feature.link} className="home__feature-link">
                {content}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Card Showcase Marquee */}
      {showcaseCards.length > 0 && (
        <section className="home__showcase" aria-label="Dinosaur card showcase">
          <h2 className="home__showcase-heading">36 Dinosaurs. One Champion.</h2>
          <div className="home__marquee">
            <div className="home__marquee-track">
              {[...showcaseCards, ...showcaseCards].map((card, i) => (
                <div key={`${card.id}-${i}`} className="home__marquee-card">
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="home__marquee-img"
                    loading="lazy"
                  />
                  <span className="home__marquee-name">{card.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="home__marquee home__marquee--reverse">
            <div className="home__marquee-track home__marquee-track--reverse">
              {[...showcaseCards].reverse().concat([...showcaseCards].reverse()).map((card, i) => (
                <div key={`rev-${card.id}-${i}`} className="home__marquee-card">
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="home__marquee-img"
                    loading="lazy"
                  />
                  <span className="home__marquee-name">{card.name}</span>
                </div>
              ))}
            </div>
          </div>

          {isAuthenticated && (
            <Link to="/cards" className="home__showcase-link">
              Explore the full collection →
            </Link>
          )}
        </section>
      )}
    </div>
  );
}
