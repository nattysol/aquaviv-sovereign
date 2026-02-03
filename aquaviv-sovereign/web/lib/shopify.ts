const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!;

export async function getCustomer(accessToken: string) {
  const query = `
    query {
      customer(customerAccessToken: "${accessToken}") {
        firstName
        lastName
        email
        phone
        defaultAddress {
          address1
          city
          zip
          country
        }
        orders(first: 10, reverse: true) {
          edges {
            node {
              orderNumber
              processedAt
              totalPrice {
                amount
                currencyCode
              }
              fulfillmentStatus
              lineItems(first: 5) {
                edges {
                  node {
                    title
                    quantity
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch customer data');
  }

  const json = await response.json();
  return json.data.customer;
}