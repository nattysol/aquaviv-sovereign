'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createCart, 
  addToCartAPI, 
  getCart, 
  removeFromCartAPI, 
  updateCartLineAPI 
} from '@/lib/shopify-cart';
import { useReferral } from './ReferralContext';
// import { trackKlaviyoEvent } from '@/lib/klaviyo'; // Uncomment if you have this file

type CartContextType = {
  cart: any | null;
  itemCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (variantId: string | number, quantity: number) => Promise<void>; // Updated type
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
  
  // Safe Access to Referral Code
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

  // --- FIX 1: SAFETY CAST TO STRING ---
  const formatId = (id: string | number) => {
    if (!id) return '';
    const idStr = String(id); // Force it to be a string
    if (idStr.includes('gid://shopify/ProductVariant/')) return idStr;
    return `gid://shopify/ProductVariant/${idStr}`;
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen(!isOpen);

  async function addToCart(rawVariantId: string | number, quantity: number) {
    
    setIsLoading(true);
    const variantId = formatId(rawVariantId);

    try {
      let newCart;
      
      // A. If Cart Exists, Add to it
      if (cart?.id) {
        try {
          newCart = await addToCartAPI(cart.id, variantId, quantity);
        } catch (e) {
          console.warn("Cart expired or failed, creating new one...", e);
          localStorage.removeItem('aquaviv_cart_id');
          newCart = await createCart(variantId, quantity);
          localStorage.setItem('aquaviv_cart_id', newCart.id);
        }
      } 
      // B. If No Cart, Create New One
      else {
        newCart = await createCart(variantId, quantity);
        localStorage.setItem('aquaviv_cart_id', newCart.id);
      }

      setCart(newCart);
      setIsOpen(true);
      
      // --- KLAVIYO TRACKING (Wrapped in try/catch so it never breaks the cart) ---
      try {
         // trackKlaviyoEvent('Added to Cart', { ItemId: variantId, Quantity: quantity });
         console.log("Tracked 'Added to Cart'");
      } catch (err) {
         console.error("Tracking Error (Non-Fatal):", err);
      }

    } catch (error) {
      console.error("CRITICAL: Failed to add to cart:", error);
      alert("Could not add to cart. Please check your connection.");
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

  const itemCount = cart?.totalQuantity || 0;

  // Logic: Append Discount Code to Checkout URL
  const baseCheckoutUrl = cart?.checkoutUrl || '';
  let finalCheckoutUrl = baseCheckoutUrl;
  
  if (baseCheckoutUrl && referralCode) {
    const separator = baseCheckoutUrl.includes('?') ? '&' : '?';
    finalCheckoutUrl = `${baseCheckoutUrl}${separator}discount=${referralCode}`;
  }

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
      checkoutUrl: finalCheckoutUrl, 
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