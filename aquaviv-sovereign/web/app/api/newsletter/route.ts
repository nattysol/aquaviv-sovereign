import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const LIST_ID = process.env.KLAVIYO_LIST_ID;
    const API_KEY = process.env.KLAVIYO_PRIVATE_KEY;

    if (!LIST_ID || !API_KEY) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // KLAVIYO V3 API: Subscribe Profile
    const url = 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs';
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        revision: '2023-02-22',
        'content-type': 'application/json',
        Authorization: `Klaviyo-API-Key ${API_KEY}`
      },
      body: JSON.stringify({
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            list_id: LIST_ID,
            subscriptions: [{
              email: email,
              channels: {
                email: ['MARKETING']
              }
            }]
          }
        }
      })
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Klaviyo Error:', errorData);
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Newsletter API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}