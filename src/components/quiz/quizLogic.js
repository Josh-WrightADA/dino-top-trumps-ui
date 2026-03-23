/**
 * Generates quiz questions from a deck of cards.
 * Picks `count` random cards for the session, each with 4 multiple-choice name options.
 */
export function generateQuizQuestions(cards, count = 10) {
  if (!cards || cards.length < 4) return [];

  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, cards.length));

  return selected.map((card) => {
    const distractors = cards
      .filter((c) => c.id !== card.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((c) => c.name);

    const choices = [...distractors, card.name].sort(() => Math.random() - 0.5);

    return {
      card,
      choices,
      correctAnswer: card.name,
    };
  });
}

/**
 * Calculates score for a single answer.
 */
export function calculateScore(isCorrect, usedHint) {
  if (!isCorrect) return 0;
  return usedHint ? 5 : 10;
}

/**
 * Returns a fun rank title based on total score.
 */
export function getRankTitle(score) {
  if (score >= 91) return 'Apex Palaeontologist';
  if (score >= 71) return 'Carnivore Expert';
  if (score >= 51) return 'Herbivore Scholar';
  if (score >= 31) return 'Hatchling Brain';
  return 'Fossil Fragment';
}
