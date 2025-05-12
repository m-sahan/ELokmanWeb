from flask import Flask, request, jsonify
from flask_cors import CORS
import anthropic
import os

app = Flask(__name__)
CORS(app)

# Claude API anahtarını environment variable'dan al
CLAUDE_API_KEY = os.getenv('CLAUDE_API_KEY')

# Claude istemcisini oluşturun
client = anthropic.Anthropic(api_key=CLAUDE_API_KEY)

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data['contents'][0]['parts'][0]['text']

        # Claude ile sohbet
        message = client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        )

        # Yanıtı döndür
        return jsonify({
            "candidates": [{
                "content": {
                    "parts": [{
                        "text": message.content[0].text
                    }]
                }
            }]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 