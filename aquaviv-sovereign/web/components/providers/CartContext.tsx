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

  // Load cart from LocalStorage on mount
  useEffect(() => {
    const initializeCart = async () => {
      const storedCartId = localStorage.getItem('aquaviv_cart_id');
      if (storedCartId) {
        const existingCart = await getCart(storedCartId);
        if (existingCart) {
          setCart(existingCart);
        } else {
          // If stored ID is invalid (expired), clear it
          localStorage.removeItem('aquaviv_cart_id');
        }
      }
    };
    initializeCart();
  }, []);

  async function addToCart(variantId: string, quantity: number) {
    setIsLoading(true);
    try {
      let newCart;
      
      // A. If no cart exists, create one
      if (!cart?.id) {
        newCart = await createCart(variantId, quantity);
        localStorage.setItem('aquaviv_cart_id', newCart.id);
      } 
      // B. If cart exists, add to it
      else {
        newCart = await addToCartAPI(cart.id, variantId, quantity);
      }

      setCart(newCart);
      setIsCartOpen(true); // Open drawer/feedback
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