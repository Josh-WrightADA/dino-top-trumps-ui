export const mockCard = {
  id: 'card-1',
  name: 'T-Rex',
  meaning: 'Tyrant Lizard',
  diet: 'Carnivore',
  era: 'Cretaceous',
  imageUrl: 'http://example.com/trex.jpg',
  description: 'The king of dinosaurs',
  funFact: 'Had the strongest bite force of any land animal',
  height: 85,
  weight: 90,
  intelligence: 40,
  speed: 30,
  strength: 95,
};

export const mockCards = Array.from({ length: 10 }, (_, i) => ({
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

export const mockUser = {
  username: 'testuser',
  displayName: 'Test User',
  avatarUrl: '',
  bio: null,
  favouriteCardId: null,
  role: 'PLAYER',
  leaguePoints: 50,
  gamesPlayed: 10,
  gamesWon: 6,
  rankTier: 'CARNIVORE',
};
