'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  updateQuantity: (lineId: string, quantity: number) => Promise<void>; // <--- New
  removeItem: (lineId: string) => Promise<void>;                       // <--- New
  isLoading: boolean;
  isOpen: boolean;       // <--- New
  openCart: () => void;  // <--- New
  closeCart: () => void; // <--- New
  checkoutUrl: string;   // <--- New
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// --- HELPER: SHOPIFY FETCH ---
// (We keep this inline so this file is self-contained)
const SHOPIFY_STORE_DOMAIN = 'aquaviv.myshopify.com';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = '114b740702b85df1a1369f4c3a2512f4'; // Public token

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
    console.error('Shopify Errors:', json.errors);
    throw new Error('Failed to fetch from Shopify');
  }
  return json.data;
}

// --- QUERIES & MUTATIONS ---
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

// --- PROVIDER COMPONENT ---
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // <--- UI State

  // 1. Load Cart on Mount
  useEffect(() => {
    const loadCart = async () => {
      const localCartId = localStorage.getItem('shopify_cart_id');
      if (localCartId) {
        try {
          const data = await shopifyFetch({ query: GET_CART_QUERY, variables: { cartId: localCartId } });
          if (data.cart) {
            setCart(data.cart);
          } else {
            // Cart expired or invalid
            localStorage.removeItem('shopify_cart_id');
          }
        } catch (e) {
          console.error("Error loading cart:", e);
        }
      }
    };
    loadCart();
  }, []);

  // 2. Add to Cart
  const addToCart = async (variantId: string, quantity = 1) => {
    setIsLoading(true);
    try {
      let currentCartId = cart?.id;
      let newCart;

      if (!currentCartId) {
        // Create new cart
        const data = await shopifyFetch({ query: CREATE_CART_MUTATION });
        newCart = data.cartCreate.cart;
        localStorage.setItem('shopify_cart_id', newCart.id);
        currentCartId = newCart.id;
      }

      // Add item
      const data = await shopifyFetch({
        query: ADD_LINES_MUTATION,
        variables: {
          cartId: currentCartId,
          lines: [{ merchandiseId: variantId, quantity }],
        },
      });

      setCart(data.cartLinesAdd.cart);
      setIsOpen(true); // Auto-open cart on add
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Update Quantity
  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cart?.id) return;
    setIsLoading(true);
    try {
      const data = await shopifyFetch({
        query: UPDATE_LINES_MUTATION,
        variables: {
          cartId: cart.id,
          lines: [{ id: lineId, quantity }],
        },
      });
      setCart(data.cartLinesUpdate.cart);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Remove Item
  const removeItem = async (lineId: string) => {
    if (!cart?.id) return;
    setIsLoading(true);
    try {
      const data = await shopifyFetch({
        query: REMOVE_LINES_MUTATION,
        variables: {
          cartId: cart.id,
          lineIds: [lineId],
        },
      });
      setCart(data.cartLinesRemove.cart);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Open/Close Helpers
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeItem,
      isLoading,
      isOpen,
      openCart,
      closeCart,
      checkoutUrl: cart?.checkoutUrl || '',
    }}>
      {children}
    </CartContext.Provider>
  );
}

// --- HOOK ---
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}