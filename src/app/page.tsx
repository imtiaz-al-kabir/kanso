import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Heart } from 'lucide-react';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { getAestheticPlaceholder } from '@/lib/cloudinary';
import HomeHeroCarousel from '@/components/store/HomeHeroCarousel';

// In Planning mode, let's build an amazing Server Component homepage that queries DB
export default async function Home() {
  await connectDB();

  // Load featured products and categories
  const dbProducts = await Product.find({ isFeatured: true }).populate('category', 'name').limit(4).lean();
  const dbCategories = await Category.find({}).limit(3).lean();

  // Premium editorial collections (with fallback Unsplash images)
  const collectionFallbacks = [
    {
      name: 'Furniture',
      slug: 'furniture',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      tagline: 'Sculpted wooden frames & linen surfaces',
    },
    {
      name: 'Ceramics',
      slug: 'ceramics',
      image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
      tagline: 'Handcrafted stoneware and matte clay glazed bowls',
    },
    {
      name: 'Lighting',
      slug: 'lighting',
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
      tagline: 'Woven organic paper lanterns & warm shadows',
    },
  ];

  const categories = dbCategories.length > 0 
    ? dbCategories.map((c: any, index) => ({
        name: c.name,
        slug: c.slug,
        image: c.image || collectionFallbacks[index]?.image || getAestheticPlaceholder(index),
        tagline: c.description || collectionFallbacks[index]?.tagline || 'Earthy materials',
      }))
    : collectionFallbacks;

  // Visual fallback products if database is not yet seeded
  const productFallbacks = [
    {
      id: 'mock-1',
      name: 'Hasu Lounge Chair',
      slug: 'hasu-lounge-chair',
      price: 890,
      image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      categoryName: 'Furniture',
    },
    {
      id: 'mock-2',
      name: 'Enso Ceramic Tea Set',
      slug: 'enso-ceramic-tea-set',
      price: 180,
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      categoryName: 'Ceramics',
    },
    {
      id: 'mock-3',
      name: 'Kyoto Pendant Lantern',
      slug: 'kyoto-pendant-lantern',
      price: 340,
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      categoryName: 'Lighting',
    },
    {
      id: 'mock-4',
      name: 'Wabi Stoneware Vase',
      slug: 'wabi-stoneware-vase',
      price: 120,
      image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      categoryName: 'Ceramics',
    },
  ];

  const products = dbProducts.length > 0
    ? dbProducts.map((p: any) => ({
        id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        price: p.price,
        image: p.images[0],
        rating: p.rating || 4.5,
        categoryName: p.category ? p.category.name : 'Store',
      }))
    : productFallbacks;

  return (
    <div className="flex flex-col gap-24 md:gap-32 w-full animate-fade-up">
      {/* 1. Cinematic Hero Carousel Section */}
      <HomeHeroCarousel />

      {/* 2. Premium Collection Grid */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 max-w-lg">
          <span className="text-[10px] tracking-[0.25em] font-bold text-stone-400 uppercase">
            Curated Categories
          </span>
          <h2 className="font-serif text-3xl font-light text-charcoal">
            The Japandi Blueprint
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group relative h-[360px] rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${cat.image}')` }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-charcoal/20 transition-colors duration-500" />

              {/* Text caption (glassmorphic pill) */}
              <div className="absolute bottom-6 left-6 right-6 p-5 glass-panel rounded-xl flex items-center justify-between shadow-lg group-hover:translate-y-[-4px] transition-transform duration-500">
                <div className="flex flex-col gap-1">
                  <span className="font-serif text-base font-semibold text-charcoal">{cat.name}</span>
                  <span className="text-[10px] text-stone-500 font-medium font-sans">{cat.tagline}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-charcoal text-sand flex items-center justify-center shrink-0">
                  <ArrowRight className="w-4 h-4 text-current transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Editorial Philosophy Callout */}
      <section className="bg-sand rounded-3xl p-8 md:p-20 flex flex-col md:flex-row items-center gap-12 border border-charcoal/5">
        <div 
          className="w-full md:w-1/2 h-[350px] md:h-[450px] rounded-2xl bg-cover bg-center shadow-md shrink-0"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80')` }}
        />
        <div className="w-full md:w-1/2 flex flex-col gap-6 justify-center">
          <span className="text-[10px] tracking-[0.25em] font-bold text-primary uppercase">
            Design Philosophy
          </span>
          <h3 className="font-serif text-3xl md:text-4xl font-light text-charcoal leading-tight">
            Beauty in Imperfection, Strength in Simplicity.
          </h3>
          <p className="font-sans text-xs md:text-sm text-stone-500 font-light leading-relaxed">
            KANSO represents the intersection of Japanese Zen minimalism and Scandinavian warmth (Japandi). We believe objects shouldn’t compete for attention. Instead, they should whisper, bringing tactile solace, spacious luxury, and soft organic grounding to the active modern home.
          </p>
          <div className="border-t border-charcoal/10 pt-6 flex gap-8">
            <div className="flex flex-col gap-1">
              <span className="font-serif text-2xl font-semibold text-charcoal">100%</span>
              <span className="text-[10px] uppercase font-bold text-stone-400">Organic Wood & Clay</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-serif text-2xl font-semibold text-charcoal">Free</span>
              <span className="text-[10px] uppercase font-bold text-stone-400">Global Carbon-Neutral Ship</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured products Carousel / Grid */}
      <section className="flex flex-col gap-8">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.25em] font-bold text-stone-400 uppercase">
              Featured Items
            </span>
            <h2 className="font-serif text-3xl font-light text-charcoal">
              Tactile Masterpieces
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal hover:opacity-75 transition-opacity"
          >
            Shop All Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="flex flex-col gap-4 relative group"
            >
              {/* Product Card Image Container */}
              <Link
                href={`/product/${prod.slug}`}
                className="relative h-[220px] md:h-[300px] rounded-2xl overflow-hidden shadow-sm bg-sand"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-104"
                  style={{ backgroundImage: `url('${prod.image}')` }}
                />
                {/* Visual Glassmorphic Tag */}
                <div className="absolute top-4 left-4 glass-panel px-3 py-1 rounded-full text-[9px] font-sans font-bold uppercase tracking-wider text-stone-600">
                  {prod.categoryName}
                </div>
              </Link>

              {/* Text Meta */}
              <div className="flex flex-col gap-1 px-1">
                <div className="flex justify-between items-start gap-2">
                  <Link
                    href={`/product/${prod.slug}`}
                    className="font-serif text-sm font-semibold text-charcoal hover:opacity-75 transition-opacity truncate max-w-[70%]"
                  >
                    {prod.name}
                  </Link>
                  <span className="font-sans text-xs font-bold text-stone-600 shrink-0">
                    ${prod.price}
                  </span>
                </div>
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                  <span className="text-[10px] font-bold text-stone-500 font-sans">{prod.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center md:hidden pt-4">
          <Link
            href="/shop"
            className="w-full bg-charcoal text-sand py-4 rounded-xl text-center text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors"
          >
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
}
