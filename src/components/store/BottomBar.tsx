'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, ShoppingBag, Search, User } from 'lucide-react';
import { useStore } from '@/providers/StoreProvider';

export function BottomBar() {
  const pathname = usePathname();
  const { cart, wishlist } = useStore();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Hide bottom bar on admin panel
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const linkStyles = (path: string) => {
    const isActive = pathname === path;
    return `flex flex-col items-center justify-center gap-1.5 flex-1 relative transition-colors ${
      isActive ? 'text-charcoal' : 'text-stone-400'
    }`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-sand/85 backdrop-blur-lg border-t border-charcoal/5 px-6 py-3 pb-safe-bottom flex items-center justify-between">
      <Link href="/" className={linkStyles('/')}>
        <Home className="w-5 h-5" />
        <span className="text-[9px] font-sans font-bold uppercase tracking-wider">Home</span>
      </Link>

      <Link href="/shop" className={linkStyles('/shop')}>
        <Search className="w-5 h-5" />
        <span className="text-[9px] font-sans font-bold uppercase tracking-wider">Shop</span>
      </Link>

      <Link href="/wishlist" className={linkStyles('/wishlist')}>
        <Heart className="w-5 h-5" />
        {wishlist.length > 0 && (
          <span className="absolute top-0 right-5 w-3.5 h-3.5 bg-primary text-charcoal rounded-full text-[8px] font-bold flex items-center justify-center">
            {wishlist.length}
          </span>
        )}
        <span className="text-[9px] font-sans font-bold uppercase tracking-wider">Wishlist</span>
      </Link>

      <Link href="/cart" className={linkStyles('/cart')}>
        <ShoppingBag className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute top-0 right-5 w-3.5 h-3.5 bg-charcoal text-sand rounded-full text-[8px] font-bold flex items-center justify-center">
            {cartCount}
          </span>
        )}
        <span className="text-[9px] font-sans font-bold uppercase tracking-wider">Cart</span>
      </Link>

      <Link href="/orders" className={linkStyles('/orders')}>
        <User className="w-5 h-5" />
        <span className="text-[9px] font-sans font-bold uppercase tracking-wider">Account</span>
      </Link>
    </div>
  );
}

export default BottomBar;
