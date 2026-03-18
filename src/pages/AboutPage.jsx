export default function AboutPage() {
  return (
    <div className="page" style={{ maxWidth: '700px', margin: '0 auto', paddingTop: '2rem' }}>
      <h1>How to Play</h1>
      <p>Dino Top Trumps is a two-player card game where you battle using dinosaur statistics.</p>

      <h2 style={{ marginTop: '2rem' }}>Rules</h2>
      <ol style={{ lineHeight: '2' }}>
        <li>Each player is dealt half the deck at the start of the game.</li>
        <li>The active player chooses one stat to compare (height, weight, intelligence, speed, or strength).</li>
        <li>The player with the higher value for that stat wins both cards.</li>
        <li>If the values are equal, both cards go into a draw pile — the next winner takes all cards in the draw pile.</li>
        <li>The winner of each round keeps their turn and plays the next stat.</li>
        <li>The game ends when one player holds all the cards.</li>
      </ol>

      <h2 style={{ marginTop: '2rem' }}>ELO Rankings</h2>
      <p>
        After every game, both players ELO ratings are updated. Beating a higher-ranked opponent
        earns more points. Rankings are visible on the Leaderboard.
      </p>
    </div>
  );
}
