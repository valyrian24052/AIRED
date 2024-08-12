// backend/api/geminiApi.js

const { exec } = require('child_process');
const path = require('path');

// Function to call the Python script
function getGeminiResponse(userInput) {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.join(__dirname, './gemini_integration.py');
    const command = `python3 ${pythonScriptPath} "${userInput}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return reject('Failed to generate response from Gemini API');
      }

      if (stderr) {
        console.error(`Python script stderr: ${stderr}`);
        return reject('Failed to generate response from Gemini API');
      }

      const responseText = stdout.trim();
      resolve(responseText);
    });
  });
}

module.exports = { getGeminiResponse };
