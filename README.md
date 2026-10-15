
# Skripsi Topic Finder
https://dhaviafif-ops.github.io/skripsi-topic-finder/frontend/

AI-powered Skripsi Topic Finder menggunakan:

- HTML
- CSS
- JavaScript
- Flask (opsional)
- Groq AI
- Railway (opsional)

## Features

- Generate ide topik skripsi
- Rekomendasi judul skripsi
- AI analysis menggunakan Groq
- Modern UI

## Tech Stack

Frontend:
- HTML
- CSS
- JavaScript

Backend:
- Flask

AI:
- Groq API

Deployment:
- Railway

## Installation

```bash
git clone https://github.com/dhaviafif-ops/skripsi-topic-finder.git
```

```bash
pip install -r requirements.txt
```

```bash
python app.py
```

## Cara Pakai (Versi Online)

1. Buka https://dhaviafif-ops.github.io/skripsi-topic-finder/frontend/
2. Isi Jurusan dan Minat Penelitian, lalu klik **Generate Topic**.

Tidak perlu mengisi API key. Kunci Groq disimpan aman di server, tidak terlihat di halaman publik.

## Backend Serverless (Cloudflare Worker)

Frontend memanggil backend serverless yang menyimpan kunci Groq sebagai Secret. Kodenya ada di `cloudflare-worker.js`.

Worker sudah ter-deploy di:
`https://skripsi-topic-finder.skripsi-topic-finder.workers.dev`

Untuk mengubah/men-deploy ulang (butuh login Cloudflare):

```bash
npx wrangler deploy
npx wrangler secret put GROQ_API_KEY
```

Bila ingin membuat Worker baru dari nol:
1. Buka https://dash.cloudflare.com -> **Workers & Pages** -> **Create** -> **Create Worker**.
2. Beri nama (mis. `skripsi-topic-finder`), lalu **Deploy**.
3. Klik **Edit code**, hapus isi bawaannya, tempel seluruh isi `cloudflare-worker.js`, lalu **Deploy**.
4. Buka **Settings** -> **Variables and Secrets** -> tambah:
   - Nama: `GROQ_API_KEY`
   - Nilai: kunci Groq milikmu
   - Tipe: **Secret**
5. Salin URL Worker (mis. `https://skripsi-topic-finder.namaakun.workers.dev`).
6. Ganti nilai `PROD_API` di `frontend/script.js` menjadi `<URL Worker>/generate`, lalu push.

### Alternatif - Render / Railway (Flask)

Bila lebih suka backend Flask (`app.py`) di hosting gratis:

- **Render**: New -> Web Service -> pilih repo; Runtime `Python`, Build `pip install -r requirements.txt`, Start `gunicorn app:app`, Plan `Free`, tambah env var `GROQ_API_KEY`.
- **Railway**: buat project baru dari repo, set variable `GROQ_API_KEY`; `Procfile` sudah disiapkan (`web: gunicorn app:app`).

Lalu ubah `PROD_API` di `frontend/script.js` ke URL backend tersebut.

## Menjalankan Secara Lokal

Cukup jalankan frontend lewat server statis (jangan dobel-klik file, karena browser memblokir `fetch` dari `file://`):

```bash
cd frontend
python -m http.server 5500
```

Lalu buka `http://127.0.0.1:5500`.

Bila ingin menjalankan backend Flask juga:

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Backend berjalan di `http://127.0.0.1:5000`.

## Author


Dihandra Dwi Andika &
Dhavi Rachmatul Afif
