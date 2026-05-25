import React from 'react';
import Link from 'next/link';
import { Star, Inbox } from 'lucide-react';
import { getCategoriesAction } from '@/actions/categoryActions';
import { getProductsAction } from '@/actions/productActions';
import ShopFilters from '@/components/store/ShopFilters';
import { getAestheticPlaceholder } from '@/lib/cloudinary';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShopPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  const currentCategory = (resolvedParams.category as string) || 'all';
  const search = (resolvedParams.search as string) || '';
  const minPrice = resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined;
  const maxPrice = resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined;
  const sort = (resolvedParams.sort as string) || 'newest';

  // Fetch data on server
  const catRes = await getCategoriesAction();
  const prodRes = await getProductsAction({
    category: currentCategory,
    search,
    minPrice,
    maxPrice,
    sort,
  });

  const categories = catRes.success && catRes.categories ? catRes.categories : [];
  
  // Custom mock fallbacks if DB is completely empty (visual safeguard)
  const mockProducts = [
    {
      id: 'mock-1',
      name: 'Hasu Lounge Chair',
      slug: 'hasu-lounge-chair',
      price: 890,
      originalPrice: 1100,
      image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      categorySlug: 'furniture',
    },
    {
      id: 'mock-2',
      name: 'Enso Ceramic Tea Set',
      slug: 'enso-ceramic-tea-set',
      price: 180,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      categorySlug: 'ceramics',
    },
    {
      id: 'mock-3',
      name: 'Kyoto Pendant Lantern',
      slug: 'kyoto-pendant-lantern',
      price: 340,
      originalPrice: 420,
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      categorySlug: 'lighting',
    },
    {
      id: 'mock-4',
      name: 'Wabi Stoneware Vase',
      slug: 'wabi-stoneware-vase',
      price: 120,
      originalPrice: 150,
      image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      categorySlug: 'ceramics',
    },
  ];

  let products = prodRes.success && prodRes.products ? prodRes.products : [];

  // If no DB products exist and no active user searches/filters are applied, use aesthetic mock fallbacks!
  const hasAppliedFilters = search || minPrice || maxPrice || currentCategory !== 'all';
  if (products.length === 0 && !hasAppliedFilters) {
    products = mockProducts.map(p => ({
      ...p,
      images: [p.image],
      category: { id: 'mock', name: p.categorySlug, slug: p.categorySlug },
      countInStock: 10,
      variants: [],
      numReviews: 5,
      isFeatured: true,
      featuredImage: '',
      description: '',
    }));
  }

  return (
    <div className="flex flex-col gap-12 w-full animate-fade-up">
      {/* 1. Header Title */}
      <div className="flex flex-col gap-3 max-w-xl">
        <span className="text-[10px] tracking-[0.3em] font-bold text-stone-400 uppercase">
          Studio Archive
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-charcoal tracking-tight">
          Tactile Solace
        </h1>
        <p className="font-sans text-xs md:text-sm font-light text-stone-500 leading-relaxed">
          Quiet editorial spaces defined by natural ash frames, organic textured stoneware, and delicate ambient lantern light. Filter by preference below.
        </p>
      </div>

      {/* 2. Horizontal Mobile Pill Category Bar */}
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-none">
        <Link
          href="/shop"
          className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 shrink-0 ${
            currentCategory === 'all'
              ? 'bg-charcoal text-sand shadow-md'
              : 'bg-sand text-stone-600 hover:bg-stone-200 border border-charcoal/5'
          }`}
        >
          All Items
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}`}
            className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 shrink-0 ${
              currentCategory === cat.slug
                ? 'bg-charcoal text-sand shadow-md'
                : 'bg-sand text-stone-600 hover:bg-stone-200 border border-charcoal/5'
            }`}
          >
            {cat.name}
          </Link>
        ))}
        {/* Visual fallback pills if categories empty */}
        {categories.length === 0 && ['furniture', 'ceramics', 'lighting'].map((c) => (
          <Link
            key={c}
            href={`/shop?category=${c}`}
            className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 shrink-0 ${
              currentCategory === c
                ? 'bg-charcoal text-sand shadow-md'
                : 'bg-sand text-stone-600 hover:bg-stone-200 border border-charcoal/5'
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      {/* 3. Reactive Search/Filters */}
      <ShopFilters categories={categories} currentCategory={currentCategory} />

      {/* 4. Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((prod) => (
            <div key={prod.id} className="flex flex-col gap-4 group relative">
              {/* Image box */}
              <Link
                href={`/product/${prod.slug}`}
                className="relative h-[220px] md:h-[320px] rounded-2xl overflow-hidden shadow-sm bg-sand"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-104"
                  style={{ backgroundImage: `url('${prod.images ? prod.images[0] : getAestheticPlaceholder()}')` }}
                />
                
                {/* Badges */}
                {prod.originalPrice && prod.price < prod.originalPrice && (
                  <div className="absolute top-4 left-4 bg-primary text-charcoal px-3 py-1 rounded-full text-[9px] font-sans font-bold uppercase tracking-wider shadow-sm">
                    Sale
                  </div>
                )}
                
                {prod.countInStock === 0 && (
                  <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-xs flex items-center justify-center">
                    <span className="text-[10px] text-sand font-sans font-bold uppercase tracking-widest bg-charcoal/80 px-4 py-2 rounded-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
              </Link>

              {/* Detail block */}
              <div className="flex flex-col gap-1 px-1">
                <div className="flex justify-between items-start gap-2">
                  <Link
                    href={`/product/${prod.slug}`}
                    className="font-serif text-sm font-semibold text-charcoal hover:opacity-75 transition-opacity truncate max-w-[70%]"
                  >
                    {prod.name}
                  </Link>
                  <div className="flex flex-col items-end">
                    <span className="font-sans text-xs font-bold text-stone-600">
                      ${prod.price}
                    </span>
                    {prod.originalPrice && (
                      <span className="font-sans text-[10px] text-stone-400 line-through">
                        ${prod.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    <span className="text-[10px] font-bold text-stone-500 font-sans">{prod.rating || 0}</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-sans font-light">({prod.numReviews || 0} reviews)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel p-16 rounded-2xl flex flex-col items-center justify-center text-center gap-4 py-24">
          <div className="w-16 h-16 rounded-full bg-sand flex items-center justify-center text-stone-400">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-charcoal">No Products Found</h3>
          <p className="font-sans text-xs text-stone-400 max-w-xs leading-relaxed font-light">
            We couldn't find any products matching your active filters. Try refining your parameters or clearing the search.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="bg-charcoal text-sand text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-lg hover:bg-stone-800 transition-colors"
            >
              Reset Filters
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
