import os

# Define the directory structure
directories = [
    "backend/config",
    "backend/controllers",
    "backend/routes",
    "backend/services",
    "backend/models",
    "backend/middlewares",
    "backend/utils",
    "frontend/components",
    "frontend/pages",
    "frontend/public",
    "frontend/styles",
    "frontend/utils"
]

# Define the files to create within those directories
files = {
    "backend/app.js": """\
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Example route
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
""",
    "backend/routes/gemini.js": """\
const express = require('express');
const router = express.Router();

router.post('/chat', async (req, res) => {
    // Logic to handle API call to Gemini
    res.send('This will handle the Gemini API call');
});

module.exports = router;
""",
    "frontend/pages/index.js": """\
import { useState } from 'react';

export default function Home() {
    const [message, setMessage] = useState('');
    const [responses, setResponses] = useState([]);

    const sendMessage = async () => {
        const response = await fetch('/api/gemini/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();
        setResponses([...responses, data.reply]);
        setMessage('');
    };

    return (
        <div>
            <h1>Chat with Gemini</h1>
            <div>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask a question..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <div>
                {responses.map((response, index) => (
                    <p key={index}>{response}</p>
                ))}
            </div>
        </div>
    );
}
""",
    "frontend/next.config.js": """\
module.exports = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:5000/api/:path*',
            },
        ];
    },
};
""",
    "backend/.gitkeep": "",
    "frontend/.gitkeep": "",
}

# Create the directories
for directory in directories:
    os.makedirs(directory, exist_ok=True)

# Create the files with their respective content
for file_path, content in files.items():
    with open(file_path, 'w') as file:
        file.write(content)

print("Directory structure and files created successfully.")
