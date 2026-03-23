import { describe, it, expect } from 'vitest';
import { generateQuizQuestions, calculateScore, getRankTitle } from '../components/quiz/quizLogic';

const mockCards = Array.from({ length: 10 }, (_, i) => ({
  id: `card-${i}`,
  name: `Dino ${i}`,
  meaning: `Meaning ${i}`,
  diet: 'Carnivore',
  era: 'Cretaceous',
  imageUrl: `http://example.com/dino-${i}.jpg`,
  description: `Description ${i}`,
  funFact: `Fun fact ${i}`,
  height: 50 + i,
  weight: 50 + i,
  intelligence: 50 + i,
  speed: 50 + i,
  strength: 50 + i,
}));

describe('generateQuizQuestions', () => {
  it('generates the requested number of questions', () => {
    const questions = generateQuizQuestions(mockCards, 5);
    expect(questions).toHaveLength(5);
  });

  it('generates maximum available when count exceeds cards', () => {
    const questions = generateQuizQuestions(mockCards, 20);
    expect(questions).toHaveLength(10);
  });

  it('returns empty array when fewer than 4 cards', () => {
    const questions = generateQuizQuestions(mockCards.slice(0, 3), 5);
    expect(questions).toHaveLength(0);
  });

  it('each question has exactly 4 unique choices', () => {
    const questions = generateQuizQuestions(mockCards, 5);
    questions.forEach((q) => {
      expect(q.choices).toHaveLength(4);
      const unique = new Set(q.choices);
      expect(unique.size).toBe(4);
    });
  });

  it('correct answer is always among the choices', () => {
    const questions = generateQuizQuestions(mockCards, 10);
    questions.forEach((q) => {
      expect(q.choices).toContain(q.correctAnswer);
    });
  });
});

describe('calculateScore', () => {
  it('returns 10 for correct answer without hint', () => {
    expect(calculateScore(true, false)).toBe(10);
  });

  it('returns 5 for correct answer with hint', () => {
    expect(calculateScore(true, true)).toBe(5);
  });

  it('returns 0 for wrong answer', () => {
    expect(calculateScore(false, false)).toBe(0);
  });

  it('returns 0 for wrong answer even with hint', () => {
    expect(calculateScore(false, true)).toBe(0);
  });
});

describe('getRankTitle', () => {
  it('returns Fossil Fragment for low scores', () => {
    expect(getRankTitle(0)).toBe('Fossil Fragment');
    expect(getRankTitle(30)).toBe('Fossil Fragment');
  });

  it('returns Hatchling Brain for 31-50', () => {
    expect(getRankTitle(31)).toBe('Hatchling Brain');
    expect(getRankTitle(50)).toBe('Hatchling Brain');
  });

  it('returns Herbivore Scholar for 51-70', () => {
    expect(getRankTitle(51)).toBe('Herbivore Scholar');
    expect(getRankTitle(70)).toBe('Herbivore Scholar');
  });

  it('returns Carnivore Expert for 71-90', () => {
    expect(getRankTitle(71)).toBe('Carnivore Expert');
    expect(getRankTitle(90)).toBe('Carnivore Expert');
  });

  it('returns Apex Palaeontologist for 91+', () => {
    expect(getRankTitle(91)).toBe('Apex Palaeontologist');
    expect(getRankTitle(100)).toBe('Apex Palaeontologist');
  });
});
