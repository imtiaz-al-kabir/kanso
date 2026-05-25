'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ShopFilteredGrid from './ShopFilteredGrid';
import { PriceRangeSlider } from './PriceRangeSlider';
import { useShopCatalog } from './ShopCatalogProvider';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface DesktopShopSectionProps {
  categories: Category[];
  fallbackCategories: Category[];
  currentCategory: string;
}

function FilterAccordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-panel rounded-2xl border border-charcoal/[0.06] overflow-hidden shadow-xs">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-sand/30 transition-colors"
      >
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-charcoal">
          {title}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-stone-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-stone-400" />
        )}
      </button>
      {open && <div className="px-5 pb-5 pt-0 border-t border-charcoal/[0.05]">{children}</div>}
    </div>
  );
}

export function DesktopShopSection({
  categories,
  fallbackCategories,
  currentCategory,
}: DesktopShopSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortRef = useRef<HTMLDivElement>(null);

  const {
    filteredCount,
    priceMin,
    priceMax,
    priceBounds,
    setPriceRange,
    resetPriceRange,
    isPriceFilterActive,
  } = useShopCatalog();

  const [sortOpen, setSortOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  const sort = searchParams.get('sort') || 'newest';

  const allCategories = [
    { id: 'all', name: 'All Items', slug: 'all' },
    ...(categories.length > 0 ? categories : fallbackCategories),
  ];

  const hasActiveFilters =
    currentCategory !== 'all' || isPriceFilterActive || !!searchParams.get('search');

  const sortLabels: Record<string, string> = {
    newest: 'Latest',
    rating: 'Popular',
    'price-low': 'Price: Low',
    'price-high': 'Price: High',
  };

  const sortOptions = [
    { label: 'Latest', value: 'newest' },
    { label: 'Popular', value: 'rating' },
    { label: 'Price: Low', value: 'price-low' },
    { label: 'Price: High', value: 'price-high' },
  ];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const buildParams = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(overrides).forEach(([key, val]) => {
      if (val === undefined || val === '' || (key === 'category' && val === 'all')) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    return params;
  };

  const applySort = (val: string) => {
    const params = buildParams({ sort: val === 'newest' ? undefined : val });
    router.push(`/shop?${params.toString()}`);
    setSortOpen(false);
  };

  const applyCategory = (slug: string) => {
    const params = buildParams({ category: slug === 'all' ? undefined : slug });
    router.push(`/shop?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (sort && sort !== 'newest') params.set('sort', sort);
    router.push(`/shop?${params.toString()}`);
    resetPriceRange();
  };

  return (
    <div className="hidden md:flex flex-col w-full gap-10 font-sans">
      <div className="flex items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] tracking-[0.3em] font-bold text-stone-400 uppercase">
            Studio Archive
          </span>
          <h1 className="font-serif text-4xl lg:text-5xl font-light text-charcoal tracking-tight">
            All Products
          </h1>
          <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-stone-400">
            {filteredCount} {filteredCount === 1 ? 'piece' : 'pieces'} found
          </p>
        </div>

        <div ref={sortRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-3 min-w-[140px] justify-between px-4 py-2.5 rounded-xl border border-charcoal/10 bg-white text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-700 cursor-pointer hover:border-charcoal/25 transition-all shadow-xs"
          >
            {sortLabels[sort] || 'Latest'}
            <ChevronDown
              className={`w-3.5 h-3.5 text-stone-400 transition-transform ${sortOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {sortOpen && (
            <div className="absolute top-full right-0 mt-1.5 min-w-[180px] bg-white border border-charcoal/[0.06] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(28,26,23,0.1)] z-20">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => applySort(opt.value)}
                  className={`w-full text-left px-4 py-3 text-[11px] font-sans font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                    sort === opt.value
                      ? 'bg-charcoal text-[#FAF9F6]'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-8 lg:gap-12 items-start">
        <aside className="w-[240px] lg:w-[260px] shrink-0 flex flex-col gap-4">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-stone-400">
              Active Filters
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[9px] font-bold uppercase tracking-wider text-[#B58D7C] hover:text-charcoal cursor-pointer transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <FilterAccordion
            title="Category"
            open={categoryOpen}
            onToggle={() => setCategoryOpen(!categoryOpen)}
          >
            <div className="flex flex-col gap-3 pt-4">
              {allCategories.map((cat) => {
                const isActive = currentCategory === cat.slug;
                return (
                  <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
                    <span
                      className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                        isActive
                          ? 'border-charcoal'
                          : 'border-stone-300 group-hover:border-charcoal/40'
                      }`}
                    >
                      {isActive && <span className="w-2 h-2 rounded-full bg-charcoal" />}
                    </span>
                    <input
                      type="radio"
                      name="shop-category"
                      className="sr-only"
                      checked={isActive}
                      onChange={() => applyCategory(cat.slug)}
                    />
                    <span
                      className={`text-[11px] font-sans font-semibold uppercase tracking-wider ${
                        isActive ? 'text-charcoal' : 'text-stone-500 group-hover:text-charcoal'
                      }`}
                    >
                      {cat.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </FilterAccordion>

          <FilterAccordion
            title="Price Range"
            open={priceOpen}
            onToggle={() => setPriceOpen(!priceOpen)}
          >
            <div className="pt-4">
              <PriceRangeSlider
                theme="light"
                min={priceBounds.min}
                max={priceBounds.max}
                step={priceBounds.step}
                valueMin={priceMin}
                valueMax={priceMax}
                onChange={setPriceRange}
              />
            </div>
          </FilterAccordion>
        </aside>

        <div className="flex-1 min-w-0">
          <ShopFilteredGrid layout="desktop" />
        </div>
      </div>
    </div>
  );
}

export default DesktopShopSection;
