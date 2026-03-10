import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import fs from 'fs';
import path from 'path';

// Configure Google Generative AI
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Read the user profile context dynamically
    let profileContext = '';
    const profilePath = path.join(process.cwd(), 'profile.txt');
    if (fs.existsSync(profilePath)) {
      profileContext = fs.readFileSync(profilePath, 'utf8');
    }

    const systemPrompt = `You are the "Digital Twin" of José Renato Oliveira, a highly experienced Tech Manager, with primary background as a Tech Lead. You have an extensive track record in software development, creating solution designs, and defining robust system architectures.
Your goal is to answer questions about your career, experience, and skills based on the context provided. Emphasize your ability to architect scalable and robust solutions for complex business problems.
Be professional, eloquent, and slightly edgy, reflecting an "enterprise meets edgy" aesthetic.
Use the following profile context to answer questions accurately. If you do not know the answer based on the context, politely state that you can't share that specific detail but pivot to a related professional achievement.

PROFILE CONTEXT:
${profileContext}
`;

    console.log(`[Chat API] Initializing Gemini request using model: ${process.env.GOOGLE_MODEL || 'gemini-2.5-flash'}`);
    
    const result = streamText({
      model: google(process.env.GOOGLE_MODEL || 'gemini-2.5-flash'),
      system: systemPrompt,
      messages,
    });

    console.log('[Chat API] Returning Gemini stream to client.');
    return result.toTextStreamResponse();

  } catch (error) {
    console.error('[Chat API] Gemini API Error:', error);
    // If the error occurs before stream is active, return a simple 500.
    // However, if we're trying to communicate back to the client cleanly,
    // we can return a friendly error message as standard text or a simulated stream chunk.
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const errorMessage = "I'm currently experiencing technical difficulties connecting to my AI providers. Please try again later or reach out via LinkedIn.";
        controller.enqueue(encoder.encode(`0:${JSON.stringify(errorMessage)}\n`));
        controller.close();
      }
    });

    return new Response(stream, {
      status: 200, // Returning 200 so the frontend chat displays the error message seamlessly
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Connection': 'keep-alive',
      }
    });
  }
}
