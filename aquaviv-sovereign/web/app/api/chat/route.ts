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
    // 3. READ & LOG INPUT (For Debugging)
    const body = await req.json();
    console.log("Chat Input Body:", JSON.stringify(body)); // <--- Check your Vercel Logs for this

    // 4. PREPARE MESSAGES (The Safety Net)
    let messages: any[] = [];

    if (body.messages && Array.isArray(body.messages) && body.messages.length > 0) {
      messages = body.messages;
    } 
    else if (body.message) {
      messages = [{ role: 'user', content: body.message }];
    } 
    else {
      // CRITICAL FIX: If input is empty, inject a dummy message to prevent the crash
      console.warn("No messages found. Injecting fallback.");
      messages = [{ role: 'user', content: "Hello" }]; 
    }

    // 5. GENERATE STREAM
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: SYSTEM_PROMPT,
      messages: messages, // <--- Now guaranteed to be a non-empty array
      
      onFinish: async ({ text }) => {
        try {
          // Save to Sanity
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

    // 6. RESPONSE (Using the method that works for your version)
    return result.toTextStreamResponse(); 

  } catch (error: any) {
    console.error('CRITICAL CHAT ERROR:', error);
    return new Response(JSON.stringify({ error: error.message || "Server Error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}