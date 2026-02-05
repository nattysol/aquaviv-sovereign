'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createCart, addToCartAPI, getCart } from '@/lib/shopify-cart';

type CartContextType = {
  cart: any | null;
  itemCount: number;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
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

  // --- HELPER: NUCLEAR ID CLEANER ---
  // This ensures the ID is ALWAYS in the format Shopify wants
  const formatId = (id: string) => {
    if (!id) return '';
    if (id.includes('gid://shopify/ProductVariant/')) return id;
    // If it's just a number, wrap it
    return `gid://shopify/ProductVariant/${id}`;
  };

  async function addToCart(rawVariantId: string, quantity: number) {
    setIsLoading(true);
    
    // 1. CLEAN THE ID IMMEDIATELY
    const variantId = formatId(rawVariantId);
    console.log("Adding Clean ID:", variantId); // Debug log

    try {
      let newCart;
      
      // A. Add to existing cart
      if (cart?.id) {
        try {
          newCart = await addToCartAPI(cart.id, variantId, quantity);
        } catch (e) {
          console.warn("Cart expired or API error, creating new one...", e);
          // Fallback: Create new cart
          localStorage.removeItem('aquaviv_cart_id');
          newCart = await createCart(variantId, quantity);
          localStorage.setItem('aquaviv_cart_id', newCart.id);
        }
      } 
      // B. Create brand new cart
      else {
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

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const itemCount = cart?.totalQuantity || 0;

  return (
    <CartContext.Provider value={{ cart, itemCount, addToCart, isCartOpen, toggleCart, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}