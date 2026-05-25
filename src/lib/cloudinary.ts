// Luxury Japandi minimal aesthetic fallback images from Unsplash
export const AES_MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80', // Ceramic vase
  'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80', // Oak chair
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', // Linen sofa
  'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80', // Minimal table
  'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', // Clay teapot
  'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80', // Ceramic bowls
  'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80', // Japandi light & shadow
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', // Minimal bedding
];

/**
 * Returns a random beautiful aesthetic placeholder image for category or product seeding.
 */
export function getAestheticPlaceholder(index?: number): string {
  if (index !== undefined && index >= 0 && index < AES_MOCK_IMAGES.length) {
    return AES_MOCK_IMAGES[index];
  }
  return AES_MOCK_IMAGES[Math.floor(Math.random() * AES_MOCK_IMAGES.length)];
}
