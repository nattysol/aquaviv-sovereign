'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createCart, 
  addToCartAPI, 
  getCart, 
  removeFromCartAPI, 
  updateCartLineAPI 
} from '@/lib/shopify-cart';

type CartContextType = {
  cart: any | null;
  itemCount: number;
  isOpen: boolean;           // Match CartDrawer expectation
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>; // Match CartDrawer
  checkoutUrl: string;       // Match CartDrawer
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false); // Renamed from isCartOpen to match expectations
  const [isLoading, setIsLoading] = useState(false);

  // 1. Load Cart
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

  // Helper: ID Cleaner
  const formatId = (id: string) => {
    if (!id) return '';
    if (id.includes('gid://shopify/ProductVariant/')) return id;
    return `gid://shopify/ProductVariant/${id}`;
  };

  // 2. Actions
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen(!isOpen);

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
      setIsOpen(true);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsLoading(false);
    }
  }

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

  async function updateQuantity(lineId: string, quantity: number) {
    if (!cart?.id) return;
    setIsLoading(true);
    try {
      const newCart = await updateCartLineAPI(cart.id, lineId, quantity);
      setCart(newCart);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // 3. Derived State
  const itemCount = cart?.totalQuantity || 0;
  const checkoutUrl = cart?.checkoutUrl || '';

  return (
    <CartContext.Provider value={{ 
      cart, 
      itemCount, 
      isOpen, 
      openCart, 
      closeCart, 
      toggleCart, 
      addToCart, 
      removeItem, 
      updateQuantity, 
      checkoutUrl, 
      isLoading 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}