/* ===== KONFIGURASI ===== */

// Backend saat dijalankan lokal (Flask: python app.py)
const LOCAL_API = "http://127.0.0.1:5000/generate";

// Backend online (Cloudflare Worker)
const PROD_API = "https://skripsi-topic-finder.skripsi-topic-finder.workers.dev/generate";

// Otomatis pilih: dibuka lokal -> LOCAL_API, dibuka online -> PROD_API
const API_URL =
    location.protocol === "file:" ||
    ["localhost", "127.0.0.1"].includes(location.hostname)
        ? LOCAL_API
        : PROD_API;


/* ===== GENERATE ===== */

async function generateTopic() {

    const result = document.getElementById("result");
    const loading = document.getElementById("loading");
    const btn = document.getElementById("generateBtn");

    const major = document.getElementById("jurusan").value.trim();
    const interest = document.getElementById("minat").value.trim();

    if (!major || !interest) {
        result.innerHTML = `
            <div class="welcome-box">
                ⚠️ Isi jurusan dan minat terlebih dahulu
            </div>
        `;
        return;
    }

    loading.style.display = "block";
    btn.disabled = true;

    result.innerHTML = `
        <div class="welcome-box">
            🤖 AI sedang menganalisis topik...
        </div>
    `;

    // scroll ke hasil agar terlihat di layar HP
    result.scrollIntoView({ behavior: "smooth", block: "start" });

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                major: major,
                interest: interest
            })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.error || ("Server error: " + response.status));
        }

        loading.style.display = "none";
        btn.disabled = false;

        const clean = String(data.result || "Tidak ada hasil.")
            .replace(/\*\*/g, "")
            .replace(/^#{1,6}\s*/gm, "");

        typeWriter(clean, result);

    } catch (error) {

        loading.style.display = "none";
        btn.disabled = false;

        result.innerHTML = `
            <div class="welcome-box">
                ❌ Gagal memuat hasil.<br>
                ${error.message || "Server tidak aktif / error koneksi."}
            </div>
        `;
    }
}


/* TYPEWRITER EFFECT */

function typeWriter(text, element) {

    element.innerHTML = `<div class="typing-box"></div>`;

    const target = element.querySelector(".typing-box");

    let i = 0;
    const speed = 12;

    function typing() {
        if (i < text.length) {
            target.textContent += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }

    typing();
}
