'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, Check, ChevronDown } from 'lucide-react';
import { PriceRangeSlider } from './PriceRangeSlider';
import { useShopCatalog } from './ShopCatalogProvider';

interface MobileShopControlsProps {
  categories: { id: string; name: string; slug: string }[];
  currentCategory: string;
}

export function MobileShopControls({
  categories, currentCategory,
}: MobileShopControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const {
    priceMin,
    priceMax,
    priceBounds,
    setPriceRange,
    resetPriceRange,
    isPriceFilterActive,
  } = useShopCatalog();

  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const hasFilters = selectedCategory !== 'all' || isPriceFilterActive;

  const sortLabels: Record<string, string> = {
    newest: 'Latest', rating: 'Popular',
    'price-low': 'Price: Low', 'price-high': 'Price: High',
  };
  const sortOptions = [
    { label: 'Latest',       value: 'newest' },
    { label: 'Popular',      value: 'rating' },
    { label: 'Price: Low',   value: 'price-low' },
    { label: 'Price: High',  value: 'price-high' },
  ];

  const allCategories = [
    { id: 'all', name: 'All Items', slug: 'all' },
    ...categories,
  ];

  /* Lock scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  /* Close sort dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const applySort = (val: string) => {
    setSort(val);
    const params = new URLSearchParams(searchParams.toString());
    if (val === 'newest') params.delete('sort'); else params.set('sort', val);
    router.push(`/shop?${params.toString()}`);
    setSortOpen(false);
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort && sort !== 'newest') params.set('sort', sort);
    else params.delete('sort');
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    else params.delete('category');
    router.push(`/shop?${params.toString()}`);
    setDrawerOpen(false);
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    resetPriceRange();
    const params = new URLSearchParams();
    if (sort && sort !== 'newest') params.set('sort', sort);
    router.push(`/shop?${params.toString()}`);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* ══════════════════════════════════════════════════
          TOP TOOLBAR
      ══════════════════════════════════════════════════ */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-charcoal/[0.06] bg-[#FAF9F6]">

        {/* Sort Dropdown */}
        <div ref={sortRef} className="relative flex-1">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="w-full flex items-center justify-between gap-2 bg-white border border-charcoal/10 rounded-xl px-3.5 py-2.5 text-[11px] font-sans font-semibold text-stone-700 cursor-pointer active:scale-[0.98] transition-all"
          >
            <span className="uppercase tracking-wider">{sortLabels[sort] || 'Latest'}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {sortOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-[0_8px_30px_rgba(28,26,23,0.12)] border border-charcoal/[0.06] overflow-hidden z-30">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => applySort(opt.value)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-[11px] font-sans font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                    sort === opt.value
                      ? 'bg-charcoal text-[#FAF9F6]'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {opt.label}
                  {sort === opt.value && <Check className="w-3 h-3 text-[#B58D7C]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filters Button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider border transition-all duration-200 cursor-pointer active:scale-95 shrink-0 ${
            hasFilters
              ? 'bg-charcoal text-[#FAF9F6] border-transparent shadow-sm'
              : 'bg-white text-stone-700 border-charcoal/10'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {hasFilters && (
            <span className="w-4 h-4 bg-[#B58D7C] text-white rounded-full text-[8px] font-bold flex items-center justify-center leading-none">
              {[selectedCategory !== 'all' ? 1 : 0, isPriceFilterActive ? 1 : 0].reduce((a, b) => a + b, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Drawer + backdrop portaled to body (avoids broken fixed positioning from parent transforms) */}
      {mounted && drawerOpen && createPortal(
        <>
          <div
            className="fixed inset-0 z-[100] bg-charcoal/30 backdrop-blur-[2px]"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-filter-drawer-title"
            className="fixed top-0 right-0 h-full z-[101] bg-[#FAF9F6] w-[80vw] max-w-[320px] shadow-[-20px_0_60px_rgba(28,26,23,0.12)] flex flex-col animate-[slide-in-right_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal/[0.06] shrink-0 pt-[max(env(safe-area-inset-top),0px)]">
              <h2 id="mobile-filter-drawer-title" className="font-serif text-lg font-semibold text-charcoal">Filters</h2>
              <div className="flex items-center gap-3">
                {hasFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#B58D7C] cursor-pointer"
                  >
                    Reset
                  </button>
                )}
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-sand flex items-center justify-center text-stone-500 hover:text-charcoal transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain p-5 flex flex-col gap-7">
              <div className="flex flex-col gap-3">
                <span className="text-[9px] font-sans font-bold uppercase tracking-[0.3em] text-stone-400">
                  Category
                </span>
                <div className="flex flex-col gap-1.5">
                  {allCategories.map((cat) => {
                    const isActive = selectedCategory === cat.slug;
                    return (
                      <button
                        key={cat.slug}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border text-sm font-sans font-medium transition-all duration-200 cursor-pointer active:scale-[0.98] text-left ${
                          isActive
                            ? 'bg-charcoal text-[#FAF9F6] border-transparent shadow-sm font-semibold'
                            : 'bg-white text-stone-700 border-charcoal/[0.07] hover:bg-stone-50'
                        }`}
                      >
                        {cat.name}
                        {isActive && <Check className="w-3.5 h-3.5 text-[#B58D7C] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[9px] font-sans font-bold uppercase tracking-[0.3em] text-stone-400">
                  Price Range (৳)
                </span>
                <div className="bg-white rounded-2xl border border-charcoal/[0.07] p-4">
                  <PriceRangeSlider
                    min={priceBounds.min}
                    max={priceBounds.max}
                    step={priceBounds.step}
                    valueMin={priceMin}
                    valueMax={priceMax}
                    onChange={setPriceRange}
                  />
                </div>
              </div>
            </div>

            <div
              className="px-5 py-4 border-t border-charcoal/[0.06] shrink-0"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
            >
              <button
                onClick={applyFilters}
                className="w-full py-3.5 rounded-2xl bg-charcoal text-[#FAF9F6] text-sm font-sans font-semibold tracking-wide cursor-pointer shadow-md active:scale-[0.98] transition-all hover:bg-stone-800"
              >
                Show Results
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

export default MobileShopControls;
