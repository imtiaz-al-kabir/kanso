'use client';

import React, { useEffect, useState } from 'react';
import { Rows3, Grid2X2 } from 'lucide-react';
import ProductCard from './ProductCard';
import { useShopCatalog } from './ShopCatalogProvider';

type MobileViewMode = 'grid' | 'single';

interface ShopGridProps {
  products: any[];
  layout?: 'mobile' | 'desktop';
}

export function ShopGrid({ products, layout = 'mobile' }: ShopGridProps) {
  const { filteredCount } = useShopCatalog();
  const [mobileView, setMobileView] = useState<MobileViewMode>('grid');

  useEffect(() => {
    const saved = sessionStorage.getItem('shop-mobile-view');
    if (saved === 'single' || saved === 'grid') setMobileView(saved);
  }, []);

  const setView = (mode: MobileViewMode) => {
    setMobileView(mode);
    sessionStorage.setItem('shop-mobile-view', mode);
  };

  const isGrid = mobileView === 'grid';

  return (
    <div className="flex flex-col gap-3">
      {layout === 'mobile' && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-stone-400 shrink-0">
            {filteredCount} {filteredCount === 1 ? 'piece' : 'pieces'} found
          </p>

          <div
            className="flex items-center gap-0.5 bg-white border border-charcoal/[0.08] p-1 rounded-xl shadow-xs shrink-0"
            role="group"
            aria-label="Product layout"
          >
            <button
              type="button"
              onClick={() => setView('single')}
              title="Single column"
              aria-pressed={!isGrid}
              className={`flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-[9px] font-sans font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                !isGrid
                  ? 'bg-charcoal text-[#FAF9F6] shadow-sm'
                  : 'text-stone-500 hover:text-charcoal'
              }`}
            >
              <Rows3 className="w-3.5 h-3.5 shrink-0" />
              <span>Single</span>
            </button>
            <button
              type="button"
              onClick={() => setView('grid')}
              title="Grid view"
              aria-pressed={isGrid}
              className={`flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-[9px] font-sans font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                isGrid
                  ? 'bg-charcoal text-[#FAF9F6] shadow-sm'
                  : 'text-stone-500 hover:text-charcoal'
              }`}
            >
              <Grid2X2 className="w-3.5 h-3.5 shrink-0" />
              <span>Grid</span>
            </button>
          </div>
        </div>
      )}

      <div
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          layout === 'desktop'
            ? 'grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10'
            : isGrid
              ? 'grid-cols-2 gap-x-3 gap-y-5'
              : 'grid-cols-1 gap-y-7'
        }`}
      >
        {products.map((prod) => (
          <ProductCard
            key={prod.id}
            product={prod}
            compact={layout === 'mobile' && isGrid}
          />
        ))}
      </div>
    </div>
  );
}

export default ShopGrid;
