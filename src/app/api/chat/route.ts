import { OpenRouter } from '@openrouter/sdk';
import { fromChatMessages } from '@openrouter/sdk';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import fs from 'fs';
import path from 'path';

// Use the official OpenRouter SDK
const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Configure Google Generative AI for Fallback
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

    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    // We manually construct a React AI SDK compatible data stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let hasEmitted = false;
        try {
          // 1. Try OpenRouter First
          const result = openrouter.callModel({
            models: [
              'openai/gpt-oss-120b:free', // Requested by user initially
              'qwen/qwen-2-72b-instruct:free',
              'meta-llama/llama-3-8b-instruct:free',
              'openrouter/free'
            ],
            input: fromChatMessages(chatMessages)
          }, {
            fetchOptions: {
              headers: {
                'HTTP-Referer': 'http://localhost:3000', // Update to actual domain in prod
                'X-Title': 'José Renato Digital Twin',
              }
            }
          });

          const streamPromise = (async () => {
            for await (const delta of result.getTextStream()) {
              if (delta) {
                hasEmitted = true;
                controller.enqueue(encoder.encode(`0:${JSON.stringify(delta)}\n`));
              }
            }
            console.log('[Chat API] Completed successfully via OpenRouter.');
          })();

          // Strict timeout for OpenRouter
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('OpenRouter response timeout')), 10000)
          );

          await Promise.race([streamPromise, timeoutPromise]);

          if (!hasEmitted) {
            throw new Error('OpenRouter finished without emitting any output.');
          }
          controller.close();
        } catch (error) {
          console.warn('[Chat API] OpenRouter Streaming Failed / Timed out. Attempting Gemini fallback...', error);

          if (!hasEmitted) {
            // 2. Fallback to Gemini API
            try {
              console.log(`[Chat API] Initializing Gemini fallback request using model: ${process.env.GOOGLE_MODEL || 'gemini-1.5-flash'}`);
              const geminiResult = streamText({
                model: google(process.env.GOOGLE_MODEL || 'gemini-1.5-flash'),
                system: systemPrompt,
                messages, // use original messages block (without system embedded)
              });

              for await (const delta of geminiResult.textStream) {
                if (delta) {
                  controller.enqueue(encoder.encode(`0:${JSON.stringify(delta)}\n`));
                }
              }
              console.log('[Chat API] Completed successfully via Gemini Fallback.');
              controller.close();
            } catch (geminiError) {
              console.error('[Chat API] Gemini Fallback Error:', geminiError);
              const errorMessage = "I'm currently experiencing technical difficulties connecting to my AI providers. Please try again later or reach out via LinkedIn.";
              controller.enqueue(encoder.encode(`0:${JSON.stringify(errorMessage)}\n`));
              controller.close();
            }
          } else {
            // Connection interrupted after partial stream
            controller.enqueue(encoder.encode(`0:${JSON.stringify("\n\n[Connection interrupted to primary model]")}\n`));
            controller.close();
          }
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Connection': 'keep-alive',
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
