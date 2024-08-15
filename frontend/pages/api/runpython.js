import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userInput } = req.body;

        if (!userInput) {
            return res.status(400).json({ error: 'User input is required' });
        }

        try {
            const genAI = new GoogleGenerativeAI(process.env.API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // Call the model with the user input
            const result = await model.generateContent([userInput]);

            // Send the result back to the user
            res.status(200).json({ response: result.response.text() });
        } catch (error) {
            console.error(`Error executing AI model: ${error.message}`);
            res.status(500).json({ error: 'Failed to generate response from AI model' });
        }
    } else {
        res.status(405).json({ error: 'Only POST requests are allowed' });
    }
}
