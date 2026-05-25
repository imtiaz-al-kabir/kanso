'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck, Heart } from 'lucide-react';
import { useStore } from '@/providers/StoreProvider';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQty } = useStore();

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 200 || subtotal === 0 ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <div className="flex flex-col gap-12 w-full animate-fade-up font-sans">
      {/* Page Title */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] tracking-[0.3em] font-bold text-stone-400 uppercase">Your Curation</span>
        <h1 className="font-serif text-3xl md:text-4xl font-light text-charcoal tracking-tight">Shopping Cart</h1>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Cart list (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                <div className="flex items-center gap-5 w-full sm:w-auto">
                  {/* Image */}
                  <div
                    className="w-20 h-20 rounded-xl bg-cover bg-center bg-sand shrink-0 shadow-xs"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  />
                  
                  {/* Meta */}
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-serif text-sm font-semibold text-charcoal truncate">
                      {item.name}
                    </span>
                    {item.variant && (
                      <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                        Style: {item.variant}
                      </span>
                    )}
                    <span className="text-xs font-bold text-stone-600 sm:hidden">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </div>

                {/* Controls (quantity, price, delete) */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-charcoal/5 pt-4 sm:pt-0">
                  {/* Quantity selector */}
                  <div className="flex items-center gap-2 bg-sand border border-charcoal/5 rounded-lg p-0.5">
                    <button
                      onClick={() => updateCartQty(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-stone-400 hover:text-charcoal hover:bg-stone-200 transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-charcoal">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQty(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-stone-400 hover:text-charcoal hover:bg-stone-200 transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <span className="hidden sm:block font-sans text-sm font-bold text-stone-600 w-20 text-right">
                    {formatCurrency(item.price * item.quantity)}
                  </span>

                  {/* Delete button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-stone-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary (1 col) */}
          <div className="flex flex-col gap-6">
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5 shadow-sm">
              <h3 className="font-serif text-base font-semibold text-charcoal border-b border-charcoal/5 pb-3">Curation Summary</h3>
              
              <div className="flex flex-col gap-3 font-sans text-xs text-stone-500 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-charcoal font-bold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-primary font-bold uppercase tracking-wider">Free Shipping</span>
                  ) : (
                    <span className="text-charcoal font-bold">{formatCurrency(shipping)}</span>
                  )}
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-stone-400 font-light leading-relaxed">
                    Spend {formatCurrency(200 - subtotal)} more to unlock complimentary global shipping.
                  </p>
                )}
                
                <hr className="border-charcoal/5 my-1" />

                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-charcoal">Total Curation</span>
                  <span className="text-charcoal font-bold text-base">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="pt-2">
                <Link
                  href="/checkout"
                  className="w-full inline-flex items-center justify-center gap-2 bg-charcoal text-sand py-4 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-stone-800 transition-all duration-300 shadow-lg active:scale-97 group cursor-pointer"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-stone-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Secure SSL Checkout</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Cart State */
        <div className="glass-panel p-16 rounded-2xl flex flex-col items-center justify-center text-center gap-5 py-28 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-sand flex items-center justify-center text-stone-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-xl font-semibold text-charcoal">Your cart is empty</h2>
          <p className="font-sans text-xs text-stone-400 max-w-xs leading-relaxed font-light">
            You haven't added any tactile masterpieces to your curation yet. Explore our latest designs to get started.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="bg-charcoal text-sand text-xs font-bold tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-stone-800 transition-colors shadow-lg active:scale-97 inline-block"
            >
              Start Curation
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
