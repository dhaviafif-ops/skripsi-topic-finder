# Product Requirements Document (PRD)
# SkripsiAI — Aplikasi Pencari Topik Skripsi Berbasis AI

**Nama:** Dhavi Afif
**NPM:** 25.01.53.0018
**Program Studi:** Teknik Informatika, Fakultas Teknologi Informasi & Industri
**Universitas:** Universitas Stikubank (UNISBANK) Semarang
**Mata Kuliah/Tugas:** UAS — Pengembangan Aplikasi Berbasis AI

---

## 1. Latar Belakang & Tujuan Project

### 1.1 Latar Belakang Masalah
Mahasiswa tingkat akhir sering kesulitan menentukan topik skripsi yang relevan, orisinal, dan sesuai dengan bidang keilmuan mereka. Proses ini biasanya memakan waktu lama karena harus membaca banyak referensi, mencari tren penelitian terbaru, dan berdiskusi berulang kali dengan dosen pembimbing hanya untuk sampai pada satu ide topik yang layak.

### 1.2 Visi Produk
Membangun aplikasi web berbasis AI bernama **SkripsiAI** yang membantu mahasiswa menemukan rekomendasi topik skripsi secara cepat berdasarkan bidang minat, jurusan, dan kata kunci yang mereka masukkan, dengan memanfaatkan kecepatan inferensi AI (Groq API) untuk memberikan hasil secara real-time.

### 1.3 Tujuan Project
- Mempercepat proses brainstorming topik skripsi bagi mahasiswa.
- Memberikan rekomendasi topik yang terstruktur (judul, latar belakang singkat, dan rumusan masalah).
- Menyediakan antarmuka yang sederhana dan cepat diakses melalui browser.

### 1.4 Metrik Keberhasilan (KPI)
| Metrik | Target |
|---|---|
| Waktu respons AI menghasilkan rekomendasi | < 5 detik |
| Jumlah topik yang dihasilkan per request | 3–5 topik |
| Tingkat keberhasilan request (tanpa error) | ≥ 95% |

---

## 2. User Persona & Target Pengguna

**Persona: Mahasiswa Tingkat Akhir**
- Usia 20–23 tahun, sedang menyusun proposal skripsi.
- Memiliki bidang minat tertentu (misal: Kecerdasan Buatan, Sistem Informasi, Jaringan) tetapi belum punya judul spesifik.
- Mengakses aplikasi dari laptop maupun HP, butuh proses yang cepat dan tidak rumit.
- Kebutuhan utama: input minat → output beberapa pilihan judul skripsi yang relevan dan bisa langsung didiskusikan ke dosen pembimbing.

---

## 3. Daftar Fitur Prioritas (MVP)

1. **Input Minat/Bidang Studi** — Form input teks bebas untuk memasukkan bidang/kata kunci (contoh: "Computer Vision", "Sistem Pakar").
2. **Generate Rekomendasi Topik (via Groq API)** — Backend FastAPI mengirim prompt ke Groq API dan mengembalikan 3–5 rekomendasi judul beserta deskripsi singkat & rumusan masalah.
3. **Tampilan Hasil Terstruktur** — Hasil ditampilkan dalam bentuk kartu/list yang rapi (judul, ringkasan, rumusan masalah).
4. **Riwayat Pencarian (opsional/nice-to-have)** — Menyimpan request terakhir dalam sesi browser agar pengguna bisa membandingkan hasil.

**Di luar cakupan (Out of Scope) untuk versi MVP ini:**
- Login/akun pengguna
- Penyimpanan permanen ke database
- Ekspor hasil ke PDF/Word

---

## 4. Detail Teknis

### 4.1 Arsitektur Sistem
- **Frontend:** HTML/CSS/JS sederhana (form input + tampilan hasil).
- **Backend:** FastAPI (Python) sebagai REST API yang menerima input pengguna dan meneruskannya ke Groq API.
- **AI Engine:** Groq API (model bahasa) sebagai penghasil rekomendasi topik.
- **Hosting:** Railway (deployment backend FastAPI).

### 4.2 User Flow
1. Pengguna membuka aplikasi SkripsiAI.
2. Pengguna mengisi form: bidang minat / kata kunci.
3. Pengguna menekan tombol "Cari Topik".
4. Frontend mengirim request ke endpoint backend (`POST /generate-topic`).
5. Backend menyusun prompt dan mengirim ke Groq API.
6. Backend menerima respons, memformat ulang menjadi JSON terstruktur.
7. Frontend menampilkan hasil (3–5 topik) dalam bentuk kartu.
8. Jika terjadi error (lihat 4.4), tampilkan pesan kesalahan yang jelas ke pengguna.

### 4.3 Skema & Validasi Input Data
| Field | Tipe | Validasi |
|---|---|---|
| `keyword` (bidang minat) | string | Wajib diisi, minimal 3 karakter, maksimal 100 karakter |
| `jurusan` (opsional) | string | Maksimal 50 karakter, jika kosong gunakan default "Teknik Informatika" |

Validasi dilakukan di sisi frontend (sebelum submit) **dan** di sisi backend (FastAPI Pydantic model) sebagai lapisan keamanan kedua.

### 4.4 Skenario Error Handling
| Skenario | Penanganan |
|---|---|
| Input kosong / kurang dari 3 karakter | Tampilkan pesan: "Mohon isi minat/bidang minimal 3 karakter." |
| Koneksi ke Groq API gagal/timeout | Tampilkan pesan: "Server AI sedang sibuk, coba beberapa saat lagi." (timeout di-set 10 detik) |
| Respons Groq API tidak sesuai format JSON yang diharapkan | Backend melakukan fallback parsing; jika gagal, kembalikan error 502 dengan pesan generik ke frontend |
| Rate limit API tercapai | Tampilkan pesan: "Batas permintaan tercapai, silakan coba lagi dalam beberapa menit." |
| Server backend down (Railway) | Frontend menampilkan pesan retry otomatis (1x) sebelum menampilkan error final |

---

## 5. Kriteria Penerimaan (Acceptance Criteria)

- [ ] Aplikasi dapat menerima input minat/bidang dari pengguna melalui form.
- [ ] Sistem mengembalikan 3–5 rekomendasi topik skripsi yang relevan dengan input dalam waktu < 5 detik.
- [ ] Setiap rekomendasi topik menampilkan: judul, ringkasan singkat, dan rumusan masalah.
- [ ] Sistem menampilkan pesan error yang jelas (bukan crash/blank page) untuk setiap skenario kegagalan pada poin 4.4.
- [ ] Input kosong atau tidak valid ditolak sebelum request dikirim ke Groq API.
- [ ] Aplikasi dapat diakses secara publik melalui URL hasil deployment Railway.

---

*Dokumen ini disusun sebagai pemenuhan Tugas UAS mata kuliah Pengembangan Aplikasi Berbasis AI, Universitas Stikubank Semarang.*
https://github.com/dhaviafif-ops/skripsi-topic-finder/blob/main/uas_prd_25.01.53.0018.md
