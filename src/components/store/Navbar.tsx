'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Search, User, Menu, X, Shield, Phone, ChevronDown, LayoutGrid } from 'lucide-react';
import { useStore } from '@/providers/StoreProvider';
import { logoutAction } from '@/actions/authActions';
import { useToast } from '@/providers/ToastProvider';

interface NavbarProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

const categories = [
  { name: 'Furniture', slug: 'furniture', emoji: '🪑' },
  { name: 'Ceramics', slug: 'ceramics', emoji: '🏺' },
  { name: 'Lighting', slug: 'lighting', emoji: '🕯️' },
];

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const { cart, wishlist } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    const res = await logoutAction();
    if (res.success) {
      toast('Successfully logged out', 'success');
      router.refresh();
      router.push('/');
    } else {
      toast('Failed to log out', 'error');
    }
  };

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* ═══════════════════════════════════════════════
          STICKY HEADER WRAPPER
      ═══════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 w-full shadow-sm">

        {/* ─── ROW 1: Logo · Search · Hotline · Wishlist · Cart · User ─── */}
        <div className="bg-charcoal text-sand w-full">
          <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center gap-4 md:gap-6">

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-sand hover:text-primary transition-colors shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="font-serif text-2xl md:text-3xl font-bold tracking-[0.25em] text-sand hover:text-primary transition-colors shrink-0"
            >
              KANSO
            </Link>

            {/* Search bar (grows to fill space) */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 items-center bg-white/10 border border-white/15 rounded-xl overflow-hidden mx-4 focus-within:border-primary/60 transition-colors"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for furniture, ceramics, lighting…"
                className="flex-1 bg-transparent px-5 py-3 text-sm text-sand placeholder-sand/40 focus:outline-none font-sans"
              />
              <button
                type="submit"
                className="shrink-0 bg-primary text-charcoal px-5 py-3 font-bold text-xs uppercase tracking-widest hover:bg-stone-200 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Hotline (desktop only) */}
            <a
              href="tel:+8801711234567"
              className="hidden lg:flex items-center gap-2 shrink-0 text-sand/80 hover:text-sand transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] font-bold uppercase tracking-widest text-sand/50">Hotline</span>
                <span className="text-xs font-bold">01711-234567</span>
              </div>
            </a>

            {/* Action icons */}
            <div className="flex items-center gap-1 md:gap-3 ml-auto md:ml-0 shrink-0">
              {/* Mobile search button */}
              <button
                onClick={() => router.push('/shop')}
                className="md:hidden p-2 text-sand/80 hover:text-sand transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative p-2 text-sand/80 hover:text-sand transition-colors group" aria-label="Wishlist">
                <Heart className="w-5 h-5 group-hover:fill-primary group-hover:text-primary transition-all" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary text-charcoal rounded-full text-[9px] font-bold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative p-2 text-sand/80 hover:text-sand transition-colors" aria-label="Cart">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary text-charcoal rounded-full text-[9px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User / Auth */}
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="md:hidden p-2 text-sand/80 hover:text-sand transition-colors touch-manipulation"
                    aria-label="My profile"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary text-charcoal flex items-center justify-center font-bold text-xs font-sans">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </Link>
                  <div className="relative group hidden md:block">
                    <button
                      type="button"
                      className="flex items-center gap-1.5 p-2 text-sand/80 hover:text-sand transition-colors cursor-pointer"
                      aria-label="Account menu"
                    >
                      <div className="w-7 h-7 rounded-full bg-primary text-charcoal flex items-center justify-center font-bold text-xs font-sans">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold max-w-[60px] truncate hidden lg:block">{user.name.split(' ')[0]}</span>
                      <ChevronDown className="w-3.5 h-3.5 hidden lg:block" />
                    </button>
                    {/* Dropdown */}
                    <div className="absolute right-0 pt-2 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50">
                      <div className="bg-white rounded-xl shadow-xl border border-stone-100 py-2 flex flex-col text-xs font-semibold text-stone-600">
                        <div className="px-4 py-2 border-b border-stone-100 mb-1">
                          <span className="text-[10px] uppercase tracking-widest text-stone-400">Signed in as</span>
                          <p className="text-charcoal font-bold truncate">{user.email}</p>
                        </div>
                        <Link href="/profile" className="px-4 py-2.5 hover:bg-charcoal/5 hover:text-charcoal">
                          My Profile
                        </Link>
                        {user.role === 'admin' && (
                          <Link href="/admin" className="px-4 py-2.5 hover:bg-charcoal/5 hover:text-charcoal flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-primary" />
                            Admin Dashboard
                          </Link>
                        )}
                        <Link href="/orders" className="px-4 py-2.5 hover:bg-charcoal/5 hover:text-charcoal">My Orders</Link>
                        <hr className="border-stone-100 my-1" />
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="px-4 py-2.5 hover:bg-red-50 hover:text-red-600 text-left w-full cursor-pointer"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="md:hidden p-2 text-sand/80 hover:text-sand transition-colors touch-manipulation"
                    aria-label="Sign in"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/auth/login"
                    className="hidden md:flex items-center gap-1.5 bg-primary text-charcoal px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-stone-200 transition-colors shrink-0"
                  >
                    <User className="w-3.5 h-3.5" />
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ─── ROW 2: Nav Menu · Categories ─── */}
        <nav className="hidden md:block bg-sand border-b border-charcoal/8 w-full">
          <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center gap-0 h-11">

            {/* Categories mega button */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setIsCatOpen(true)}
              onMouseLeave={() => setIsCatOpen(false)}
            >
              <button className="flex items-center gap-2 h-full px-5 bg-charcoal text-sand text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors cursor-pointer">
                <LayoutGrid className="w-3.5 h-3.5" />
                All Categories
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCatOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown panel */}
              {isCatOpen && (
                <div className="absolute top-full left-0 w-52 bg-white shadow-xl border border-stone-100 rounded-b-xl z-50 overflow-hidden">
                  <div className="py-2">
                    <Link
                      href="/shop"
                      className="flex items-center gap-3 px-5 py-3 text-xs font-bold text-stone-600 hover:bg-sand hover:text-charcoal transition-colors border-b border-stone-100"
                    >
                      <span className="text-base">🛒</span>
                      Shop All
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/shop?category=${cat.slug}`}
                        className="flex items-center gap-3 px-5 py-3 text-xs font-semibold text-stone-600 hover:bg-sand hover:text-charcoal transition-colors"
                      >
                        <span className="text-base">{cat.emoji}</span>
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Nav links */}
            <div className="flex items-center h-full ml-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href === '/shop' && pathname.startsWith('/shop'));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`h-full flex items-center px-5 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 ${
                      isActive
                        ? 'border-charcoal text-charcoal'
                        : 'border-transparent text-stone-500 hover:text-charcoal hover:border-charcoal/30'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right side: hotline on smaller desktops */}
            <div className="ml-auto flex items-center gap-4">
              <a
                href="tel:+8801711234567"
                className="lg:hidden flex items-center gap-1.5 text-stone-500 hover:text-charcoal transition-colors text-xs font-semibold"
              >
                <Phone className="w-3.5 h-3.5" />
                01711-234567
              </a>
              <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold hidden lg:block">
                Free delivery on orders above ৳5,000
              </span>
            </div>
          </div>
        </nav>
      </header>

      {/* ═══════════════════════════════════════════════
          MOBILE DRAWER
      ═══════════════════════════════════════════════ */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-charcoal/30 backdrop-blur-sm"
          />
          {/* Drawer */}
          <div className="fixed top-0 left-0 w-4/5 max-w-xs h-full bg-sand shadow-2xl border-r border-charcoal/5 flex flex-col z-10">
            {/* Drawer header */}
            <div className="bg-charcoal text-sand flex items-center justify-between px-6 py-5">
              <span className="font-serif text-xl font-bold tracking-[0.2em]">KANSO</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sand/60 hover:text-sand p-1.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile search */}
            <form
              onSubmit={(e) => { handleSearchSubmit(e); setIsMobileMenuOpen(false); }}
              className="flex items-center border-b border-charcoal/8 px-4 py-3 bg-white/50"
            >
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="flex-1 bg-transparent px-3 py-1 text-sm text-charcoal placeholder-stone-400 focus:outline-none font-sans"
              />
            </form>

            {/* Scrollable nav content */}
            <div className="flex-1 overflow-y-auto">
              {/* Main links */}
              <nav className="flex flex-col py-4 font-sans text-sm font-bold uppercase tracking-widest text-stone-600 border-b border-charcoal/8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-6 py-3.5 hover:bg-charcoal/5 hover:text-charcoal transition-colors ${pathname === link.href ? 'text-charcoal bg-charcoal/5' : ''}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Categories */}
              <div className="py-4 border-b border-charcoal/8">
                <span className="px-6 text-[9px] font-bold uppercase tracking-[0.25em] text-stone-400 block mb-2">Shop by Category</span>
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-3 text-sm font-semibold text-stone-600 hover:bg-charcoal/5 hover:text-charcoal transition-colors"
                >
                  <span className="text-base">🛒</span> Shop All
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/shop?category=${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-6 py-3 text-sm font-semibold text-stone-600 hover:bg-charcoal/5 hover:text-charcoal transition-colors"
                  >
                    <span className="text-base">{cat.emoji}</span> {cat.name}
                  </Link>
                ))}
              </div>

              {/* Admin link */}
              {user?.role === 'admin' && (
                <div className="py-2 border-b border-charcoal/8">
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-primary hover:bg-charcoal/5 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Link>
                </div>
              )}
            </div>

            {/* Drawer footer: user / hotline */}
            <div className="border-t border-charcoal/8 px-6 py-5 flex flex-col gap-3 bg-white/30">
              <a href="tel:+8801711234567" className="flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-charcoal">
                <Phone className="w-4 h-4" /> Hotline: 01711-234567
              </a>
              {user ? (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-charcoal">{user.name}</span>
                  <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-stone-500 hover:text-charcoal">My Orders</Link>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                    className="w-full py-2.5 rounded-lg bg-charcoal/5 hover:bg-red-50 hover:text-red-600 text-xs font-bold uppercase tracking-wider text-stone-600 cursor-pointer transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3 rounded-lg bg-charcoal text-sand text-xs font-bold uppercase tracking-widest text-center hover:bg-stone-800 transition-colors touch-manipulation"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3 rounded-lg border border-charcoal/15 text-charcoal text-xs font-bold uppercase tracking-widest text-center hover:bg-charcoal/5 transition-colors touch-manipulation"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
