import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, FolderHeart, ShieldAlert, ArrowLeft, Layers, User, LogOut, Users } from 'lucide-react';
import { getAuthUser } from '@/lib/auth';
import { logoutAction } from '@/actions/authActions';

export const metadata = {
  title: 'KANSO Admin | Studio Management',
  description: 'Merchant dashboard for order fulfillment and stock audits.',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  // Safeguard: verify admin authorization
  if (!user || user.role !== 'admin') {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans -mx-6 md:-mx-8 -my-6 md:-my-6">
      {/* 1. Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-charcoal text-stone-300 flex flex-col md:min-h-screen border-r border-charcoal/10 shrink-0 select-none">
        {/* Sidebar Header */}
        <div className="p-6 h-20 border-b border-stone-800 flex items-center justify-between">
          <Link href="/admin" className="font-serif text-xl font-bold tracking-[0.2em] text-sand">
            KANSO <span className="text-[10px] bg-primary text-charcoal font-sans px-1.5 py-0.5 rounded ml-1 font-bold uppercase tracking-widest">Merch</span>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-1 md:gap-1.5 text-xs font-bold uppercase tracking-wider">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 hover:text-sand transition-all shrink-0 md:w-full"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Overview</span>
          </Link>

          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 hover:text-sand transition-all shrink-0 md:w-full"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Products</span>
          </Link>

          <Link
            href="/admin/categories"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 hover:text-sand transition-all shrink-0 md:w-full"
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>Categories</span>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 hover:text-sand transition-all shrink-0 md:w-full"
          >
            <FolderHeart className="w-4 h-4 shrink-0" />
            <span>Orders</span>
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 hover:text-sand transition-all shrink-0 md:w-full"
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Users</span>
          </Link>

          <div className="hidden md:block my-4 border-t border-stone-800 w-full" />

          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 hover:text-sand transition-all shrink-0 md:w-full text-stone-400 mt-auto"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Storefront</span>
          </Link>
        </nav>

        {/* User Info footer */}
        <div className="hidden md:flex p-4 border-t border-stone-800 bg-stone-900/50 items-center justify-between text-xs text-stone-400 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary text-charcoal flex items-center justify-center font-bold font-sans">
              {user.name.charAt(0)}
            </div>
            <span className="truncate max-w-[100px]">{user.name}</span>
          </div>
        </div>
      </aside>

      {/* 2. Scrollable Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        {/* Simple top info alert */}
        <div className="mb-6 flex justify-between items-center bg-sand border border-charcoal/5 p-4 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 text-stone-500 font-sans text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Merchandising Mode Active</span>
          </div>
          <span className="font-sans text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            Kanso Merchant Terminal
          </span>
        </div>
        
        {children}
      </main>
    </div>
  );
}
