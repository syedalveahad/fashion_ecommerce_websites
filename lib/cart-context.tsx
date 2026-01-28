'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from './types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string, colors: string[]) => void;
  updateQuantity: (productId: string, size: string, colors: string[], quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('rastalife_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rastalife_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.product_id === item.product_id &&
          cartItem.size === item.size &&
          JSON.stringify(cartItem.colors.sort()) === JSON.stringify(item.colors.sort())
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += item.quantity;
        return updatedCart;
      }

      return [...prevCart, item];
    });
    setIsDrawerOpen(true);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const removeFromCart = (productId: string, size: string, colors: string[]) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.product_id === productId &&
            item.size === size &&
            JSON.stringify(item.colors.sort()) === JSON.stringify(colors.sort())
          )
      )
    );
  };

  const updateQuantity = (productId: string, size: string, colors: string[], quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, colors);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product_id === productId &&
        item.size === size &&
        JSON.stringify(item.colors.sort()) === JSON.stringify(colors.sort())
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('rastalife_cart');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
