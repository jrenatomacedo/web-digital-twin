const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GOOGLE_API_KEY || '';
const modelName = 'gemini-2.0-flash'; // Forcing correct model name for testing

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

    const geminiHistory = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const chatSession = model.startChat({
      history: geminiHistory
    });

    const lastMessage = "How are you?";
    console.log('Sending message:', lastMessage);
    
    const result = await chatSession.sendMessage(lastMessage);
    console.log('Response:', result.response.text());
    console.log('Test successful!');
  } catch (error) {
    console.error('Test failed with error:', error.message);
    if (error.response) {
      console.error('Response details:', error.response);
    }
  }
}

testGemini();
