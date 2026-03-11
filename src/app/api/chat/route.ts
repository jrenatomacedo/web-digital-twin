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

    const systemPrompt = `Você é o "Digital Twin" do José Renato Oliveira, Tech Manager e Tech Lead.
Responda de forma profissional e concisa às perguntas sobre sua carreira usando o contexto abaixo.

REGRAS CRÍTICAS:
1. Responda APENAS à pergunta mais recente do usuário.
2. NÃO repita informações de turnos anteriores (como nome ou moradia) a menos que seja perguntado novamente.
3. NÃO faça introduções repetitivas em cada resposta.
4. Se a pergunta for sobre algo que não está no contexto, seja educado e diga que não pode compartilhar esse detalhe.
5. Máximo de 500 caracteres.

CONTEXTO DO PERFIL:
${profileContext}
`;

    const modelName = process.env.GOOGLE_MODEL || 'gemini-2.5-flash';

    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt,
    });

    // Strictly map history to Gemini format, handling both content and parts (UI SDK v3/v4 format)
    const geminiHistory = messages.slice(0, -1)
      .filter((m: any) => m.role === 'user' || m.role === 'assistant')
      .map((m: any) => {
        let text = '';
        if (typeof m.content === 'string' && m.content) {
          text = m.content;
        } else if (Array.isArray(m.parts)) {
          text = m.parts
            .filter((p: any) => p.type === 'text')
            .map((p: any) => p.text)
            .join('');
        }

        return {
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: text || '' }],
        };
      })
      .filter((m: any) => m.parts[0].text.trim() !== '');

    const lastMessage = messages[messages.length - 1].content;
    if (!lastMessage) {
      throw new Error('Last message content is empty');
    }

    const result = await model.generateContentStream({
      contents: [
        ...geminiHistory,
        { role: 'user', parts: [{ text: lastMessage }] }
      ]
    });

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
