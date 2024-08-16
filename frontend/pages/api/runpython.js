import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userInput, history } = req.body;

        if (!userInput) {
            return res.status(400).json({ error: 'User input is required' });
        }

        try {
            const genAI = new GoogleGenerativeAI(process.env.API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // Start chat with provided history and send the user input
            const resultStream = await model.generateContentStream(userInput);

            // Set headers for event-stream
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            for await (const chunk of resultStream.stream) {
                const chunkText = chunk.text();
                res.write(`data: ${chunkText}\n\n`);  // Send chunks to client
              }


            res.end();
        } catch (error) {
            console.error(`Error executing AI model: ${error.message}`);
            res.status(500).json({ error: 'Failed to generate response from AI model' });
        }
    } else {
        res.status(405).json({ error: 'Only POST requests are allowed' });
    }
}
