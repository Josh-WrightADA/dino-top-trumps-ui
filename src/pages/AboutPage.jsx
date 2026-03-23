import './About.css';

export default function AboutPage() {
  return (
    <div className="page about-page">
      <h1>How to Play</h1>
      <p>Dino Top Trumps is a two-player card game where you battle using dinosaur statistics.</p>

      <h2 className="about-page__section-heading">Rules</h2>
      <ol className="about-page__rules-list">
        <li>Each player is dealt half the deck at the start of the game.</li>
        <li>The active player chooses one stat to compare (height, weight, intelligence, speed, or strength).</li>
        <li>The player with the higher value for that stat wins both cards.</li>
        <li>If the values are equal, both cards go into a draw pile — the next winner takes all cards in the draw pile.</li>
        <li>The winner of each round keeps their turn and plays the next stat.</li>
        <li>The game ends when one player holds all the cards.</li>
      </ol>

      <h2 className="about-page__section-heading">Ranked Progression</h2>
      <p>Win games to earn League Points (LP). Reach 100 LP to promote to the next tier.</p>

      <div className="about-page__tier-list">
        <div className="about-page__tier about-page__tier--hatchling">
          <span className="about-page__tier-name">Hatchling</span>
          <span className="about-page__tier-desc">Starting tier for all new players</span>
        </div>
        <div className="about-page__tier about-page__tier--herbivore">
          <span className="about-page__tier-name">Herbivore</span>
          <span className="about-page__tier-desc">Proving your knowledge of the prehistoric world</span>
        </div>
        <div className="about-page__tier about-page__tier--carnivore">
          <span className="about-page__tier-name">Carnivore</span>
          <span className="about-page__tier-desc">A formidable competitor in the arena</span>
        </div>
        <div className="about-page__tier about-page__tier--apex">
          <span className="about-page__tier-name">Apex</span>
          <span className="about-page__tier-desc">Among the most skilled players</span>
        </div>
        <div className="about-page__tier about-page__tier--meteor">
          <span className="about-page__tier-name">Meteor</span>
          <span className="about-page__tier-desc">Extinction-level dominance</span>
        </div>
      </div>

      <p className="about-page__tier-note">
        Win: +25 LP (more in your first 10 games). Loss: -15 LP.
        Promote at 100 LP. New players climb faster during placement matches.
      </p>
    </div>
  );
}
