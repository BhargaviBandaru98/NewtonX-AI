import OpenAI from 'openai';

// Groq uses OpenAI-compatible SDK but with different base URL and API key
if (!process.env.GROQ_API_KEY) {
  throw new Error('❌ GROQ_API_KEY is not defined in environment variables');
}

// Initialize Groq client using OpenAI SDK
// Groq API is OpenAI-compatible, so we use the same SDK with custom base URL
const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

console.log('✅ Groq API client initialized successfully');

export default groqClient;