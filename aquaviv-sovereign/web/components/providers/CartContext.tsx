'use client';

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { 
  createCart, 
  addToCartAPI, 
  getCart, 
  removeFromCartAPI, 
  updateCartLineAPI 
} from '@/lib/shopify-cart';
import { useReferral } from './ReferralContext';

type CartContextType = {
  cart: any | null;
  itemCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (variantId: string | number, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  checkoutUrl: string;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { referralCode } = useReferral(); 

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

  const formatId = useCallback((id: string | number) => {
    if (!id) return '';
    const idStr = String(id);
    if (idStr.includes('gid://shopify/ProductVariant/')) return idStr;
    return `gid://shopify/ProductVariant/${idStr}`;
  }, []);

  // 1. Wrap functions in useCallback so they don't recreate on every render
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  const addToCart = useCallback(async (rawVariantId: string | number, quantity: number) => {
    console.log("Adding to cart:", rawVariantId, quantity);
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
      
      // Track Klaviyo Event (optional)
      // try { console.log("Tracked 'Added to Cart'"); } catch (err) {}

    } catch (error) {
      console.error("CRITICAL: Failed to add to cart:", error);
      alert("Could not add to cart. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, [cart?.id, formatId]);

  const removeItem = useCallback(async (lineId: string) => {
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
  }, [cart?.id]);

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
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
  }, [cart?.id]);

  const itemCount = cart?.totalQuantity || 0;

  // Calculate URL (this is fast, so we can keep it here, or memoize it too)
  const finalCheckoutUrl = useMemo(() => {
    const baseCheckoutUrl = cart?.checkoutUrl || '';
    if (baseCheckoutUrl && referralCode) {
      const separator = baseCheckoutUrl.includes('?') ? '&' : '?';
      return `${baseCheckoutUrl}${separator}discount=${referralCode}`;
    }
    return baseCheckoutUrl;
  }, [cart?.checkoutUrl, referralCode]);

  // 2. THE BIG FIX: Wrap the entire value object in useMemo
  const contextValue = useMemo(() => ({
    cart, 
    itemCount, 
    isOpen, 
    openCart, 
    closeCart, 
    toggleCart, 
    addToCart, 
    removeItem, 
    updateQuantity, 
    checkoutUrl: finalCheckoutUrl, 
    isLoading 
  }), [
    cart, 
    itemCount, 
    isOpen, 
    openCart, 
    closeCart, 
    toggleCart, 
    addToCart, 
    removeItem, 
    updateQuantity, 
    finalCheckoutUrl, 
    isLoading
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}