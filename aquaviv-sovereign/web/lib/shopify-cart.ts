const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!;

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

  return response.json();
}

// Reusable Fragment: Ensures we always get the data our Cart Page expects
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
    variables: { lines: [{ merchandiseId: variantId, quantity }] },
  });

  return response.data.cartCreate.cart;
}

// 2. Add Item to Existing Cart
export async function addToCartAPI(cartId: string, variantId: string, quantity: number) {
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
    variables: { cartId, lines: [{ merchandiseId: variantId, quantity }] },
  });

  return response.data.cartLinesAdd.cart;
}

// 3. Retrieve Cart (Refresh on page load)
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
  return response.data.cart;
}