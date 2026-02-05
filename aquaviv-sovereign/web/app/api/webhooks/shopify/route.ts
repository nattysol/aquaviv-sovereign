import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

// 1. Create a PRIVATE Sanity Client (Can Write Data)
const privateClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // We need fresh data
  token: process.env.SANITY_API_TOKEN, // <--- The Write Token
});

export async function POST(req: Request) {
  try {
    // 2. Get the Raw Body (Required for Security Check)
    const textBody = await req.text();
    const hmacHeader = req.headers.get('x-shopify-hmac-sha256');

    // 3. Verify it's actually from Shopify (HMAC Check)
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET || '';
    const hash = crypto
      .createHmac('sha256', secret)
      .update(textBody, 'utf8')
      .digest('base64');

    if (hash !== hmacHeader) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Signature' }, { status: 401 });
    }

    // 4. Parse the Order
    const order = JSON.parse(textBody);
    const discountCodes = order.discount_codes || [];

    // If no discount codes used, ignore.
    if (discountCodes.length === 0) {
      return NextResponse.json({ message: 'No discounts used' });
    }

    console.log(`Processing Order #${order.order_number} - Discounts:`, discountCodes);

    // 5. Loop through codes and find Affiliates
    for (const discount of discountCodes) {
      const code = discount.code; // e.g., "TEST20"

      // A. Find the Affiliate in Sanity
      const query = `*[_type == "affiliate" && code == $code][0]`;
      const affiliate = await privateClient.fetch(query, { code });

      if (affiliate) {
        // B. Calculate Commission
        // Note: Shopify sends prices as strings. Convert to float.
        const orderSubtotal = parseFloat(order.subtotal_price);
        const commissionRate = affiliate.commissionRate || 20; // Default 20%
        const earnings = orderSubtotal * (commissionRate / 100);

        console.log(`Paying Affiliate ${affiliate.name}: $${earnings.toFixed(2)}`);

        // C. Update Sanity (Add money to their pile)
        await privateClient
          .patch(affiliate._id)
          .inc({ totalEarnings: earnings }) // Atomic increment (safe!)
          .commit();
      }
    }

    return NextResponse.json({ message: 'Commission processed' });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}