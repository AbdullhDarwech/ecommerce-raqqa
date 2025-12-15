'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '@/lib/types';

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  cartTotal: number;
  cartCount: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, quantity?: number, orderType?: 'purchase' | 'rental') => void;
  removeFromCart: (productId: string, orderType: 'purchase' | 'rental') => void;
  updateQuantity: (productId: string, orderType: 'purchase' | 'rental', quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('Furato_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
        localStorage.removeItem('Furato_cart');
      }
    }
    setMounted(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('Furato_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, mounted]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (product: Product, quantity = 1, orderType: 'purchase' | 'rental' = 'purchase') => {
    setCartItems((prev) => {
      // Find if item exists
      const existingItemIndex = prev.findIndex(
        (item) => item.product._id === product._id && item.orderType === orderType
      );

      // Create a deep copy of the array to ensure React re-renders
      const newCart = [...prev];

      if (existingItemIndex > -1) {
        // Item exists: Update quantity specifically for that item
        const existingItem = newCart[existingItemIndex];
        newCart[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + quantity
        };
      } else {
        // New item: Add to array
        newCart.push({ product, quantity, orderType });
      }

      return newCart;
    });
    
    // Automatically open cart to show feedback
    openCart();
  };

  const removeFromCart = (productId: string, orderType: 'purchase' | 'rental') => {
    setCartItems((prev) => prev.filter(
      (item) => !(item.product._id === productId && item.orderType === orderType)
    ));
  };

  const updateQuantity = (productId: string, orderType: 'purchase' | 'rental', quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) => prev.map((item) => {
      if (item.product._id === productId && item.orderType === orderType) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('Furato_cart');
    }
  };

  // Calculate Total
  const cartTotal = cartItems.reduce((total, item) => {
    let price = 0;
    if (item.orderType === 'rental') {
      price = item.product.priceRental || item.product.pricePurchase || 0;
    } else {
      price = item.product.pricePurchase || 0;
    }
    return total + (price * item.quantity);
  }, 0);

  // Calculate Item Count
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      isCartOpen, 
      openCart, 
      closeCart, 
      toggleCart, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}