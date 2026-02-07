import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

// 1. Force Edge Runtime
export const runtime = 'edge';

// 2. Setup Sanity
const privateClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const SYSTEM_PROMPT = `
You are the "Hydration Concierge" for aquaViv. 
Tone: Clinical, Sovereign, Minimalist.
Keep answers under 2 sentences.
If asked about shipping: "Orders usually arrive within 3 solar cycles."
If asked about price: "The Mineral Drops are $44.95 for a 30-day supply."
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 3. Manually Handle Messages (Bypassing the missing helper function)
    // We cast to 'any' to stop TypeScript from complaining about strict types
    let messages: any[] = [];
    
    if (body.messages && Array.isArray(body.messages)) {
      messages = body.messages;
    } else if (body.message) {
      messages = [{ role: 'user', content: body.message }];
    } else {
      messages = [{ role: 'user', content: body.prompt || 'Hello' }];
    }

    // 4. Generate Stream
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: SYSTEM_PROMPT,
      messages: messages as any, // <--- FORCE TYPE COMPATIBILITY
      
      onFinish: async ({ text }) => {
        try {
          const lastMsg = messages[messages.length - 1];
          await privateClient.create({
            _type: 'chatLog',
            userMessage: lastMsg.content || "Unknown",
            aiReply: text,
            timestamp: new Date().toISOString(),
            isFlagged: false
          });
        } catch (err) {
          console.error("Failed to save log:", err);
        }
      },
    });

    // 5. Use the specific response method your error log requested
    return result.toTextStreamResponse(); 

  } catch (error: any) {
    console.error('Chat Error:', error);
    return new Response(JSON.stringify({ error: error.message || "Server Error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}