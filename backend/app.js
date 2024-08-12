// backend/server.js

const express = require('express');
const bodyParser = require('body-parser');
const geminiRoute = require('./routes/gemini'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json()); 

// Routes
app.use('/api', geminiRoute); 

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
