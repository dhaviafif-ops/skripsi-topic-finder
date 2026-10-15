
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

Versi online **tidak memerlukan backend**. Halaman memanggil Groq AI langsung dari browser.

1. Buka https://dhaviafif-ops.github.io/skripsi-topic-finder/frontend/
2. Isi **Groq API Key** (format `gsk_...`). Dapatkan gratis di https://console.groq.com/keys
3. Isi Jurusan dan Minat Penelitian, lalu klik **Generate Topic**.

API key hanya disimpan di browser (localStorage) dan hanya dikirim ke Groq.

## Backend (Opsional)

Project juga menyertakan backend Flask (`app.py`) bila ingin memakai arsitektur server. Untuk memakainya, deploy ke hosting gratis, lalu ubah `GROQ_URL` di `frontend/script.js` agar menembak ke backend.

### Opsi A - Render (gratis, tanpa kartu kredit)

1. Push project ini ke GitHub.
2. Buka https://render.com -> **New** -> **Web Service** -> pilih repo ini.
3. Isi konfigurasi:
   - **Runtime**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: Free
4. Tambah **Environment Variable**: `GROQ_API_KEY` = kunci Groq milikmu.
5. Klik Deploy dan tunggu sampai mendapat URL, mis. `https://xxxx.onrender.com`.

Catatan: plan Free Render akan "tidur" setelah ~15 menit tanpa akses. Request pertama setelah tidur bisa lambat 30-60 detik.

### Opsi B - Railway

1. Push project ini ke GitHub.
2. Buat project baru di https://railway.app dari repo ini.
3. Set variable `GROQ_API_KEY` di tab Variables.
4. Railway otomatis memakai `Procfile` (`web: gunicorn app:app`).

## Menjalankan Secara Lokal

Cukup jalankan frontend lewat server statis (jangan dobel-klik file, karena browser memblokir `fetch` dari `file://`):

```bash
cd frontend
python -m http.server 5500
```

Lalu buka `http://127.0.0.1:5500` dan isi Groq API Key.

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
