// geminiApi.js

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration path for the credentials
const CREDENTIALS_PATH = path.join(__dirname, 'config', 'credentials.json');

class GeminiAssistant {
    constructor(text) {
        this.text = text;
        this.apiKey = this._loadApiKey();
    }

    _loadApiKey() {
        if (fs.existsSync(CREDENTIALS_PATH)) {
            const credentialsData = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
            const apiKey = credentialsData.api_key;
            if (!apiKey) {
                throw new Error('API key not found in the credentials file');
            }
            return apiKey;
        } else {
            throw new Error(`Credentials file not found at ${CREDENTIALS_PATH}`);
        }
    }

    async generateResponse() {
        const prompt = `System: ${SYSTEM_TEXT}\nUser: ${this.text}\nAssistant:`;

        try {
            const response = await axios.post('https://gemini-api-endpoint-url', {
                prompt: prompt,
                model_name: "gemini-1.5-pro",
                generation_config: GENERATION_CONFIG
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.text; // Assuming the response contains the generated text
        } catch (error) {
            console.error('Error generating response from Gemini API:', error);
            throw new Error('Failed to generate response from Gemini API');
        }
    }
}

module.exports = GeminiAssistant;
