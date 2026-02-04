'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client'; // We might use this later, but mainly we use Shopify fetch here

// Define the shape of our Context
type CartContextType = {
  cart: any | null;
  itemCount: number;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  isCartOpen: boolean;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 1. Load Cart on Mount
  useEffect(() => {
    const existingCartId = localStorage.getItem('aquaviv_cart_id');
    if (existingCartId) {
      fetchCart(existingCartId);
    }
  }, []);

  // 2. Helper: Fetch Cart Data from Shopify
  async function fetchCart(cartId: string) {
    // NOTE: In a real app, you would move this fetch to a Server Action to hide the token
    // For this demo, we'll keep it simple or assume you have a /api/cart route.
    // Let's stub the count for now to prove the UI works, 
    // or if you have the shopify-buy SDK, you'd use it here.
    
    // Simulating a fetched cart for UI wiring:
    // setCart({ lines: { edges: [] } }); 
  }

  // 3. Action: Add to Cart
  async function addToCart(variantId: string, quantity: number) {
     // Logic to create cart or add line item
     // For now, we will simulate a local state update so you see the number change immediately.
     console.log("Adding to cart:", variantId);
     
     // MOCKING THE UPDATE (Replace with real Shopify mutation later)
     setCart((prev: any) => {
        const currentCount = prev?.totalQuantity || 0;
        return { ...prev, totalQuantity: currentCount + quantity };
     });
     
     setIsCartOpen(true);
  }

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  // Calculate Count
  const itemCount = cart?.totalQuantity || 0;

  return (
    <CartContext.Provider value={{ cart, itemCount, addToCart, isCartOpen, toggleCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook to use it easily
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}