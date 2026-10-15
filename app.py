from flask import Flask, request, jsonify
from flask_cors import CORS

from groq import Groq
from dotenv import load_dotenv

import os

load_dotenv()

app = Flask(__name__)

CORS(app)

MODEL = "openai/gpt-oss-120b"

@app.route("/")
def home():
    return "AI Skripsi Topic Finder"

@app.route("/generate", methods=["POST"])
def generate():

    data = request.get_json(silent=True) or {}

    major = (data.get("major") or "").strip()

    interest = (data.get("interest") or "").strip()

    if not major or not interest:

        return jsonify({
            "error": "Jurusan dan minat penelitian wajib diisi."
        }), 400

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:

        return jsonify({
            "error": "GROQ_API_KEY belum di-set di server."
        }), 500

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

    try:

        client = Groq(
            api_key=api_key
        )

        response = client.chat.completions.create(

            model=MODEL,

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]

        )

    except Exception as e:

        return jsonify({
            "error": f"Gagal memanggil Groq: {e}"
        }), 502

    result = response.choices[0].message.content

    return jsonify({
        "result": result
    })

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", "5000")),
        debug=True
    )
