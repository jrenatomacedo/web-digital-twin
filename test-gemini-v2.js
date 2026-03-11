const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyDZ8V-hpCIre9-k1Umdt8Ydck2prjVSk8A';
const modelName = 'gemini-2.5-flash';

console.log('Testing Gemini API with model:', modelName);

const genAI = new GoogleGenerativeAI(apiKey);

async function testGemini() {
  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: "You are a helpful assistant.",
    });

    const messages = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' }
    ];

    // Simulating the backend conversion logic
    const geminiHistory = messages
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim() !== '')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const chatSession = model.startChat({
      history: geminiHistory
    });

    const lastMessage = "Verify that you are working. respond only OK.";
    console.log('Sending message:', lastMessage);
    
    const result = await chatSession.sendMessage(lastMessage);
    console.log('Response:', result.response.text());
    
    if (result.response.text().trim().toUpperCase().includes('OK')) {
        console.log('Test successful!');
    } else {
        console.log('Response received but was not the expected OK:', result.response.text());
    }
  } catch (error) {
    console.error('Test failed with error:', error.message);
    if (error.response) {
      console.error('Response details:', JSON.stringify(error.response, null, 2));
    }
  }
}

testGemini();
