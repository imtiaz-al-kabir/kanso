'use client';

import React from 'react';
import Link from 'next/link';
import { Inbox } from 'lucide-react';
import ShopGrid from './ShopGrid';
import { useShopCatalog } from './ShopCatalogProvider';

interface ShopFilteredGridProps {
  layout: 'mobile' | 'desktop';
  className?: string;
}

export function ShopFilteredGrid({ layout, className = '' }: ShopFilteredGridProps) {
  const { filteredProducts } = useShopCatalog();

  if (filteredProducts.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-4 py-16 text-center ${
          layout === 'desktop' ? 'glass-panel p-16 rounded-2xl border border-charcoal/5' : ''
        } ${className}`}
      >
        <div
          className={`rounded-full bg-sand flex items-center justify-center ${
            layout === 'desktop' ? 'w-16 h-16' : 'w-14 h-14'
          }`}
        >
          <Inbox className={layout === 'desktop' ? 'w-8 h-8 text-stone-400' : 'w-7 h-7 text-stone-400'} />
        </div>
        <h3
          className={`font-serif font-semibold text-charcoal ${
            layout === 'desktop' ? 'text-lg' : 'text-base'
          }`}
        >
          No Products Found
        </h3>
        <p className="font-sans text-xs text-stone-400 max-w-xs leading-relaxed">
          Nothing matches your current filters. Try adjusting the price range.
        </p>
        <Link
          href="/shop"
          className={`bg-charcoal text-[#FAF9F6] text-xs font-bold tracking-widest uppercase hover:bg-stone-800 transition-colors ${
            layout === 'desktop' ? 'px-6 py-3 rounded-lg' : 'px-6 py-3 rounded-xl'
          }`}
        >
          Reset Filters
        </Link>
      </div>
    );
  }

  return (
    <div className={className}>
      <ShopGrid products={filteredProducts} layout={layout} />
    </div>
  );
}

export default ShopFilteredGrid;
