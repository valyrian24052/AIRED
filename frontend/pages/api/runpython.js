import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_TEXT, GENERATION_CONFIG } from './generation_config';

function formatResponse(text) {
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    formattedText = formattedText.replace(/- (.*?)(\n|$)/g, '<li>$1</li>');
    formattedText = formattedText.replace(/\n/g, '<br/>');
    return formattedText;
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userInput, history } = req.body;

        if (!userInput) {
            return res.status(400).json({ error: 'User input is required' });
        }

        if (!Array.isArray(history)) {
            return res.status(400).json({ error: 'History must be an array' });
        }

        try {
            const genAI = new GoogleGenerativeAI(process.env.API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

            const formattedHistory = history.map(item => ({
                role: item.type === 'user' ? 'user' : 'model',
                parts: [{ text: item.text }]
            }));

            const chat = model.startChat({
                history: formattedHistory,
            });
            let modelResponse=''
            let result = await chat.sendMessage(userInput);
            modelResponse = result.response.text();
            // console.log(modelResponse); 
            modelResponse = formatResponse(modelResponse);

            res.status(200).json({ content: modelResponse });
        } catch (error) {
            console.error('Error generating response from AI model:', error);
            res.status(500).json({ error: 'Failed to generate response from AI model' });
        }
    } else {
        res.status(405).json({ error: 'Only POST requests are allowed' });
    }
}
