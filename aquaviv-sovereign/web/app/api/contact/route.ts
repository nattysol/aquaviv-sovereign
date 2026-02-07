import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, message, subject } = body;

    const API_KEY = process.env.KLAVIYO_PRIVATE_KEY;

    // KLAVIYO V3 API: Create Event
    const url = 'https://a.klaviyo.com/api/events';
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
          type: 'event',
          attributes: {
            properties: {
              ...body, // Sends name, message, subject as event details
              source: 'Website Contact Form'
            },
            metric: {
              data: {
                type: 'metric',
                attributes: {
                  name: 'Submitted Contact Form' // <--- This triggers the Flow
                }
              }
            },
            profile: {
              data: {
                type: 'profile',
                attributes: {
                  email: email,
                  first_name: name?.split(' ')[0],
                  properties: {
                     contact_message: message
                  }
                }
              }
            }
          }
        }
      })
    };

    await fetch(url, options);

    // OPTIONAL: Send to Sanity "Chat Logs" or Email Service (Resend/SendGrid) here if needed.

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}