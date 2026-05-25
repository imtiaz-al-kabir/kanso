'use client';

import React, { useState, startTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Heart, ShoppingBag, Truck, Calendar, Sparkles, MessageSquare } from 'lucide-react';
import { useStore } from '@/providers/StoreProvider';
import { useToast } from '@/providers/ToastProvider';
import { createReviewAction } from '@/actions/productActions';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';

interface ProductDetailsClientProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    originalPrice: number | null;
    images: string[];
    category: { name: string; slug: string } | null;
    countInStock: number;
    variants: string[];
    rating: number;
    numReviews: number;
  };
  related: { id: string; name: string; slug: string; price: number; images: string[]; rating: number }[];
  reviews: { id: string; username: string; rating: number; comment: string; createdAt: string }[];
  user: { id: string; name: string; email: string; role: string } | null;
}

export function ProductDetailsClient({ product, related, reviews, user }: ProductDetailsClientProps) {
  const router = useRouter();
  const toast = useToast();
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] || '');
  const [quantity, setQuantity] = useState(1);
  
  // Review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const favorited = isInWishlist(product.id);
  const isOutOfStock = product.countInStock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart({
      product: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      variant: selectedVariant,
      countInStock: product.countInStock,
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast('Please log in to leave a review', 'error');
      return;
    }

    setIsSubmittingReview(true);
    const res = await createReviewAction({
      productId: product.id,
      rating,
      comment,
    });
    setIsSubmittingReview(false);

    if (res.success) {
      toast('Thank you! Your review has been submitted.', 'success');
      setComment('');
      // Smoothly update the Server Component data in React 19 / Next 16
      startTransition(() => {
        router.refresh();
      });
    } else {
      toast(res.error || 'Failed to submit review', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-24 font-sans">
      {/* 1. Cinematic Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Side: Dynamic Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative h-[400px] md:h-[550px] rounded-3xl overflow-hidden shadow-sm bg-sand">
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-500 scale-100"
              style={{ backgroundImage: `url('${product.images[activeImage]}')` }}
            />
            {product.countInStock > 0 && product.countInStock < 5 && (
              <div className="absolute top-4 left-4 bg-charcoal text-sand text-[9px] font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm animate-pulse">
                Low Stock: {product.countInStock} Left
              </div>
            )}
          </div>
          
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImage === i ? 'border-charcoal' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${img}')` }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Editorial Metadata */}
        <div className="flex flex-col gap-6 lg:py-4">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.25em] font-bold text-stone-400 uppercase">
              {product.category?.name || 'Studio'} Collection
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-light text-charcoal tracking-tight leading-tight">
              {product.name}
            </h1>
            
            {/* Rating summary */}
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex items-center">
                <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                <span className="text-xs font-bold text-stone-600 ml-1">{product.rating}</span>
              </div>
              <span className="text-stone-400 font-light text-xs">•</span>
              <span className="text-xs text-stone-500 font-light font-sans">{product.numReviews} guest reviews</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-3">
            <span className="font-serif text-2xl font-semibold text-charcoal">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="font-sans text-sm text-stone-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <hr className="border-charcoal/5" />

          {/* Description */}
          <p className="text-stone-500 font-light text-xs md:text-sm leading-relaxed">
            {product.description}
          </p>

          <hr className="border-charcoal/5" />

          {/* Variant Selector */}
          {product.variants.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Select Style / Variant</span>
              <div className="flex gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      selectedVariant === v
                        ? 'border-charcoal bg-charcoal text-sand shadow-sm'
                        : 'border-charcoal/10 text-stone-500 hover:border-charcoal/30'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Quantity</span>
              <div className="flex items-center gap-3 bg-sand border border-charcoal/5 w-32 rounded-lg p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-stone-500 hover:text-charcoal hover:bg-stone-200 transition-colors"
                >
                  -
                </button>
                <span className="flex-1 text-center text-xs font-bold text-charcoal">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.countInStock, q + 1))}
                  className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-stone-500 hover:text-charcoal hover:bg-stone-200 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Checkout/Cart Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleAddToCart}
              variant={isOutOfStock ? 'outline' : 'primary'}
              className="flex-1 py-4 flex items-center gap-2.5"
              disabled={isOutOfStock}
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              {isOutOfStock ? 'Sold Out' : 'Add to Collection'}
            </Button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`w-14 h-14 rounded-lg flex items-center justify-center border transition-all cursor-pointer active:scale-95 ${
                favorited
                  ? 'bg-red-50 border-red-200 text-red-500 shadow-xs'
                  : 'border-charcoal/15 text-stone-500 hover:border-charcoal/30'
              }`}
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Trust points */}
          <div className="grid grid-cols-2 gap-4 border-t border-charcoal/5 pt-6 text-[10px] font-bold uppercase tracking-widest text-stone-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-stone-400 shrink-0" />
              <span>Carbon-Neutral Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
              <span>Ships in 24 Hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Reviews Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 border-t border-charcoal/5 pt-16">
        {/* Left column: review stats & form */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.25em] font-bold text-stone-400 uppercase">Feedback</span>
            <h3 className="font-serif text-2xl font-light text-charcoal">Stoneware Reviews</h3>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-4xl font-semibold text-charcoal">{product.rating}</span>
              <span className="text-xs text-stone-400 font-light">/ 5.0 rating</span>
            </div>
            <div className="flex items-center gap-0.5 text-primary">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= Math.round(product.rating) ? 'fill-current' : 'text-stone-300'
                  }`}
                />
              ))}
            </div>

            {/* Review form if user is authenticated */}
            {user ? (
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3 mt-2 border-t border-charcoal/5 pt-4">
                <span className="text-[10px] uppercase font-bold text-stone-400">Leave your review</span>
                
                {/* Star selectors */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-0.5 text-primary hover:scale-110 active:scale-95 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${s <= rating ? 'fill-current' : 'text-stone-300'}`} />
                    </button>
                  ))}
                </div>

                <Textarea
                  placeholder="Share your thoughts about this design..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
                
                <Button type="submit" variant="primary" size="sm" isLoading={isSubmittingReview}>
                  Post Review
                </Button>
              </form>
            ) : (
              <div className="bg-sand/80 rounded-xl p-4 border border-charcoal/5 text-center mt-2 flex flex-col gap-2">
                <span className="text-[10px] uppercase font-bold text-stone-400">Share your thoughts</span>
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  You must be registered and signed in to leave reviews.
                </p>
                <Link
                  href="/auth/login"
                  className="bg-charcoal text-sand text-[10px] font-bold uppercase tracking-wider py-2.5 rounded-lg hover:bg-stone-800 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right column: reviews feed */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <span className="text-[10px] tracking-[0.25em] font-bold text-stone-400 uppercase">Reviews Log</span>
          
          {reviews.length > 0 ? (
            <div className="flex flex-col gap-4 max-h-[480px] overflow-y-auto pr-2">
              {reviews.map((rev) => (
                <div key={rev.id} className="glass-panel p-5 rounded-2xl flex flex-col gap-3">
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-serif text-sm font-semibold text-charcoal">{rev.username}</span>
                    <span className="text-[9px] text-stone-400 font-sans font-bold uppercase tracking-wider">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  
                  {/* Star row */}
                  <div className="flex items-center text-primary gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-current' : 'text-stone-200'}`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-stone-500 leading-relaxed font-light">{rev.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel p-10 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
              <MessageSquare className="w-8 h-8 text-stone-300" />
              <h4 className="font-serif text-sm font-semibold text-charcoal">No reviews yet</h4>
              <p className="font-sans text-[11px] text-stone-400 max-w-xs font-light">
                Be the first to share feedback for this handcrafted design!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3. Related Products Grid */}
      {related.length > 0 && (
        <section className="flex flex-col gap-8 border-t border-charcoal/5 pt-16">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.25em] font-bold text-stone-400 uppercase">Inspiration</span>
            <h3 className="font-serif text-2xl font-light text-charcoal">Complete the Aesthetic</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((item) => (
              <div key={item.id} className="flex flex-col gap-4 relative group">
                <Link
                  href={`/product/${item.slug}`}
                  className="relative h-[180px] md:h-[260px] rounded-2xl overflow-hidden shadow-sm bg-sand"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-104"
                    style={{ backgroundImage: `url('${item.images[0]}')` }}
                  />
                </Link>
                <div className="flex flex-col gap-1 px-1">
                  <div className="flex justify-between items-start gap-2">
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-serif text-xs md:text-sm font-semibold text-charcoal hover:opacity-75 truncate max-w-[70%]"
                    >
                      {item.name}
                    </Link>
                    <span className="font-sans text-xs font-bold text-stone-600 shrink-0">
                      ${item.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    <span className="text-[10px] font-bold text-stone-500 font-sans">{item.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetailsClient;
