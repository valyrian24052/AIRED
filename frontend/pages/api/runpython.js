import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userInput, history } = req.body;

        if (!userInput) {
            return res.status(400).json({ error: 'User input is required' });
        }

        try {
            // Initialize the GoogleGenerativeAI client with the API key
            const genAI = new GoogleGenerativeAI(process.env.API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // Prepare the history for the chat model
            const formattedHistory = history.map(item => ({
                role: item.type === 'user' ? 'user' : 'model',
                parts: [{ text: item.text }]
            }));

            // Start the chat with the history
            const chat = model.startChat({
                history: formattedHistory,
            });

            // Send the user's input as the next message in the conversation
            let result = await chat.sendMessage(userInput);

            // Collect the response
            const modelResponse = await result.response.text();

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
