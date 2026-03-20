export const RANK_TIERS = {
  HATCHLING: {
    label: 'Hatchling',
    badgeUrl: 'https://res.cloudinary.com/djnj9zlw3/image/upload/v1774032206/dino-top-trumps/badges/hatchling.png',
  },
  HERBIVORE: {
    label: 'Herbivore',
    badgeUrl: 'https://res.cloudinary.com/djnj9zlw3/image/upload/v1774032207/dino-top-trumps/badges/herbivore.jpg',
  },
  CARNIVORE: {
    label: 'Carnivore',
    badgeUrl: 'https://res.cloudinary.com/djnj9zlw3/image/upload/v1774032209/dino-top-trumps/badges/carnivore.png',
  },
  APEX: {
    label: 'Apex',
    badgeUrl: 'https://res.cloudinary.com/djnj9zlw3/image/upload/v1774032211/dino-top-trumps/badges/apex.png',
  },
  METEOR: {
    label: 'Meteor',
    badgeUrl: 'https://res.cloudinary.com/djnj9zlw3/image/upload/v1774032212/dino-top-trumps/badges/meteor.png',
  },
};

export function getRankTier(tierKey) {
  return RANK_TIERS[tierKey] || { label: tierKey, badgeUrl: null };
}
