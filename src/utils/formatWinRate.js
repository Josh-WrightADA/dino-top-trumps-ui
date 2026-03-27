export function formatWinRate(gamesWon, gamesPlayed) {
  if (!gamesPlayed) return 'N/A';
  return `${Math.round((gamesWon / gamesPlayed) * 100)}%`;
}
