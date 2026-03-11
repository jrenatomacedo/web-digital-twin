const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GOOGLE_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    // There is no direct listModels in GoogleGenerativeAI from @google/generative-ai 
    // it usually is used with a specific model.
    // However, I can try to use a known working model like 'gemini-1.5-flash' or 'gemini-1.5-pro'
    console.log('Testing gemini-1.5-flash-latest...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const result = await model.generateContent('Hi');
    console.log('Response:', result.response.text());
    console.log('gemini-1.5-flash-latest works!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
