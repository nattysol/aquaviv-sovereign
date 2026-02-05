const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!;

// --- HELPER: Fixes broken IDs automatically ---
function formatVariantId(id: string): string {
  if (!id) return '';
  // If it's already a proper GID, return it
  if (id.startsWith('gid://shopify/ProductVariant/')) {
    return id;
  }
  // If it's just a number (e.g., "42958057930818"), fix it
  return `gid://shopify/ProductVariant/${id}`;
}

async function shopifyFetch({ query, variables }: { query: string; variables?: any }) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();
  
  // Log API errors to console for easier debugging
  if (json.errors) {
    console.error("Shopify API Error:", JSON.stringify(json.errors, null, 2));
  }
  
  return json;
}

const CART_FRAGMENT = `
  fragment cartDetails on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 10) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              image {
                url
                altText
              }
              product {
                title
                handle
              }
            }
          }
        }
      }
    }
  }
`;

// 1. Create a fresh Cart
export async function createCart(variantId: string, quantity: number) {
  const cleanId = formatVariantId(variantId); // <--- Auto-Fix applied here
  
  const query = `
    mutation cartCreate($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart {
          ...cartDetails
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  const response = await shopifyFetch({
    query,
    variables: { lines: [{ merchandiseId: cleanId, quantity }] },
  });

  if (!response.data?.cartCreate?.cart) {
    throw new Error("Fatal Error creating cart: " + JSON.stringify(response.errors));
  }

  return response.data.cartCreate.cart;
}

// 2. Add Item to Existing Cart
export async function addToCartAPI(cartId: string, variantId: string, quantity: number) {
  const cleanId = formatVariantId(variantId); // <--- Auto-Fix applied here

  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...cartDetails
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  const response = await shopifyFetch({
    query,
    variables: { cartId, lines: [{ merchandiseId: cleanId, quantity }] },
  });

  if (!response.data?.cartLinesAdd?.cart) {
    throw new Error("Error adding item. Resetting cart...");
  }

  return response.data.cartLinesAdd.cart;
}

// 3. Retrieve Cart
export async function getCart(cartId: string) {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        ...cartDetails
      }
    }
    ${CART_FRAGMENT}
  `;

  const response = await shopifyFetch({ query, variables: { cartId } });
  return response.data?.cart;
}