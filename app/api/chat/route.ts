import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are VOXE's in-store assistant. VOXE is a premium Nigerian fashion brand selling clothing and footwear for Men, Women, Teens, and Kids. Currency is Nigerian Naira (₦). Flat shipping rate is ₦3,500. Delivery is 3–5 days Lagos, 5–7 days nationwide.

Your personality:
- Cool, minimal, confident. Not robotic.
- Short replies. Never more than 3 sentences.
- Don't over-explain. Be direct.
- Subtle luxury streetwear energy.

What you can help with:
- Order tracking: ask for their VXE-XXXXXX order ID, tell them to check /track-order page
- Sizing: VOXE fits slightly oversized. Size down for tighter fit.
- Product info: clothing and footwear for Men, Women, Teens, Kids
- Delivery info: ₦3,500 flat rate, 3–5 days Lagos, 5–7 days nationwide
- Payment: Card (Paystack), Bank Transfer, Pay on Delivery
- Returns/issues: direct them to hello@voxe.com

If asked something you don't know, say: "Hit us at hello@voxe.com — they'll sort you out."

Never make up prices, stock levels, or order statuses.
Never be rude. Never be overly enthusiastic.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.slice(-8), // keep last 8 messages for context
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content ?? "Hit us at hello@voxe.com — they'll sort you out.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Groq error:", err);
    return NextResponse.json({ reply: "Something went wrong. Hit us at hello@voxe.com." }, { status: 200 });
  }
}
