'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createCart, addToCartAPI, getCart, removeFromCartAPI } from '@/lib/shopify-cart'; // <--- Added import

type CartContextType = {
  cart: any | null;
  itemCount: number;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>; // <--- Added Type
  isCartOpen: boolean;
  toggleCart: () => void;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeCart = async () => {
      const storedCartId = localStorage.getItem('aquaviv_cart_id');
      if (storedCartId) {
        const existingCart = await getCart(storedCartId);
        if (existingCart) {
          setCart(existingCart);
        } else {
          localStorage.removeItem('aquaviv_cart_id');
        }
      }
    };
    initializeCart();
  }, []);

  // Helper: Ensure IDs are formatted correctly
  const formatId = (id: string) => {
    if (!id) return '';
    if (id.includes('gid://shopify/ProductVariant/')) return id;
    return `gid://shopify/ProductVariant/${id}`;
  };

  async function addToCart(rawVariantId: string, quantity: number) {
    setIsLoading(true);
    const variantId = formatId(rawVariantId);

    try {
      let newCart;
      if (cart?.id) {
        try {
          newCart = await addToCartAPI(cart.id, variantId, quantity);
        } catch (e) {
          console.warn("Cart expired, creating new one...", e);
          localStorage.removeItem('aquaviv_cart_id');
          newCart = await createCart(variantId, quantity);
          localStorage.setItem('aquaviv_cart_id', newCart.id);
        }
      } else {
        newCart = await createCart(variantId, quantity);
        localStorage.setItem('aquaviv_cart_id', newCart.id);
      }
      setCart(newCart);
      setIsCartOpen(true);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // --- NEW: Remove Item Logic ---
  async function removeItem(lineId: string) {
    if (!cart?.id) return;
    setIsLoading(true);
    try {
      const newCart = await removeFromCartAPI(cart.id, lineId);
      setCart(newCart);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const toggleCart = () => setIsCartOpen(!isCartOpen);
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