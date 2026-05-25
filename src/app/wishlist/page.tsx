'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useStore } from '@/providers/StoreProvider';
import { useToast } from '@/providers/ToastProvider';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/store/ProductCard';

// Mock visual products to match our seed showcase if no DB products loaded
const MOCK_PRODUCTS: { [key: string]: any } = {
  'mock-1': {
    id: 'mock-1',
    name: 'Hasu Lounge Chair',
    slug: 'hasu-lounge-chair',
    price: 890,
    originalPrice: 1100,
    images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80'],
    categoryName: 'Furniture',
    rating: 4.9,
    countInStock: 8,
  },
  'mock-2': {
    id: 'mock-2',
    name: 'Enso Ceramic Tea Set',
    slug: 'enso-ceramic-tea-set',
    price: 180,
    originalPrice: null,
    images: ['https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80'],
    categoryName: 'Ceramics',
    rating: 4.8,
    countInStock: 15,
  },
  'mock-3': {
    id: 'mock-3',
    name: 'Kyoto Pendant Lantern',
    slug: 'kyoto-pendant-lantern',
    price: 340,
    originalPrice: 420,
    images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80'],
    categoryName: 'Lighting',
    rating: 5.0,
    countInStock: 3,
  },
  'mock-4': {
    id: 'mock-4',
    name: 'Wabi Stoneware Vase',
    slug: 'wabi-stoneware-vase',
    price: 120,
    originalPrice: 150,
    images: ['https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80'],
    categoryName: 'Ceramics',
    rating: 4.7,
    countInStock: 12,
  },
};

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const toast = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      setLoading(true);
      const itemsList = [];

      for (const id of wishlist) {
        // First check if it is a mock product ID
        if (MOCK_PRODUCTS[id]) {
          itemsList.push(MOCK_PRODUCTS[id]);
        } else {
          // If a real DB product, we can fetch it, or to keep this page blazing-fast and offline-robust, 
          // we can load them from a global list or fetch. Let's do a simple lookup or fallback!
          try {
            const res = await fetch(`/api/products/${id}`);
            if (res.ok) {
              const data = await res.json();
              if (data.success) {
                itemsList.push(data.product);
              }
            }
          } catch (e) {
            console.error('Failed to fetch product detailed data', e);
          }
        }
      }

      setItems(itemsList);
      setLoading(false);
    };

    fetchWishlistItems();
  }, [wishlist]);

  const handleAddToCart = (item: any) => {
    addToCart({
      product: item.id,
      name: item.name,
      price: item.price,
      image: item.images[0],
      quantity: 1,
      variant: '',
      countInStock: item.countInStock || 10,
    });
  };

  return (
    <div className="flex flex-col gap-12 w-full animate-fade-up font-sans">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] tracking-[0.3em] font-bold text-stone-400 uppercase">Bookmarked</span>
        <h1 className="font-serif text-3xl md:text-4xl font-light text-charcoal tracking-tight">Wishlist</h1>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {items.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        /* Empty wishlist state */
        <div className="glass-panel p-16 rounded-2xl flex flex-col items-center justify-center text-center gap-5 py-28 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-sand flex items-center justify-center text-stone-400">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-xl font-semibold text-charcoal">Your wishlist is empty</h2>
          <p className="font-sans text-xs text-stone-400 max-w-xs leading-relaxed font-light">
            You haven't bookmarked any minimal luxury masterpieces yet. Explore our storefront and click the heart icon.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="bg-charcoal text-sand text-xs font-bold tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-stone-800 transition-colors shadow-lg"
            >
              Start Exploring
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
