export const config = {
    runtime: 'edge',
  };
  

import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_TEXT, GENERATION_CONFIG } from './generation_config';


export default async function handler(req) {
    if (req.method === 'POST') {
      const { userInput, history } = req.body;
  
      if (!userInput) {
        return new Response(JSON.stringify({ error: 'User input is required' }), { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        });
      }
  
      try {
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-001" });
  
        const formattedHistory = history.map(item => ({
          role: item.type === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }],
        }));
  
        const chat = model.startChat({ history: formattedHistory });
  
        const prompt = `System: ${SYSTEM_TEXT}\nUser: ${userInput}\nAssistant:`;
  
        let result = await chat.sendMessage(prompt, GENERATION_CONFIG);
        let modelResponse = await result.response.text();
  
        modelResponse = modelResponse.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        modelResponse = modelResponse.replace(/- (.*?)(\n|$)/g, '<li>$1</li>');
        modelResponse = modelResponse.replace(/\* /g, '<br/>');
  
        return new Response(JSON.stringify({ response: modelResponse }), { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' } 
        });
      } catch (error) {
        console.error(`Error executing AI model: ${error.message}`);
        return new Response(JSON.stringify({ error: 'Failed to generate response from AI model' }), { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        });
      }
    } else {
      return new Response(JSON.stringify({ error: 'Only POST requests are allowed' }), { 
        status: 405, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
  }