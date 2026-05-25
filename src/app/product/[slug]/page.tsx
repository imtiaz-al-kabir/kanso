import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlugAction } from '@/actions/productActions';
import { getAuthUser } from '@/lib/auth';
import ProductDetailsClient from '@/components/store/ProductDetailsClient';
import { getAestheticPlaceholder } from '@/lib/cloudinary';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const res = await getProductBySlugAction(slug);
  const user = await getAuthUser();

  if (!res.success || !res.product) {
    // If database product is missing and they request one of our aesthetic placeholders, 
    // let's serve a gorgeous mock fallback!
    const mocks: { [key: string]: any } = {
      'hasu-lounge-chair': {
        id: 'mock-1',
        name: 'Hasu Lounge Chair',
        slug: 'hasu-lounge-chair',
        description: 'The Hasu Lounge Chair blends Scandinavian functionality with Japanese minimalism. Crafted with a solid sustainable solid oak frame and upholstered in a luxurious premium textured rough linen fabric. Features an angled silhouette designed for perfect ergonomic comfort and tactile reassurance.',
        price: 890,
        originalPrice: 1100,
        images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'],
        category: { name: 'Furniture', slug: 'furniture' },
        countInStock: 8,
        variants: ['Ash White Oak', 'Charcoal Oak'],
        rating: 4.9,
        numReviews: 4,
      },
      'enso-ceramic-tea-set': {
        id: 'mock-2',
        name: 'Enso Ceramic Tea Set',
        slug: 'enso-ceramic-tea-set',
        description: 'Hand-thrown clay teaware designed to honor the traditional tea rituals. Featuring a warm beige textured volcanic clay body, finished with a subtle semi-matte ivory glaze. Includes one tea kettle with organic woven rattan handle and four matching cups.',
        price: 180,
        originalPrice: null,
        images: ['https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80'],
        category: { name: 'Ceramics', slug: 'ceramics' },
        countInStock: 15,
        variants: ['Sanded Beige', 'Volcanic Ash'],
        rating: 4.8,
        numReviews: 3,
      },
      'kyoto-pendant-lantern': {
        id: 'mock-3',
        name: 'Kyoto Pendant Lantern',
        slug: 'kyoto-pendant-lantern',
        description: 'A beautiful atmospheric suspension light crafted from delicate, handmade organic mulberry paper over a thin structural bamboo rib framework. Spreads a soft, warm ambient diffuse glow, casting subtle line patterns onto nearby surfaces.',
        price: 340,
        originalPrice: 420,
        images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80'],
        category: { name: 'Lighting', slug: 'lighting' },
        countInStock: 3,
        variants: ['Washi Ivory', 'Sanded Sand'],
        rating: 5.0,
        numReviews: 8,
      },
      'wabi-stoneware-vase': {
        id: 'mock-4',
        name: 'Wabi Stoneware Vase',
        slug: 'wabi-stoneware-vase',
        description: 'An elegant textured volcanic stoneware vase. Modeled with irregular organic shapes celebrating wabi-sabi philosophy: the beauty found in natural aging, handcraft, and asymmetry.',
        price: 120,
        originalPrice: 150,
        images: ['https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80'],
        category: { name: 'Ceramics', slug: 'ceramics' },
        countInStock: 12,
        variants: ['Volcanic Black', 'Chalk Clay'],
        rating: 4.7,
        numReviews: 2,
      }
    };

    const mockItem = mocks[slug];
    if (mockItem) {
      const mockRelated = Object.values(mocks)
        .filter(m => m.slug !== slug)
        .map(m => ({
          id: m.id,
          name: m.name,
          slug: m.slug,
          price: m.price,
          originalPrice: m.originalPrice || null,
          images: m.images,
          rating: m.rating,
          categoryName: m.category?.name || 'Store',
          countInStock: m.countInStock || 10,
        }));

      const mockReviews = [
        { id: 'r1', username: 'Aria Nielsen', rating: 5, comment: 'Breathtaking quality. The texture feels organic and incredibly premium in my living room.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
        { id: 'r2', username: 'Kenji Sato', rating: 4, comment: 'Minimalistic design at its absolute finest. Packing was exceptional.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString() }
      ].slice(0, mockItem.numReviews);

      return (
        <ProductDetailsClient
          product={mockItem}
          related={mockRelated}
          reviews={mockReviews}
          user={user}
        />
      );
    }
    
    return notFound();
  }

  const product = res.product;
  const related = res.related || [];
  const reviews = res.reviews || [];

  return (
    <ProductDetailsClient
      product={product as any}
      related={related}
      reviews={reviews}
      user={user}
    />
  );
}
