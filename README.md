
# Skripsi Topic Finder
https://dhaviafif-ops.github.io/skripsi-topic-finder/frontend/

AI-powered Skripsi Topic Finder menggunakan:

- HTML
- CSS
- JavaScript
- Flask
- Groq AI
- Railway

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

## Deploy Ulang Backend

Backend lama di Railway sudah tidak aktif. Untuk menghidupkan versi online, deploy backend ke hosting gratis, lalu arahkan frontend ke URL baru tersebut.

### Opsi A - Render (gratis, tanpa kartu kredit)

1. Push project ini ke GitHub.
2. Buka https://render.com -> **New** -> **Web Service** -> pilih repo ini.
3. Isi konfigurasi:
   - **Runtime**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: Free
4. Tambah **Environment Variable**:
   - `GROQ_API_KEY` = kunci Groq milikmu
5. Klik Deploy dan tunggu sampai mendapat URL, mis. `https://xxxx.onrender.com`.
6. Ganti nilai `PROD_API` di `frontend/script.js` dengan URL tersebut, lalu push.

Catatan: plan Free Render akan "tidur" setelah ~15 menit tanpa akses. Request pertama setelah tidur bisa lambat 30-60 detik.

### Opsi B - Railway

1. Push project ini ke GitHub.
2. Buat project baru di https://railway.app dari repo ini.
3. Set variable `GROQ_API_KEY` di tab Variables.
4. Railway otomatis memakai `Procfile` (`web: gunicorn app:app`).
5. Ganti nilai `PROD_API` di `frontend/script.js` dengan domain Railway, lalu push.

## Menjalankan Secara Lokal

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Backend berjalan di `http://127.0.0.1:5000`. Untuk frontend, buka `frontend/index.html` lewat server statis (jangan dobel-klik file, karena browser memblokir `fetch` dari `file://`):

```bash
cd frontend
python -m http.server 5500
```

Lalu buka `http://127.0.0.1:5500`.

## Author


Dihandra Dwi Andika &
Dhavi Rachmatul Afif
