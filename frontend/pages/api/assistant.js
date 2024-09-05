
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_TEXT, GENERATION_CONFIG } from './generation_config';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userInput, history } = req.body;

        if (!userInput) {
            return res.status(400).json({ error: 'User input is required' });
        }

        try {
            // Initialize the GoogleGenerativeAI client with the API key
            const genAI = new GoogleGenerativeAI(process.env.API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-001" });

            // Prepare the history for the chat model
            const formattedHistory = history.map(item => ({
                role: item.type === 'user' ? 'user' : 'model',
                parts: [{ text: item.text }]
            }));

            // Start the chat with the history
            const chat = model.startChat({
                history: formattedHistory,
            });

            
            const prompt = `System: ${SYSTEM_TEXT}\nUser: ${userInput}\nAssistant:`;

            let result = await chat.sendMessage(prompt, GENERATION_CONFIG);

            // Collect the response
            let modelResponse = await result.response.text();

            // Convert markdown-like formatting (** for bold, - for lists) to HTML
            modelResponse = modelResponse.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');  // Bold text
            modelResponse = modelResponse.replace(/- (.*?)(\n|$)/g, '<li>$1</li>'); // List items
            modelResponse = modelResponse.replace(/\* /g, '<br/>');

            // Send the model's response back to the frontend
            res.status(200).json({ response: modelResponse });
        } catch (error) {
            console.error(`Error executing AI model: ${error.message}`);
            res.status(500).json({ error: 'Failed to generate response from AI model' });
        }
    } else {
        res.status(405).json({ error: 'Only POST requests are allowed' });
    }
}
