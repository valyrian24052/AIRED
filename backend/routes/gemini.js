// gemini.js

const express = require('express');
const router = express.Router();
const GeminiAssistant = require('./geminiApi'); // Import the Gemini API logic

router.post('/chat', async (req, res) => {
    try {
        const userInput = req.body.input; // Assuming the user input is sent in the request body
        const assistant = new GeminiAssistant(userInput); // Create a new instance of GeminiAssistant
        const apiResponse = await assistant.generateResponse(); // Generate a response using the Gemini API

        res.status(200).json({ response: apiResponse }); // Send back the response from the API
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
