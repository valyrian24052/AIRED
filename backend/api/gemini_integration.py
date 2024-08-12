import os
import json
import sys  
import codecs
import google.generativeai as genai
from system_text import SYSTEM_TEXT
from generation_config import GENERATION_CONFIG

class MedicalAssistant:
    CREDENTIALS_PATH = 'config/credentials.json'

    def __init__(self, text):
        self.text = text
        self.api_key = self._load_api_key()
        self._configure_genai()

    def _load_api_key(self):
        if os.path.exists(self.CREDENTIALS_PATH):
            with open(self.CREDENTIALS_PATH, 'r') as file:
                credentials_data = json.load(file)
                api_key = credentials_data.get('api_key')
                if not api_key:
                    raise ValueError("API key not found in the credentials file")
                return api_key
        else:
            raise FileNotFoundError(f"Credentials file not found at {self.CREDENTIALS_PATH}")

    def _configure_genai(self):
        genai.configure(api_key=self.api_key)

    def gen_out(self):
        user_text = self.text
        prompt = f"System: {SYSTEM_TEXT}\nUser: {user_text}\nAssistant:"

        model = genai.GenerativeModel(
            model_name="gemini-1.5-pro",
            generation_config=GENERATION_CONFIG
        )

        response = model.generate_content(prompt)
        return response.text  

if __name__ == "__main__":
    if len(sys.argv) > 1:
        input_text = sys.argv[1]  
        assistant = MedicalAssistant(input_text)
        result = assistant.gen_out()
        sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())
        
        print(result)  
    else:
        print("No input provided.")
