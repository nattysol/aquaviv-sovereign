'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- CONFIG ---
// 1. Verify these one last time
const SHOPIFY_STORE_DOMAIN = 'aquaviv.myshopify.com';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = 'a9c03eaeb3b88079ca5af9952f85ac0c'; // <--- PASTE YOUR TOKEN BACK IN HERE

// --- TYPES ---
interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        cost: { totalAmount: { amount: string } };
        merchandise: {
          id: string;
          title: string;
          product: { title: string; handle: string };
          image?: { url: string };
        };
      };
    }>;
  };
}

interface CartContextType {
  cart: Cart | null;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  isLoading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  checkoutUrl: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// --- HELPER: SHOPIFY FETCH ---
async function shopifyFetch({ query, variables = {} }: { query: string; variables?: any }) {
  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();
  if (json.errors) {
    // Print the full error so we can see it
    console.error('Shopify API Error:', JSON.stringify(json.errors, null, 2));
    throw new Error(json.errors[0].message || 'Shopify Error');
  }
  return json.data;
}

// --- QUERIES ---
const CART_FRAGMENT = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        cost { totalAmount { amount } }
        merchandise {
          ... on ProductVariant {
            id
            title
            image { url }
            product { title handle }
          }
        }
      }
    }
  }
`;

const CREATE_CART_MUTATION = `mutation cartCreate { cartCreate { cart { ${CART_FRAGMENT} } } }`;
const ADD_LINES_MUTATION = `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FRAGMENT} } } }`;
const UPDATE_LINES_MUTATION = `mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FRAGMENT} } } }`;
const REMOVE_LINES_MUTATION = `mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FRAGMENT} } } }`;
const GET_CART_QUERY = `query getCart($cartId: ID!) { cart(id: $cartId) { ${CART_FRAGMENT} } }`;

// --- PROVIDER ---
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // 1. Load Cart (Safe Mode)
  useEffect(() => {
    const loadCart = async () => {
      const localCartId = localStorage.getItem('shopify_cart_id');
      if (localCartId) {
        try {
          const data = await shopifyFetch({ query: GET_CART_QUERY, variables: { cartId: localCartId } });
          if (data.cart) {
            setCart(data.cart);
          } else {
            console.warn("Cart expired. Clearing local storage.");
            localStorage.removeItem('shopify_cart_id');
            setCart(null);
          }
        } catch (e) {
          console.error("Failed to load cart. Resetting.", e);
          localStorage.removeItem('shopify_cart_id');
          setCart(null);
        }
      }
    };
    loadCart();
  }, []);

  // 2. CREATE HELPER
  const createNewCart = async (variantId: string, quantity: number) => {
    try {
      console.log("Creating NEW cart...");
      // For create, we can pass lines immediately
      const query = `
        mutation cartCreate($lines: [CartLineInput!]) {
          cartCreate(input: { lines: $lines }) {
            cart { ${CART_FRAGMENT} }
          }
        }
      `;
      const data = await shopifyFetch({ 
        query, 
        variables: { lines: [{ merchandiseId: variantId, quantity }] } 
      });
      const newCart = data.cartCreate.cart;
      localStorage.setItem('shopify_cart_id', newCart.id);
      setCart(newCart);
      return newCart;
    } catch (e) {
      console.error("Fatal Error creating cart:", e);
      throw e;
    }
  };

 // 3. ADD TO CART (With Debugging)
  const addToCart = async (variantId: string, quantity = 1) => {
    setIsLoading(true);
    try {
      let currentCartId = cart?.id || localStorage.getItem('shopify_cart_id');

      if (!currentCartId) {
        await createNewCart(variantId, quantity);
      } else {
        console.log(`Adding to existing cart: ${currentCartId}`);
        
        const data = await shopifyFetch({
          query: ADD_LINES_MUTATION,
          variables: {
            cartId: currentCartId,
            lines: [{ merchandiseId: variantId, quantity }],
          },
        });

        // --- NEW DEBUG LOGIC ---
        const result = data.cartLinesAdd;
        
        // Check for Specific Logic Errors (Stock, Selling Plan, etc)
        if (result?.userErrors?.length > 0) {
           console.error("SHOPIFY REFUSED:", result.userErrors);
           alert(`Cannot add item: ${result.userErrors[0].message}`);
           return; 
        }

        if (!result?.cart) {
           throw new Error("Cart was lost in transaction.");
        }
        
        console.log("SHOPIFY ACCEPTED:", result.cart);
        setCart(result.cart);
      }
      setIsOpen(true);
    } catch (error) {
      console.warn("Error adding. Resetting cart...", error);
      localStorage.removeItem('shopify_cart_id');
      await createNewCart(variantId, quantity);
    } finally {
      setIsLoading(false);
    }
  };
  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cart?.id) return;
    setIsLoading(true);
    try {
      const data = await shopifyFetch({
        query: UPDATE_LINES_MUTATION,
        variables: { cartId: cart.id, lines: [{ id: lineId, quantity }] },
      });
      setCart(data.cartLinesUpdate.cart);
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  const removeItem = async (lineId: string) => {
    if (!cart?.id) return;
    setIsLoading(true);
    try {
      const data = await shopifyFetch({
        query: REMOVE_LINES_MUTATION,
        variables: { cartId: cart.id, lineIds: [lineId] },
      });
      setCart(data.cartLinesRemove.cart);
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  return (
    <CartContext.Provider value={{
      cart, addToCart, updateQuantity, removeItem, isLoading,
      isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
      checkoutUrl: cart?.checkoutUrl || '',
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within a CartProvider');
  return context;
}