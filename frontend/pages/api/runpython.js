import { exec } from 'child_process';
import path from 'path';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { userInput } = req.body;

        // Construct the path to the Python script
        const pythonScriptPath = path.join(process.cwd(), 'components/model.py');

        // Command to execute the Python script
        const command = `python3 ${pythonScriptPath} "${userInput}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error.message}`);
                return res.status(500).json({ error: 'Failed to generate response from Python script' });
            }

            if (stderr) {
                console.error(`Python script stderr: ${stderr}`);
                return res.status(500).json({ error: 'Failed to generate response from Python script' });
            }

            const responseText = stdout.trim();
            res.status(200).json({ response: responseText });
        });
    } else {
        res.status(405).json({ error: 'Only POST requests are allowed' });
    }
}
