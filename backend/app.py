from flask import Flask, request, jsonify
from flask_cors import CORS

from groq import Groq
from dotenv import load_dotenv

import os

load_dotenv()

app = Flask(__name__)

CORS(app)

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

@app.route("/")
def home():
    return "AI Skripsi Topic Finder"

@app.route("/generate", methods=["POST"])
def generate():

    data = request.json

    major = data["major"]

    interest = data["interest"]

    prompt = f"""
Kamu adalah dosen pembimbing skripsi profesional.

Buatkan 3 ide skripsi terbaik.

Data mahasiswa:

Jurusan:
{major}

Minat penelitian:
{interest}

Untuk setiap ide skripsi, berikan:

1. Judul Skripsi
2. Research Gap
3. Metode Penelitian
4. Tools / Teknologi
5. Tingkat Kesulitan

Gunakan bahasa Indonesia yang jelas dan rapi.
"""

    response = client.chat.completions.create(

        model="llama-3.1-8b-instant",

        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]

    )

    result = response.choices[0].message.content

    return jsonify({
        "result": result
    })

if __name__ == "__main__":
    app.run(debug=True)