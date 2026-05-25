'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useToast } from '@/providers/ToastProvider';

export function Footer() {
  const pathname = usePathname();
  const toast = useToast();
  const [email, setEmail] = useState('');

  // Hide on admin layout
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast('Thank you for subscribing to our journal!', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-charcoal text-stone-300 font-sans mt-24 border-t border-charcoal/5">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-5 md:pr-8">
          <span className="font-serif text-2xl font-bold tracking-[0.25em] text-sand">KANSO</span>
          <p className="text-stone-400 text-xs leading-relaxed font-light">
            Crafting minimal spaces with Japandi aesthetics. Premium luxury products designed for mindful modern living.
          </p>
        </div>

        {/* Explore */}
        <div className="flex flex-col gap-4">
          <span className="text-[10px] tracking-[0.2em] font-bold text-sand uppercase">Explore</span>
          <div className="flex flex-col gap-2.5 text-xs text-stone-400">
            <Link href="/shop" className="hover:text-sand transition-colors">Shop All</Link>
            <Link href="/shop?category=furniture" className="hover:text-sand transition-colors">Furniture</Link>
            <Link href="/shop?category=ceramics" className="hover:text-sand transition-colors">Ceramics</Link>
            <Link href="/shop?category=lighting" className="hover:text-sand transition-colors">Lighting</Link>
          </div>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-4">
          <span className="text-[10px] tracking-[0.2em] font-bold text-sand uppercase">Company</span>
          <div className="flex flex-col gap-2.5 text-xs text-stone-400">
            <Link href="/about" className="hover:text-sand transition-colors">Our Story</Link>
            <Link href="/contact" className="hover:text-sand transition-colors">Contact</Link>
            <Link href="/careers" className="hover:text-sand transition-colors">Journal</Link>
            <Link href="/terms" className="hover:text-sand transition-colors">Shipping & Returns</Link>
          </div>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-4">
          <span className="text-[10px] tracking-[0.2em] font-bold text-sand uppercase">Subscribe</span>
          <p className="text-stone-400 text-xs leading-relaxed font-light mb-1">
            Join the KANSO journal for exclusive updates and design inspiration.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2 w-full max-w-sm">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-4 py-2.5 text-xs text-sand focus:outline-none focus:border-primary transition-colors font-medium placeholder-stone-500"
            />
            <button
              type="submit"
              className="bg-sand text-charcoal hover:bg-stone-200 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors uppercase tracking-wider shrink-0 cursor-pointer"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-stone-800 py-8 px-6 text-center text-[10px] uppercase tracking-widest text-stone-500 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <span>© {new Date().getFullYear()} KANSO LTD. ALL RIGHTS RESERVED.</span>
        <span>CRAFTED WITH MINIMAL LUXURY</span>
      </div>
    </footer>
  );
}

export default Footer;
