// TODO: Build out dino card display in Phase 2

export default function DinoCard({ card }) {
  if (!card) return null;

  return (
    <div className="dino-card">
      <h3>{card.name || 'Unknown Dino'}</h3>
      {/* TODO: Display dino image, stats, etc. */}
      <pre>{JSON.stringify(card, null, 2)}</pre>
    </div>
  );
}
