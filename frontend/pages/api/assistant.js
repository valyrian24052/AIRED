import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_TEXT, GENERATION_CONFIG } from './generation_config';

// Function to fetch data from Zilliz
async function fetchDataFromZilliz(query) {
    const zillizUrl = "https://controller.api.gcp-us-west1.zillizcloud.com/v1/pipelines/pipe-1603107f0bf9a3d6c5a1a5/run";

    const payload = {
        "data": {
          "query_text": {query}
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
        console.error('Error retrieving data from Zilliz:', error);
        throw new Error('Data retrieval from Zilliz failed');
    }
}

// Your handler function
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userInput, history } = req.body;

        if (!userInput) {
            return res.status(400).json({ error: 'User input is required' });
        }

        try {
            
            const genAI = new GoogleGenerativeAI(process.env.API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

            
            const formattedHistory = history.map(item => ({
                role: item.type === 'user' ? 'user' : 'model',
                parts: [{ text: item.text }]
            }));

            
            const dynamicContext = await fetchDataFromZilliz(userInput);

            const contextMessage = {
                role: 'user',
                parts: [{ text: `${userInput} - Context: ${dynamicContext}` }]  
            };

            // console.log(contextMessage);
            const chat = model.startChat({
                systemInstructions: SYSTEM_TEXT,  
                history: [...formattedHistory, contextMessage],
                cacheContext: true  
            });


            
            let result = await chat.sendMessage(userInput, GENERATION_CONFIG);

            let modelResponse = await result.response.text();
            modelResponse = modelResponse.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');  
            modelResponse = modelResponse.replace(/- (.*?)(\n|$)/g, '<li>$1</li>');
            modelResponse = modelResponse.replace(/\* /g, '<br/>');

            res.status(200).json({ response: modelResponse });
        } catch (error) {
            console.error(`Error executing AI model: ${error.message}`);
            res.status(500).json({ error: 'Failed to generate response from AI model' });
        }
    } else {
        res.status(405).json({ error: 'Only POST requests are allowed' });
    }
}
