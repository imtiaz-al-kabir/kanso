export const DEFAULT_PRICE_MIN = 0;
export const DEFAULT_PRICE_MAX = 10000;
const MIN_GAP = 10;

export function getCatalogPriceBounds(
  products: { price?: number }[],
  floor = DEFAULT_PRICE_MIN,
  ceiling = DEFAULT_PRICE_MAX
) {
  if (!products.length) {
    return { min: floor, max: ceiling, step: 10 };
  }

  const prices = products.map((p) => p.price ?? 0).filter((p) => p >= 0);
  const catalogMin = Math.min(...prices, floor);
  const catalogMax = Math.max(...prices, ceiling);
  const range = catalogMax - catalogMin;
  const step = range > 500 ? 50 : range > 100 ? 10 : 5;

  return {
    min: catalogMin,
    max: Math.max(catalogMax, catalogMin + MIN_GAP * 2),
    step,
  };
}

export function clampPriceRange(
  minVal: number,
  maxVal: number,
  bounds: { min: number; max: number },
  gap = MIN_GAP
) {
  let lo = Math.max(bounds.min, Math.min(minVal, bounds.max));
  let hi = Math.max(bounds.min, Math.min(maxVal, bounds.max));

  if (hi - lo < gap) {
    if (lo + gap <= bounds.max) {
      hi = lo + gap;
    } else {
      lo = Math.max(bounds.min, hi - gap);
    }
  }

  return { min: lo, max: hi };
}

export function filterProductsByPrice<T extends { price?: number }>(
  products: T[],
  priceMin: number,
  priceMax: number,
  bounds: { min: number; max: number }
) {
  const atDefaultMin = priceMin <= bounds.min;
  const atDefaultMax = priceMax >= bounds.max;

  if (atDefaultMin && atDefaultMax) return products;

  return products.filter((p) => {
    const price = p.price ?? 0;
    return price >= priceMin && price <= priceMax;
  });
}

export function priceRangeFromSearchParams(
  searchParams: URLSearchParams,
  bounds: { min: number; max: number }
) {
  const rawMin = searchParams.get('minPrice');
  const rawMax = searchParams.get('maxPrice');
  const minVal = rawMin ? Number(rawMin) : bounds.min;
  const maxVal = rawMax ? Number(rawMax) : bounds.max;
  return clampPriceRange(minVal, maxVal, bounds);
}
