import axios from 'axios';
import { SYSTEM_TEXT, GENERATION_CONFIG } from './generation_config';

// Function to fetch data from Zilliz (unchanged)
async function fetchDataFromZilliz(query) {
    const zillizUrl = "https://controller.api.gcp-us-west1.zillizcloud.com/v1/pipelines/pipe-1603107f0bf9a3d6c5a1a5/run";

    const payload = {
        "data": {
          "query_text": query
        },
        "params": {
          "limit": 1,
          "offset": 0,
          "outputFields": [],
          "filter": "id >= 0"
        }
    };

    try {
        const response = await axios.post(zillizUrl, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.ZILLIZ_API_KEY}`
            }
        });
        
        const resultText = response.data.data.result[0]?.text || '';
        return resultText;
    } catch (error) {
        throw new Error('Data retrieval from Zilliz failed');
    }
}

// Function to format the response
function formatResponse(text) {
    // Replace double asterisks for bold text
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // Replace numbered list pattern for list items
    formattedText = formattedText.replace(/(\d+)\. (.*?)(\n|$)/g, '<li><b>$1.</b> $2</li>');

    // Ensure line breaks
    formattedText = formattedText.replace(/\n/g, '<br/>');

    return formattedText;
}

// Function to call OpenAI API and format the response
async function fetchOpenAIResponse(userInput, dynamicContext, res) {
    const openaiUrl = 'https://api.openai.com/v1/chat/completions';

    const payload = {
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: SYSTEM_TEXT
            },
            {
                role: "user",
                content: `${userInput} - Context: ${dynamicContext}`
            }
        ],
        stop: null,
        max_tokens: 2048
    };

    try {
        const response = await axios.post(openaiUrl, payload, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const aiResponse = response.data.choices[0].message.content;
        const formattedResponse = formatResponse(aiResponse);
        res.json({ content: formattedResponse });

    } catch (error) {
        res.status(500).json({ error: 'Failed to generate response from OpenAI model' });
    }
}

// Your handler function
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userInput } = req.body;

        if (!userInput) {
            return res.status(400).json({ error: 'User input is required' });
        }

        try {
            // Fetch dynamic context from Zilliz
            const dynamicContext = await fetchDataFromZilliz(userInput);

            // Fetch response from OpenAI, format it, and send it to the client
            await fetchOpenAIResponse(userInput, dynamicContext, res);

        } catch (error) {
            res.status(500).json({ error: `Failed to generate response from AI model: ${error.message}` });
        }
    } else {
        res.status(405).json({ error: 'Only POST requests are allowed' });
    }
}
