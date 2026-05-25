'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Package, Info } from 'lucide-react';
import BottomBarProfileTab from './BottomBarProfileTab';

export function BottomBar() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const linkStyles = (path: string) => {
    const isActive = pathname === path || (path !== '/' && pathname.startsWith(path));
    return `flex flex-col items-center justify-center gap-1 flex-1 relative transition-all duration-300 ${
      isActive ? 'text-charcoal scale-105' : 'text-stone-400 hover:text-charcoal'
    }`;
  };

  const isHome = pathname === '/';
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#FAF9F6]/95 backdrop-blur-md border-t border-charcoal/[0.04] flex items-stretch justify-around h-[60px] pb-safe-bottom shadow-[0_-4px_20px_rgba(28,26,23,0.05)] pointer-events-auto">
      <Link href="/shop" className={`${linkStyles('/shop')} z-10 touch-manipulation`}>
        <Search className="w-[18px] h-[18px]" />
        <span className="text-[9px] font-sans font-bold uppercase tracking-wider">Shop</span>
      </Link>

      <Link href="/orders" className={`${linkStyles('/orders')} z-10 touch-manipulation`}>
        <Package className="w-[18px] h-[18px]" />
        <span className="text-[9px] font-sans font-bold uppercase tracking-wider">Orders</span>
      </Link>

      <Link
        href="/"
        className="flex flex-col items-center justify-center gap-0.5 flex-1 relative z-10 select-none transition-all duration-300 active:scale-95 touch-manipulation"
      >
        <div
          className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-300 ${
            isHome
              ? 'bg-charcoal text-[#FAF9F6] shadow-[0_2px_10px_rgba(28,26,23,0.18)]'
              : 'text-stone-400 hover:text-charcoal'
          }`}
        >
          <Home className={`transition-all duration-300 ${isHome ? 'w-[20px] h-[20px]' : 'w-[18px] h-[18px]'}`} />
          <span
            className={`text-[9px] font-sans font-bold uppercase tracking-wider transition-all duration-300 ${
              isHome ? 'opacity-100' : 'opacity-70'
            }`}
          >
            Home
          </span>
        </div>
      </Link>

      <Link href="/about" className={`${linkStyles('/about')} z-10 touch-manipulation`}>
        <Info className="w-[18px] h-[18px]" />
        <span className="text-[9px] font-sans font-bold uppercase tracking-wider">About</span>
      </Link>

      <BottomBarProfileTab />
    </div>
  );
}

export default BottomBar;
