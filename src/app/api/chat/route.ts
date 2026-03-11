import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateId, createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY || ''
);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

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

    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt,
    });

    // Hardened history filtering to avoid malformed parts (400 Bad Request)
    const geminiHistory = messages.slice(0, -1)
      .filter((m: any) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim() !== '')
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const lastMessage = messages[messages.length - 1].content;
    if (!lastMessage || typeof lastMessage !== 'string' || lastMessage.trim() === '') {
      throw new Error('Last message content is empty');
    }

    const chatSession = model.startChat({
      history: geminiHistory
    });

    const result = await chatSession.sendMessageStream(lastMessage);

    const responseId = generateId();
    const stream = createUIMessageStream({
        async execute({ writer }) {
          // Required: Send text-start before any text-delta
          writer.write({ type: 'text-start', id: responseId });
          
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              writer.write({ type: 'text-delta', id: responseId, delta: chunkText });
            }
          }
          // Optional but recommended: Send text-end
          writer.write({ type: 'text-end', id: responseId });
        }
    });

    return createUIMessageStreamResponse({ stream });

  } catch (error: any) {
    console.error('[Chat API] Gemini API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
