// backend/routes/gemini.js

const express = require('express');
const router = express.Router();
const { getGeminiResponse } = require('../api/geminiApi'); 

router.post('/chat', async (req, res) => {
  const userInput = req.body.input;

  if (!userInput) {
    return res.status(400).json({ error: 'No input provided' });
  }

  try {
    const responseText = await getGeminiResponse(userInput); 
    res.status(200).json({ response: responseText });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
