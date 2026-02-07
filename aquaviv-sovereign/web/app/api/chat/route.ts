import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai'; // Removed 'convertToCoreMessages'
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

export const runtime = 'edge';

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
    const { messages } = await req.json();

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: SYSTEM_PROMPT,
      messages: messages, // Pass raw messages (older SDK handles this)
      
      onFinish: async ({ text }) => {
        try {
          // Save to Sanity
          await privateClient.create({
            _type: 'chatLog',
            userMessage: messages[messages.length - 1].content,
            aiReply: text, // 'text' is available here
            timestamp: new Date().toISOString(),
            isFlagged: false
          });
        } catch (err) {
          console.error("Failed to save log:", err);
        }
      },
    });

    // FIX: Use the method your error suggested
    return result.toTextStreamResponse(); 

  } catch (error) {
    console.error('Chat Error:', error);
    return new Response(JSON.stringify({ error: "Connection interrupted." }), { 
      status: 500 
    });
  }
}