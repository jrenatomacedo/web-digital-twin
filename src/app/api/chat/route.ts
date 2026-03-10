import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Configure Google Generative AI natively
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY || ''
);

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
IMPORTANT: Keep your responses objective, concise, and under 600 characters.
Use the following profile context to answer questions accurately. If you do not know the answer based on the context, politely state that you can't share that specific detail but pivot to a related professional achievement.

PROFILE CONTEXT:
${profileContext}
`;

    const modelName = process.env.GOOGLE_MODEL || 'gemini-2.5-flash';
    console.log(`[Chat API] Initializing Gemini request using native SDK, model: ${modelName}`);
    
    // Initialize the model
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt,
    });

    // Convert messages to Gemini format (roles: 'user' and 'model')
    const geminiHistory = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    
    const lastMessage = messages[messages.length - 1].content;

    const chatSession = model.startChat({
        history: geminiHistory
    });

    const result = await chatSession.sendMessageStream(lastMessage);
    
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = '';
        try {
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                fullResponse += chunkText;
                // Vercel AI SDK on the frontend expects data prefixed with "0:" and a JSON encoded string, followed by a newline.
                controller.enqueue(encoder.encode(`0:${JSON.stringify(chunkText)}\n`));
            }
            console.log(`\n\n[Chat API] Completed successfully. Full Gemini Response:\n---------------------------------------------------------------\n${fullResponse}\n---------------------------------------------------------------\n\n`);
            controller.close();
        } catch(e) {
            console.error('[Chat API] Gemini Stream Error:', e);
            controller.error(e);
        }
      }
    });

    console.log('[Chat API] Returning Gemini stream to client.');
    return new Response(stream, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            'Connection': 'keep-alive',
        }
    });

  } catch (error) {
    console.error('[Chat API] Gemini API Error:', error);
    // If the error occurs before stream is active, return a friendly error message as a simulated stream chunk.
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const errorMessage = "I'm currently experiencing technical difficulties connecting to my AI providers. Please try again later or reach out via LinkedIn.";
        controller.enqueue(encoder.encode(`0:${JSON.stringify(errorMessage)}\n`));
        controller.close();
      }
    });

    return new Response(stream, {
      status: 200, 
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Connection': 'keep-alive',
      }
    });
  }
}
