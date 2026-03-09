// TODO: Build out game over screen in Phase 2

export default function GameOver({ result }) {
  return (
    <div>
      <h2>Game Over</h2>
      {result ? (
        <>
          <p>Winner: {result.winner || 'N/A'}</p>
          <p>Score: {result.score || 'N/A'}</p>
        </>
      ) : (
        <p>No result data.</p>
      )}
      {/* TODO: Show final scores, play again button */}
    </div>
  );
}
