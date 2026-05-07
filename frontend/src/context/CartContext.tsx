"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartItem {
  _id: string;
  name_en: string;
  name_ta: string;
  price: number;
  quantity: number;
  image?: string;
  images?: string[];
  category: string;
  productId?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalAmount: number;
  deliveryCharge: number;
  totalWithDelivery: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("rs_fancy_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to local storage on changes
  useEffect(() => {
    localStorage.setItem("rs_fancy_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      const cartProduct: CartItem = {
        _id: product._id,
        name_en: product.name_en,
        name_ta: product.name_ta,
        price: product.price,
        images: product.images,
        category: product.category,
        productId: product.productId, // Preserve the custom SKU
        quantity: 1
      };
      
      if (cartProduct.images && cartProduct.images.length > 0) {
        cartProduct.image = cartProduct.images[0];
      }
      
      return [...prev, cartProduct];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCartItems([]);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  // Delivery Charge Logic: 50 if < 500, else 0
  const deliveryCharge = (totalAmount > 0 && totalAmount < 500) ? 50 : 0;
  const totalWithDelivery = totalAmount + deliveryCharge;

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      totalAmount, 
      deliveryCharge,
      totalWithDelivery,
      itemCount 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
