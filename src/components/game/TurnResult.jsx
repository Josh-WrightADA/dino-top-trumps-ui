// TODO: Build out turn result display in Phase 2

export default function TurnResult({ result }) {
  if (!result) return null;

  return (
    <div>
      <h3>Turn Result</h3>
      <p>{result.winner ? `Winner: ${result.winner}` : 'Draw!'}</p>
      {/* TODO: Show detailed comparison */}
    </div>
  );
}
