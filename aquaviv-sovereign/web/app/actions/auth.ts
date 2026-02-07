'use server';

import { cookies } from 'next/headers';

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || 'aquaviv.myshopify.com'; 
const SHOPIFY_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

const CUSTOMER_ACCESS_TOKEN_CREATE = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: "Please provide both email and password." };
  }

  try {
    // Clean the domain just in case (remove https:// if present)
    const cleanDomain = SHOPIFY_DOMAIN.replace('https://', '').replace('http://', '');
    const url = `https://${cleanDomain}/api/2024-01/graphql.json`;
    
    console.log("Fetching URL:", url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN!,
      },
      body: JSON.stringify({
        query: CUSTOMER_ACCESS_TOKEN_CREATE,
        variables: {
          input: { email, password }
        }
      })
    });

    if (!response.ok) {
        const text = await response.text();
        console.error("SHOPIFY API ERROR (Network):", response.status, text);
        return { error: `Shopify Connection Failed: ${response.status}` };
    }

    const json = await response.json();
    console.log("SHOPIFY RESPONSE:", JSON.stringify(json, null, 2));
    
    // Check for GraphQL top-level errors (Token issues usually appear here)
    if (json.errors) {
      const msg = json.errors[0]?.message || "Unknown GraphQL Error";
      console.error("GraphQL Error:", msg);
      return { error: `API Error: ${msg}` };
    }

    // Check for Logic errors (Wrong password, etc)
    const { customerAccessToken, customerUserErrors } = json.data.customerAccessTokenCreate;
    
    if (customerUserErrors.length > 0) {
      const msg = customerUserErrors[0]?.message || "Unknown User Error";
      console.error("User Error:", msg);
      return { error: msg };
    }

    if (customerAccessToken) {
      const cookieStore = await cookies();
      
      cookieStore.set('session', customerAccessToken.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
      return { success: true };
    }

    return { error: "Unknown error: No token received." };

  } catch (err) {
    console.error("CRITICAL AUTH CRASH:", err);
    return { error: "System Error. Check server logs." };
  }
}