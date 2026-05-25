'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '@/providers/StoreProvider';
import { useToast } from '@/providers/ToastProvider';
import { formatCurrency } from '@/lib/utils';
import { getAestheticPlaceholder } from '@/lib/cloudinary';

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number | null;
    images?: string[];
    image?: string; // single string fallback
    rating?: number;
    numReviews?: number;
    categoryName?: string;
    category?: { name: string; slug: string } | null;
    countInStock?: number;
    isFeatured?: boolean;
  };
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const toast = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.countInStock === 0;

  // Resolve image URLs
  const imageUrls = product.images && product.images.length > 0
    ? product.images
    : [product.image || getAestheticPlaceholder()];

  const primaryImage = imageUrls[0];
  const secondaryImage = imageUrls.length > 1 ? imageUrls[1] : null;

  // Resolve category name
  const categoryLabel = product.categoryName || product.category?.name || 'Studio Curation';

  // Calculate discount percentage
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    addToCart({
      product: product.id,
      name: product.name,
      price: product.price,
      image: primaryImage,
      quantity: 1,
      variant: '',
      countInStock: product.countInStock || 10,
    });

    toast(`Added "${product.name}" to curation`, 'success');
    
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast(
      isFavorited 
        ? `Removed "${product.name}" from wishlist` 
        : `Saved "${product.name}" to wishlist`,
      'success'
    );
  };

  return (
    <div 
      className={`group relative w-full flex flex-col font-sans transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
        compact 
          ? 'gap-2 p-1.5 rounded-2xl border border-transparent' 
          : 'gap-3 p-2.5 rounded-[24px] border border-transparent hover:border-charcoal/[0.03] hover:bg-white/45 hover:shadow-[0_20px_50px_rgba(28,26,23,0.03)]'
      }`}
    >
      
      {/* 1. Portrait Image Container with Soft Shadow & Natural Warm BG */}
      <div 
        className={`relative aspect-[3/4] w-full overflow-hidden bg-[#FAF9F6] border border-charcoal/[0.03] group-hover:border-charcoal/[0.06] transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          compact ? 'rounded-xl shadow-[0_4px_16px_rgba(28,26,23,0.01)]' : 'rounded-2xl shadow-[0_8px_30px_rgba(28,26,23,0.015)]'
        }`}
      >
        <Link href={`/product/${product.slug}`} className="block w-full h-full relative">
          
          {/* Primary Product Image */}
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className={`w-full h-full object-cover object-center transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              secondaryImage 
                ? 'group-hover:opacity-0 group-hover:scale-[1.03]' 
                : 'group-hover:scale-[1.03]'
            }`}
          />

          {/* Secondary Hover/Lifestyle Image (Revealed on Hover) */}
          {secondaryImage && (
            <img
              src={secondaryImage}
              alt={`${product.name} lifestyle`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            />
          )}

          {/* Gentle, Premium Off-Black vignette at bottom to ground floats */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/[0.03] via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </Link>

        {/* Float Premium Terracotta/Clay Organic Discount Tag (Top Left) */}
        {hasDiscount && !isOutOfStock && (
          <div className={`absolute bg-[#B58D7C] text-sand font-sans font-bold uppercase tracking-[0.2em] z-10 border border-sand/15 select-none ${
            compact 
              ? 'top-2.5 left-2.5 text-[7px] px-2 py-0.5 rounded-md shadow-xs' 
              : 'top-3.5 left-3.5 text-[8px] px-2.5 py-1.5 rounded-lg shadow-[0_4px_12px_rgba(181,141,124,0.12)]'
          }`}>
            {compact ? `${discountPercent}%` : `${discountPercent}% OFF`}
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-charcoal/20 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className={`text-charcoal bg-sand/90 backdrop-blur-md font-bold uppercase tracking-[0.22em] shadow-md border border-charcoal/5 ${
              compact ? 'text-[7px] px-2.5 py-1.5 rounded-lg' : 'text-[8px] px-3.5 py-2.5 rounded-xl'
            }`}>
              Sold Out
            </span>
          </div>
        )}

        {/* Floating Heart / Wishlist Trigger */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute rounded-full flex items-center justify-center transition-all duration-500 shadow-sm z-10 cursor-pointer ${
            compact 
              ? 'top-2.5 right-2.5 w-7.5 h-7.5 bg-sand/85 text-stone-500 hover:text-charcoal border border-charcoal/5' 
              : 'top-3.5 right-3.5 w-8.5 h-8.5 bg-sand/75 text-stone-500 hover:text-charcoal hover:bg-white hover:border-charcoal/10 border border-charcoal/5 backdrop-blur-xs shadow-[0_4px_10px_rgba(0,0,0,0.015)] md:opacity-0 md:group-hover:opacity-100 md:translate-y-[-4px] md:group-hover:translate-y-0'
          } ${
            isFavorited
              ? 'bg-[#FAF9F6]/95 text-red-500 border border-red-100/20 shadow-md animate-pulse'
              : ''
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`transition-all duration-300 ${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${isFavorited ? 'fill-current scale-105' : 'group-hover:scale-105'}`} />
        </button>

        {/* Floating Elegant "Quick Add to Curation" button (Styled with warm sand glassmorphism) */}
        {!isOutOfStock && (
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className={`absolute left-3.5 right-3.5 rounded-xl flex items-center justify-center gap-2 text-[8px] font-sans font-bold uppercase tracking-[0.25em] transition-all duration-500 shadow-md cursor-pointer z-10 border border-charcoal/[0.04] ${
              compact 
                ? 'bottom-2.5 left-2.5 right-2.5 py-2.5 bg-sand/95 text-charcoal border border-charcoal/5 active:scale-95 shadow-xs' 
                : 'bottom-3.5 py-3 bg-sand/95 text-charcoal hover:bg-charcoal hover:text-sand hover:border-transparent backdrop-blur-xs md:opacity-0 md:translate-y-3 md:group-hover:translate-y-0 md:group-hover:opacity-100'
            } ${
              isAdding
                ? 'bg-primary text-sand'
                : ''
            }`}
          >
            <ShoppingBag className={`${compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} ${isAdding ? 'animate-bounce' : ''}`} />
            {isAdding ? 'Adding...' : 'Quick Add'}
          </button>
        )}
      </div>

      {/* 2. Text Metadata & Curation Details Section */}
      <div className={`flex flex-col px-0.5 ${compact ? 'gap-0' : 'gap-1'}`}>
        {/* Category & Stars Row */}
        <div className="flex justify-between items-center w-full">
          <span className="text-[8px] font-sans font-bold text-stone-400 uppercase tracking-[0.3em] leading-none">
            {categoryLabel}
          </span>
          
          {/* Rating Summary (Minimalist quiet design) */}
          {product.rating !== undefined && product.rating > 0 && (
            <div className="flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="text-[9px] font-bold text-stone-500 font-sans leading-none">
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Product Title - Clean Elegant Serif */}
        <Link
          href={`/product/${product.slug}`}
          className={`font-serif font-light text-charcoal hover:text-primary-dark transition-colors duration-500 leading-snug tracking-tight truncate mt-0.5 ${
            compact ? 'text-xs md:text-sm' : 'text-sm md:text-[15px]'
          }`}
        >
          {product.name}
        </Link>

        {/* Pricing & Quiet Savings Subtext */}
        <div className={`flex items-center mt-1 flex-wrap ${compact ? 'gap-1.5' : 'gap-2'}`}>
          {hasDiscount ? (
            <>
              {/* Discounted Sale Price */}
              <span className={`font-serif font-medium text-stone-900 leading-none ${
                compact ? 'text-xs md:text-sm' : 'text-sm md:text-[15px]'
              }`}>
                {formatCurrency(product.price)}
              </span>
              
              {/* Original Real Price */}
              <span className="font-sans text-[10px] md:text-xs text-stone-400 line-through leading-none">
                {formatCurrency(product.originalPrice!)}
              </span>
              
              {/* Delicate Editorial Savings Badge (Museum style) */}
              {!compact && (
                <span className="font-sans text-[8px] font-bold text-sage bg-sage/5 border border-sage/10 px-2 py-0.5 rounded-sm tracking-[0.1em] uppercase leading-none">
                  Save {formatCurrency(product.originalPrice! - product.price)}
                </span>
              )}
            </>
          ) : (
            <span className={`font-serif font-light text-stone-800 leading-none ${
              compact ? 'text-xs md:text-sm' : 'text-sm md:text-[15px]'
            }`}>
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
