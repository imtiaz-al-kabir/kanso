'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastProvider';

export interface CartItem {
  id: string; // combination of productId and variant
  product: string; // product ID
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant: string;
  countInStock: number;
}

interface StoreContextType {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQty: (itemId: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const toast = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('luxury_cart');
    const savedWishlist = localStorage.getItem('luxury_wishlist');
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
    
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error(e);
      }
    }
    
    setIsMounted(true);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('luxury_cart', JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('luxury_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isMounted]);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    const itemId = `${newItem.product}-${newItem.variant || 'default'}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === itemId);

      if (existingIndex > -1) {
        const existingItem = prev[existingIndex];
        const newQty = existingItem.quantity + newItem.quantity;

        if (newQty > newItem.countInStock) {
          // Defer toast outside of the setState updater to avoid updating
          // ToastProvider state while StoreProvider is rendering.
          setTimeout(() => toast(`Cannot exceed available stock (${newItem.countInStock})`, 'error'), 0);
          return prev; // unchanged
        }

        const updated = [...prev];
        updated[existingIndex] = { ...existingItem, quantity: newQty };
        setTimeout(() => toast(`Updated quantity of ${newItem.name} in cart`, 'success'), 0);
        return updated;
      }

      setTimeout(() => toast(`Added ${newItem.name} to cart`, 'success'), 0);
      return [...prev, { ...newItem, id: itemId }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === itemId);
      if (item) {
        setTimeout(() => toast(`Removed ${item.name} from cart`, 'info'), 0);
      }
      return prev.filter((i) => i.id !== itemId);
    });
  };

  const updateCartQty = (itemId: string, qty: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          if (qty > item.countInStock) {
            setTimeout(() => toast(`Cannot exceed stock limit (${item.countInStock})`, 'error'), 0);
            return item;
          }
          return { ...item, quantity: Math.max(1, qty) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        setTimeout(() => toast('Removed from wishlist', 'info'), 0);
        return prev.filter((id) => id !== productId);
      } else {
        setTimeout(() => toast('Added to wishlist', 'success'), 0);
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  // Prevent server-side rendering mismatches on cart counts
  const value = {
    cart: isMounted ? cart : [],
    wishlist: isMounted ? wishlist : [],
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    toggleWishlist,
    isInWishlist,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
