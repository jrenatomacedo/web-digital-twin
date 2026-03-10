import { OpenRouter } from '@openrouter/sdk';
import { fromChatMessages } from '@openrouter/sdk';


const client = new OpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

async function run() {
  try {
    const result = client.callModel({
      models: ['openai/gpt-oss-120b:free', 'qwen/qwen-2-7b-instruct:free', 'nvidia/nemotron-3-nano-30b-a3b:free'],
      input: fromChatMessages([
        { role: 'system', content: 'You are a test agent.' },
        { role: 'user', content: 'Say hello!' }
      ])
    }, {
      fetchOptions: {
        headers: { 'HTTP-Referer': 'http://localhost:3002', 'X-Title': 'José Renato Digital Twin' }
      }
    });

    const streamPromise = (async () => {
      let hasEmitted = false;
      for await (const delta of result.getTextStream()) {
        process.stdout.write(delta);
        hasEmitted = true;
      }
      if (!hasEmitted) {
        console.log("\n[Error: No response emitted by any fallback model]");
      } else {
        console.log();
      }
    })();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Response timeout after 25 seconds')), 25000)
    );

    await Promise.race([streamPromise, timeoutPromise]);

  } catch (error) {
    console.error('\n[Error connecting to model]:', error instanceof Error ? error.message : error);
  }
}
run();
