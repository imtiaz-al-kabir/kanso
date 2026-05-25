import React, { Suspense } from 'react';
import { getCategoriesAction } from '@/actions/categoryActions';
import { getProductsAction } from '@/actions/productActions';
import { MobileShopControls } from '@/components/store/MobileShopDrawer';
import { DesktopShopSection } from '@/components/store/DesktopShopSection';
import { ShopCatalogProvider } from '@/components/store/ShopCatalogProvider';
import ShopFilteredGrid from '@/components/store/ShopFilteredGrid';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShopPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  const currentCategory = (resolvedParams.category as string) || 'all';
  const search = (resolvedParams.search as string) || '';
  const sort = (resolvedParams.sort as string) || 'newest';

  const catRes = await getCategoriesAction();
  const prodRes = await getProductsAction({ category: currentCategory, search, sort });

  const categories = catRes.success && catRes.categories ? catRes.categories : [];

  const mockProducts = [
    { id: 'mock-1', name: 'Hasu Lounge Chair', slug: 'hasu-lounge-chair', price: 890, originalPrice: 1100, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80', rating: 4.9, categorySlug: 'furniture' },
    { id: 'mock-2', name: 'Enso Ceramic Tea Set', slug: 'enso-ceramic-tea-set', price: 180, originalPrice: null, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', rating: 4.8, categorySlug: 'ceramics' },
    { id: 'mock-3', name: 'Kyoto Pendant Lantern', slug: 'kyoto-pendant-lantern', price: 340, originalPrice: 420, image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80', rating: 5.0, categorySlug: 'lighting' },
    { id: 'mock-4', name: 'Wabi Stoneware Vase', slug: 'wabi-stoneware-vase', price: 120, originalPrice: 150, image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80', rating: 4.7, categorySlug: 'ceramics' },
  ];

  let products = prodRes.success && prodRes.products ? prodRes.products : [];
  const hasAppliedFilters = search || currentCategory !== 'all';
  if (products.length === 0 && !hasAppliedFilters) {
    products = mockProducts.map((p) => ({
      ...p,
      images: [p.image],
      category: { id: 'mock', name: p.categorySlug, slug: p.categorySlug },
      countInStock: 10, variants: [], numReviews: 5,
      isFeatured: true, featuredImage: '', description: '',
    }));
  }

  const fallbackCategories = categories.length > 0
    ? categories
    : [{ id: 'f1', name: 'Furniture', slug: 'furniture' }, { id: 'f2', name: 'Ceramics', slug: 'ceramics' }, { id: 'f3', name: 'Lighting', slug: 'lighting' }];

  return (
    <div className="flex flex-col w-full animate-fade-up">
      <Suspense fallback={<div className="h-40 animate-pulse bg-sand/40 rounded-2xl" />}>
        <ShopCatalogProvider products={products}>
          {/* MOBILE */}
          <div className="md:hidden flex flex-col min-h-screen overflow-x-hidden">
            <div className="px-4 pt-3 pb-2">
              <span className="text-[9px] tracking-[0.3em] font-bold text-stone-400 uppercase">Studio Archive</span>
              <h1 className="font-serif text-2xl font-light text-charcoal tracking-tight mt-0.5">Tactile Solace</h1>
            </div>

            <Suspense fallback={<div className="h-11 border-b border-charcoal/[0.05] animate-pulse bg-[#FAF9F6]/80" />}>
              <MobileShopControls
                categories={categories.length > 0 ? categories : fallbackCategories}
                currentCategory={currentCategory}
              />
            </Suspense>

            <div className="px-3 pt-3 pb-28 flex-1">
              <ShopFilteredGrid layout="mobile" />
            </div>
          </div>

          {/* DESKTOP */}
          <DesktopShopSection
            categories={categories}
            fallbackCategories={fallbackCategories}
            currentCategory={currentCategory}
          />
        </ShopCatalogProvider>
      </Suspense>
    </div>
  );
}
