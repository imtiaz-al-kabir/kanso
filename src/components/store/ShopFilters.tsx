'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, ArrowUpDown, X, Check } from 'lucide-react';
import Button from '../ui/Button';

interface ShopFiltersProps {
  categories: { id: string; name: string; slug: string }[];
  currentCategory: string;
}

export function ShopFilters({ categories, currentCategory }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const activeFiltersCount = [
    search.trim() ? 1 : 0,
    minPrice ? 1 : 0,
    maxPrice ? 1 : 0,
    sort !== 'newest' ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const params = new URLSearchParams();
    
    // Carry over category if selected
    if (currentCategory && currentCategory !== 'all') {
      params.set('category', currentCategory);
    }
    
    if (search.trim()) params.set('search', search.trim());
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sort) params.set('sort', sort);
    
    router.push(`/shop?${params.toString()}`);
    setIsOpen(false);
    setIsMobileSearchOpen(false);
  };

  const handleReset = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    
    const params = new URLSearchParams();
    if (currentCategory && currentCategory !== 'all') {
      params.set('category', currentCategory);
    }
    router.push(`/shop?${params.toString()}`);
    setIsOpen(false);
    setIsMobileSearchOpen(false);
  };

  const handleQuickSort = (sortVal: string) => {
    setSort(sortVal);
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sortVal);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 font-sans select-none animate-fade-up">
      
      {/* ═══════════════════════════════════════════════
          1. DESKTOP VIEWPORTS: Standard Glass Filter Bar
      ═══════════════════════════════════════════════ */}
      <div className="hidden md:flex items-center justify-between glass-panel p-4 rounded-xl border border-charcoal/5 shadow-xs">
        <form onSubmit={handleApplyFilters} className="w-full max-w-xs relative flex items-center">
          <input
            type="text"
            placeholder="Search within collection..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-sand/50 text-xs px-4 py-2.5 pl-10 rounded-lg text-charcoal outline-none border border-charcoal/5 focus:border-charcoal transition-all font-medium"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
        </form>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors cursor-pointer border ${
              isOpen 
                ? 'bg-charcoal text-sand border-transparent' 
                : 'bg-sand text-charcoal border-charcoal/5 hover:bg-stone-100'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>

          <select
            value={sort}
            onChange={(e) => handleQuickSort(e.target.value)}
            className="bg-sand border border-charcoal/5 px-3 py-2.5 rounded-lg text-xs font-semibold text-charcoal focus:outline-none focus:border-charcoal cursor-pointer"
          >
            <option value="newest">Sort: Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Popularity</option>
          </select>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          2. MOBILE VIEWPORTS: Razor-Thin Minimalist Link Menu
      ═══════════════════════════════════════════════ */}
      <div className="md:hidden flex flex-col gap-3">
        {/* Razor Bar */}
        <div className="flex items-center justify-around border-t border-b border-charcoal/[0.06] py-3.5 text-[9px] font-sans font-bold uppercase tracking-[0.25em] text-stone-500">
          
          {/* Mobile Tab 1: Search */}
          <button 
            onClick={() => {
              setIsMobileSearchOpen(!isMobileSearchOpen);
              setIsOpen(false);
            }} 
            className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
              isMobileSearchOpen || search ? 'text-charcoal font-extrabold' : 'hover:text-charcoal'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            {search ? 'Searching' : 'Search'}
          </button>

          <span className="text-charcoal/10 font-light font-serif">|</span>

          {/* Mobile Tab 2: Filter Drawer */}
          <button 
            onClick={() => {
              setIsOpen(!isOpen);
              setIsMobileSearchOpen(false);
            }} 
            className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
              isOpen || activeFiltersCount > 0 ? 'text-charcoal font-extrabold' : 'hover:text-charcoal'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>

          <span className="text-charcoal/10 font-light font-serif">|</span>

          {/* Mobile Tab 3: Quick Sort Toggles */}
          <button 
            onClick={() => {
              setIsOpen(!isOpen);
              setIsMobileSearchOpen(false);
            }} 
            className="flex items-center gap-1.5 cursor-pointer hover:text-charcoal transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort
          </button>
        </div>

        {/* Mobile Search Slide Down Panel */}
        {isMobileSearchOpen && (
          <form 
            onSubmit={handleApplyFilters} 
            className="flex items-center gap-2 p-2 bg-[#FAF9F6] border border-charcoal/[0.04] rounded-xl shadow-inner animate-fade-up"
          >
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                placeholder="Search collection..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white text-xs px-3 py-2 pl-9 rounded-lg text-charcoal outline-none border border-charcoal/5 focus:border-charcoal font-medium"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 pointer-events-none" />
              {search && (
                <button 
                  type="button" 
                  onClick={() => setSearch('')}
                  className="absolute right-3 text-stone-400 hover:text-charcoal"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            
            <button 
              type="submit"
              className="bg-charcoal text-sand text-[8px] font-sans font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-lg active:scale-95 transition-all cursor-pointer shrink-0"
            >
              Go
            </button>
          </form>
        )}
      </div>

      {/* ═══════════════════════════════════════════════
          3. EXPANDED PANEL (Drawer/Accordion Panel - Both Viewports)
      ═══════════════════════════════════════════════ */}
      {isOpen && (
        <div className="glass-panel p-5 rounded-2xl border border-charcoal/5 shadow-md flex flex-col gap-5 animate-fade-up">
          <div className="flex justify-between items-center border-b border-charcoal/5 pb-2 select-none">
            <h4 className="font-serif text-sm font-semibold text-charcoal">Filter Options</h4>
            {activeFiltersCount > 0 && (
              <button 
                type="button" 
                onClick={handleReset}
                className="text-[9px] font-bold text-red-500 uppercase tracking-widest hover:text-red-600"
              >
                Clear All
              </button>
            )}
          </div>
          
          <form onSubmit={handleApplyFilters} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Price Inputs */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] uppercase font-bold text-stone-400 tracking-wider">Price Range (৳)</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-sand/60 border border-charcoal/5 px-3 py-2 rounded-lg text-xs text-charcoal outline-none focus:border-charcoal font-semibold shadow-xs"
                />
                <span className="text-stone-400 font-medium">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-sand/60 border border-charcoal/5 px-3 py-2 rounded-lg text-xs text-charcoal outline-none focus:border-charcoal font-semibold shadow-xs"
                />
              </div>
            </div>

            {/* Quick Sort Options */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] uppercase font-bold text-stone-400 tracking-wider">Sort Preference</span>
              <div className="grid grid-cols-2 gap-2 text-[8px] font-sans font-bold uppercase tracking-wider">
                {[
                  { label: 'Newest', value: 'newest' },
                  { label: 'Popularity', value: 'rating' },
                  { label: 'Price Low', value: 'price-low' },
                  { label: 'Price High', value: 'price-high' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSort(option.value);
                      if (window.innerWidth < 768) {
                        handleQuickSort(option.value);
                      }
                    }}
                    className={`py-2 px-1 rounded-lg border text-center transition-all duration-300 cursor-pointer flex items-center justify-center gap-1 shrink-0 ${
                      sort === option.value 
                        ? 'bg-charcoal text-sand border-transparent shadow-sm' 
                        : 'border-charcoal/5 text-stone-500 hover:text-charcoal hover:bg-stone-50 bg-white/50'
                    }`}
                  >
                    {sort === option.value && <Check className="w-2.5 h-2.5 text-sage shrink-0" />}
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-end justify-end gap-2 sm:col-span-1">
              <Button type="button" variant="outline" size="sm" onClick={handleReset} className="w-full text-[10px] font-sans py-2.5">
                Reset
              </Button>
              <Button type="submit" variant="primary" size="sm" className="w-full text-[10px] font-sans py-2.5">
                Apply
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ShopFilters;
