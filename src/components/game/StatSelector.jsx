// TODO: Build out stat selector UI in Phase 2

export default function StatSelector({ stats, onSelect }) {
  return (
    <div>
      <h3>Pick a Stat</h3>
      {/* TODO: Render stat buttons from the current card */}
      {stats ? (
        Object.entries(stats).map(([key, value]) => (
          <button key={key} onClick={() => onSelect(key)}>
            {key}: {value}
          </button>
        ))
      ) : (
        <p>No stats available.</p>
      )}
    </div>
  );
}
