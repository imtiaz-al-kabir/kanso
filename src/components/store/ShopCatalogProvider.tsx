'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  clampPriceRange,
  filterProductsByPrice,
  getCatalogPriceBounds,
  priceRangeFromSearchParams,
} from '@/lib/shopFilters';

type Product = { price?: number; [key: string]: unknown };

interface ShopCatalogContextValue {
  allProducts: Product[];
  filteredProducts: Product[];
  filteredCount: number;
  priceMin: number;
  priceMax: number;
  priceBounds: { min: number; max: number; step: number };
  setPriceRange: (min: number, max: number) => void;
  resetPriceRange: () => void;
  isPriceFilterActive: boolean;
}

const ShopCatalogContext = createContext<ShopCatalogContextValue | null>(null);

export function useShopCatalog() {
  const ctx = useContext(ShopCatalogContext);
  if (!ctx) {
    throw new Error('useShopCatalog must be used within ShopCatalogProvider');
  }
  return ctx;
}

interface ShopCatalogProviderProps {
  products: Product[];
  children: React.ReactNode;
}

export function ShopCatalogProvider({ products, children }: ShopCatalogProviderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const priceBounds = useMemo(() => getCatalogPriceBounds(products), [products]);

  const initialRange = useMemo(
    () => priceRangeFromSearchParams(searchParams, priceBounds),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init from URL once per bounds change
    [priceBounds.min, priceBounds.max]
  );

  const [priceMin, setPriceMin] = useState(initialRange.min);
  const [priceMax, setPriceMax] = useState(initialRange.max);
  const skipUrlSync = useRef(false);

  useEffect(() => {
    if (skipUrlSync.current) {
      skipUrlSync.current = false;
      return;
    }
    const fromUrl = priceRangeFromSearchParams(searchParams, priceBounds);
    setPriceMin(fromUrl.min);
    setPriceMax(fromUrl.max);
  }, [searchParams, priceBounds]);

  const setPriceRange = useCallback(
    (min: number, max: number) => {
      const clamped = clampPriceRange(min, max, priceBounds);
      setPriceMin(clamped.min);
      setPriceMax(clamped.max);
    },
    [priceBounds]
  );

  const resetPriceRange = useCallback(() => {
    setPriceMin(priceBounds.min);
    setPriceMax(priceBounds.max);
  }, [priceBounds]);

  const isPriceFilterActive =
    priceMin > priceBounds.min || priceMax < priceBounds.max;

  const filteredProducts = useMemo(
    () => filterProductsByPrice(products, priceMin, priceMax, priceBounds),
    [products, priceMin, priceMax, priceBounds]
  );

  /* Debounced URL sync for shareable links without blocking UI */
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (priceMin > priceBounds.min) {
        params.set('minPrice', String(priceMin));
      } else {
        params.delete('minPrice');
      }
      if (priceMax < priceBounds.max) {
        params.set('maxPrice', String(priceMax));
      } else {
        params.delete('maxPrice');
      }

      const next = params.toString();
      const current = searchParams.toString();
      if (next === current) return;

      skipUrlSync.current = true;
      router.replace(next ? `/shop?${next}` : '/shop', { scroll: false });
    }, 350);

    return () => clearTimeout(timer);
  }, [priceMin, priceMax, priceBounds, router, searchParams]);

  const value: ShopCatalogContextValue = {
    allProducts: products,
    filteredProducts,
    filteredCount: filteredProducts.length,
    priceMin,
    priceMax,
    priceBounds,
    setPriceRange,
    resetPriceRange,
    isPriceFilterActive,
  };

  return (
    <ShopCatalogContext.Provider value={value}>{children}</ShopCatalogContext.Provider>
  );
}
