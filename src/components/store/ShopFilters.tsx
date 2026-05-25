'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface ShopFiltersProps {
  categories: { id: string; name: string; slug: string }[];
  currentCategory: string;
}

export function ShopFilters({ categories, currentCategory }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

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
  };

  const handleQuickSort = (sortVal: string) => {
    setSort(sortVal);
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sortVal);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between glass-panel p-4 rounded-xl">
        <form onSubmit={handleApplyFilters} className="w-full sm:max-w-xs relative flex items-center">
          <input
            type="text"
            placeholder="Search within collection..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-sand/50 text-xs px-4 py-2.5 pl-10 rounded-lg text-charcoal outline-none border border-charcoal/5 focus:border-charcoal transition-all font-medium"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
        </form>

        <div className="flex gap-3 w-full sm:w-auto items-center justify-between sm:justify-start">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-charcoal text-sand text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-stone-800 transition-colors shadow-sm cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* Quick Sort Dropdown */}
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

      {/* Expanded Drawer/Accordion Panel */}
      {isOpen && (
        <div className="glass-panel p-6 rounded-xl animate-fade-up flex flex-col gap-6">
          <h4 className="font-serif text-sm font-semibold text-charcoal border-b border-charcoal/5 pb-2">Filter Parameters</h4>
          
          <form onSubmit={handleApplyFilters} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Price Inputs */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Price Range ($)</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-sand/50 border border-charcoal/5 px-3 py-2.5 rounded-lg text-xs text-charcoal outline-none focus:border-charcoal font-medium"
                />
                <span className="text-stone-400 font-medium">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-sand/50 border border-charcoal/5 px-3 py-2.5 rounded-lg text-xs text-charcoal outline-none focus:border-charcoal font-medium"
                />
              </div>
            </div>

            {/* Quick Sort Options */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Sorting Preferences</span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setSort('price-low')}
                  className={`py-2 rounded-lg border text-center cursor-pointer transition-colors ${
                    sort === 'price-low' ? 'bg-charcoal text-sand border-charcoal' : 'border-charcoal/10 text-stone-600'
                  }`}
                >
                  Price Low
                </button>
                <button
                  type="button"
                  onClick={() => setSort('price-high')}
                  className={`py-2 rounded-lg border text-center cursor-pointer transition-colors ${
                    sort === 'price-high' ? 'bg-charcoal text-sand border-charcoal' : 'border-charcoal/10 text-stone-600'
                  }`}
                >
                  Price High
                </button>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-end justify-end gap-2 sm:col-span-1">
              <Button type="button" variant="outline" size="sm" onClick={handleReset} className="w-full">
                Reset
              </Button>
              <Button type="submit" variant="primary" size="sm" className="w-full">
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
