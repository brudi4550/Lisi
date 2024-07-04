import os
from flask import Flask, request, jsonify
from huggingface_hub import login
import transformers
import torch

# Get the Hugging Face access token from environment variables
hf_access_token = os.getenv('HF_ACCESS_TOKEN')

login(token=hf_access_token)

# Set the model ID
model_id = "meta-llama/Meta-Llama-3-70B"

# Initialize the text generation pipeline
pipeline = transformers.pipeline(
    "text-generation", 
    model=model_id, 
    model_kwargs={"torch_dtype": torch.bfloat16}, 
    device_map="auto",
    use_auth_token=hf_access_token
)

# Create a Flask app
app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def generate_text():
    data = request.json
    input_text = data.get('input_text', '')
    if not input_text:
        return jsonify({'error': 'input_text is required'}), 400

    # Generate text using the pipeline
    output = pipeline(input_text)
    generated_text = output[0]['generated_text']
    
    return jsonify({'generated_text': generated_text})

if __name__ == '__main__':
    port = int(os.getenv('LLAMA3_PORT', 3001))
    app.run(host='0.0.0.0', port=port)
