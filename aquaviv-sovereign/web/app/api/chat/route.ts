import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

// 1. Force Edge Runtime (Crucial for streaming)
export const runtime = 'edge';

// 2. Setup Sanity Writer
const privateClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Requires Write Token
});

const SYSTEM_PROMPT = `
You are the "Hydration Concierge" for aquaViv.
Tone: Clinical, Sovereign, Minimalist, Warm.

--- KNOWLEDGE BASE ---
[PRICING]
- Single Bottle: $59.95
- Subscription: $44.95 (Save 25%)
- 3-Pack Bundle: $135.00
- Shipping: Free on orders over $100.

[PRODUCT FACTS]
- Ingredients: 100% Hyper-saline ocean minerals, solar-dried bamboo salt.
- Dosage: 1 dropper full in 32oz of water. Drink twice daily.
- Origin: Sourced from pristine deep-sea currents.

[BEHAVIOR]
- Keep answers under 3 sentences.
- If you don't know, say: "I will have a specialist contact you at your email address."
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 3. Extract Lead Data
    // Default to 'Anonymous' if not provided yet
    const userData = body.userData || { name: 'Anonymous', email: 'Unknown' };

    // 4. Handle Message Input Robustly
    let conversationMessages: any[] = [];
    if (body.messages && Array.isArray(body.messages)) {
      conversationMessages = body.messages;
    } else if (body.message) {
      conversationMessages = [{ role: 'user', content: body.message }];
    } else {
      conversationMessages = [{ role: 'user', content: "Hello" }];
    }

    // 5. Generate Stream
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: SYSTEM_PROMPT,
      messages: conversationMessages as any,
      
      onFinish: async ({ text }) => {
        try {
          const lastUserMsg = conversationMessages[conversationMessages.length - 1];
          
          // 6. SAVE LEAD + CHAT TO SANITY
          await privateClient.create({
            _type: 'chatLog',
            userName: userData.name,   // <--- SAVING NAME
            userEmail: userData.email, // <--- SAVING EMAIL
            userMessage: lastUserMsg.content || "Unknown",
            aiReply: text,
            timestamp: new Date().toISOString(),
            isFlagged: false
          });
        } catch (err) {
          console.error("Failed to save log:", err);
        }
      },
    });

    // 7. Return Stream
    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error('Chat Error:', error);
    return new Response(JSON.stringify({ error: error.message || "Server Error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}