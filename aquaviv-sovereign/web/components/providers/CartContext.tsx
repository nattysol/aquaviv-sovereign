'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createCart, addToCartAPI, getCart, removeFromCartAPI } from '@/lib/shopify-cart';

type CartContextType = {
  cart: any | null;
  itemCount: number;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>; // <--- New capability
  isCartOpen: boolean;
  toggleCart: () => void;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Load cart from LocalStorage on mount
  useEffect(() => {
    const initializeCart = async () => {
      const storedCartId = localStorage.getItem('aquaviv_cart_id');
      if (storedCartId) {
        // Fetch fresh data from Shopify to ensure price/stock is accurate
        const existingCart = await getCart(storedCartId);
        if (existingCart) {
          setCart(existingCart);
        } else {
          // If Shopify returns null (expired), clear local storage
          localStorage.removeItem('aquaviv_cart_id');
        }
      }
    };
    initializeCart();
  }, []);

  // 2. Add Item
  async function addToCart(variantId: string, quantity: number) {
    setIsLoading(true);
    try {
      let newCart;
      
      // A. Create new cart if none exists
      if (!cart?.id) {
        newCart = await createCart(variantId, quantity);
        localStorage.setItem('aquaviv_cart_id', newCart.id);
      } 
      // B. Update existing cart
      else {
        newCart = await addToCartAPI(cart.id, variantId, quantity);
      }

      setCart(newCart);
      setIsCartOpen(true); 
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // 3. Remove Item
  async function removeItem(lineId: string) {
    if (!cart?.id) return;
    
    setIsLoading(true);
    try {
      // Shopify requires the Cart ID and the Line Item ID to remove it
      const newCart = await removeFromCartAPI(cart.id, [lineId]);
      setCart(newCart);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  
  // Calculate total items safely
  const itemCount = cart?.totalQuantity || 0;

  return (
    <CartContext.Provider value={{ cart, itemCount, addToCart, removeItem, isCartOpen, toggleCart, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}