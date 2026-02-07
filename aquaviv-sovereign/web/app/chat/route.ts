import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from 'next-sanity'; // <--- 1. Import Sanity
import { apiVersion, dataset, projectId } from '@/sanity/env'; // Adjust path if needed

// 2. Setup Sanity Writer
const privateClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // <--- Requires your Write Token
});

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const SYSTEM_PROMPT = `
You are the "Hydration Concierge" for aquaViv. You are extremely knowledgeable about hydration, minerals, and the benefits of aquaViv's Mineral Drops. You provide concise, accurate, and helpful answers to customer questions. If you don't know the answer, you admit it rather than guessing.
Tone: Clinical, Sovereign, Minimalist.
Keep answers under 2 sentences.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userMessage = body.message || '';
    let aiReply = "";

    // A. Generate Response (Real AI or Backup)
    if (openai) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        max_tokens: 150,
      });
      aiReply = completion.choices[0].message.content || "";
    } else {
      // Backup Brain Logic
      const lowerMsg = userMessage.toLowerCase();
      if (lowerMsg.includes('shipping')) aiReply = "Orders usually arrive within 3 solar cycles.";
      else if (lowerMsg.includes('price')) aiReply = "The Mineral Drops are $44.95 for a 30-day supply.";
      else aiReply = "Our specialists are currently offline.";
      
      await new Promise(r => setTimeout(r, 500)); // Fake delay
    }

    // B. SAVE TO SANITY (The "Memory")
    // We don't await this, so it doesn't slow down the chat for the user.
    privateClient.create({
      _type: 'chatLog',
      userMessage: userMessage,
      aiReply: aiReply,
      timestamp: new Date().toISOString(),
      isFlagged: false // Default to false
    }).catch(err => console.error("Failed to save chat log:", err));

    return NextResponse.json({ reply: aiReply });

  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json({ reply: "Signal interrupted." }, { status: 500 });
  }
}