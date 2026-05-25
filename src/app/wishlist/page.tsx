'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Star, Trash2, ShoppingBag } from 'lucide-react';
import { useStore } from '@/providers/StoreProvider';
import { useToast } from '@/providers/ToastProvider';
import Button from '@/components/ui/Button';

// Mock visual products to match our seed showcase if no DB products loaded
const MOCK_PRODUCTS: { [key: string]: any } = {
  'mock-1': {
    id: 'mock-1',
    name: 'Hasu Lounge Chair',
    slug: 'hasu-lounge-chair',
    price: 890,
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((prod) => (
            <div key={prod.id} className="flex flex-col gap-4 group relative">
              {/* Product Card Image Container */}
              <div className="relative h-[200px] md:h-[280px] rounded-2xl overflow-hidden shadow-sm bg-sand">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-104"
                  style={{ backgroundImage: `url('${prod.images[0]}')` }}
                />
                
                {/* Remove button */}
                <button
                  onClick={() => toggleWishlist(prod.id)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-sand/80 text-stone-500 hover:text-red-500 hover:bg-sand flex items-center justify-center transition-all shadow-xs cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Text Meta */}
              <div className="flex flex-col gap-1.5 px-1">
                <div className="flex justify-between items-start gap-2">
                  <Link
                    href={`/product/${prod.slug}`}
                    className="font-serif text-sm font-semibold text-charcoal hover:opacity-75 truncate max-w-[70%]"
                  >
                    {prod.name}
                  </Link>
                  <span className="font-sans text-xs font-bold text-stone-600 shrink-0">
                    ${prod.price}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 justify-between mt-1">
                  <div className="flex items-center gap-0.5 text-primary">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-[10px] font-bold text-stone-500 font-sans">{prod.rating || 4.5}</span>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(prod)}
                    className="text-[10px] font-bold uppercase tracking-widest text-charcoal flex items-center gap-1 hover:opacity-75 transition-opacity cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
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
