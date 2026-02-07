import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';
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
    // 3. ROBUST INPUT HANDLING
    // We try to read 'messages', 'message', or 'prompt' to support all frontend types
    const body = await req.json();
    
    let conversationMessages = [];

    // CASE A: Standard AI SDK (Array of messages)
    if (body.messages && Array.isArray(body.messages)) {
      conversationMessages = body.messages;
    } 
    // CASE B: Custom Frontend (Single string message)
    else if (body.message) {
      conversationMessages = [{ role: 'user', content: body.message }];
    }
    // CASE C: Fallback
    else if (body.prompt) {
      conversationMessages = [{ role: 'user', content: body.prompt }];
    }
    else {
      throw new Error("No message found in request body.");
    }

    // 4. GENERATE STREAM
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: SYSTEM_PROMPT,
      messages: convertToCoreMessages(conversationMessages), // Ensure format is correct
      
      // 5. SAVE TO SANITY (Background)
      onFinish: async ({ text }) => {
        try {
          // Get the last user message safely
          const lastUserMessage = conversationMessages[conversationMessages.length - 1]?.content || "Unknown";
          
          await privateClient.create({
            _type: 'chatLog',
            userMessage: typeof lastUserMessage === 'string' ? lastUserMessage : JSON.stringify(lastUserMessage),
            aiReply: text,
            timestamp: new Date().toISOString(),
            isFlagged: false
          });
          console.log("Chat logged to Sanity");
        } catch (err) {
          console.error("Failed to save log:", err);
        }
      },
    });

    // 6. RETURN RESPONSE
    return result.toDataStreamResponse();

  } catch (error: any) {
    console.error('Chat Error:', error);
    return new Response(JSON.stringify({ error: error.message || "Invalid Request" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}