import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, message, subject } = body;

    const API_KEY = process.env.KLAVIYO_PRIVATE_KEY;
    const CONTACT_LIST_ID = process.env.KLAVIYO_CONTACT_LIST_ID; // <--- The New List

    if (!API_KEY || !CONTACT_LIST_ID) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // 1. DEFINE THE EVENT (For Auto-Responder Flow)
    const eventPayload = {
      data: {
        type: 'event',
        attributes: {
          properties: {
            ...body,
            source: 'Website Contact Form'
          },
          metric: {
            data: {
              type: 'metric',
              attributes: {
                name: 'Submitted Contact Form'
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
    };

    // 2. DEFINE THE SUBSCRIPTION (For "Contact Inquiries" List)
    const subscriptionPayload = {
      data: {
        type: 'profile-subscription-bulk-create-job',
        attributes: {
          list_id: CONTACT_LIST_ID,
          subscriptions: [{
            email: email,
            properties: {
              first_name: name?.split(' ')[0],
              source: 'Contact Form'
            },
            channels: {
              email: ['MARKETING'] // Marks them as consented for this specific list
            }
          }]
        }
      }
    };

    // 3. SEND BOTH REQUESTS TO KLAVIYO (In Parallel)
    const [eventRes, subRes] = await Promise.all([
      // A. Create Event
      fetch('https://a.klaviyo.com/api/events', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          revision: '2023-02-22',
          'content-type': 'application/json',
          Authorization: `Klaviyo-API-Key ${API_KEY}`
        },
        body: JSON.stringify(eventPayload)
      }),
      
      // B. Add to Contact List
      fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          revision: '2023-02-22',
          'content-type': 'application/json',
          Authorization: `Klaviyo-API-Key ${API_KEY}`
        },
        body: JSON.stringify(subscriptionPayload)
      })
    ]);

    // Check for errors
    if (!eventRes.ok) {
       console.error('Klaviyo Event Error:', await eventRes.text());
    }
    if (!subRes.ok) {
       console.error('Klaviyo List Error:', await subRes.text());
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}