/* ===== KONFIGURASI ===== */

// Model Groq yang dipakai
const GROQ_MODEL = "openai/gpt-oss-120b";

// Endpoint chat Groq (dipanggil langsung dari browser, tanpa backend)
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";


/* ===== API KEY (disimpan di browser, tidak dikirim ke mana pun selain Groq) ===== */

function getApiKey() {

    const input = document.getElementById("apiKey");

    const fromInput = input ? input.value.trim() : "";

    if (fromInput) {
        localStorage.setItem("groq_api_key", fromInput);
        return fromInput;
    }

    return localStorage.getItem("groq_api_key") || "";
}

window.addEventListener("DOMContentLoaded", () => {

    const saved = localStorage.getItem("groq_api_key");

    const input = document.getElementById("apiKey");

    if (saved && input) {
        input.value = saved;
    }
});


/* ===== PROMPT ===== */

function buildPrompt(major, interest) {

    return `
Kamu adalah dosen pembimbing skripsi profesional.

Buatkan 3 ide skripsi terbaik.

Data mahasiswa:

Jurusan:
${major}

Minat penelitian:
${interest}

Untuk setiap ide skripsi, berikan:

1. Judul Skripsi
2. Research Gap
3. Metode Penelitian
4. Tools / Teknologi
5. Tingkat Kesulitan

Gunakan bahasa Indonesia yang jelas dan rapi.
Tulis dalam bentuk teks biasa (plain text), tanpa tabel markdown dan tanpa simbol bintang (**).
`;
}


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

    const apiKey = getApiKey();

    if (!apiKey) {
        result.innerHTML = `
            <div class="welcome-box">
                🔑 Masukkan <b>Groq API Key</b> dulu di kolom paling atas.<br>
                Dapatkan gratis di
                <a href="https://console.groq.com/keys" target="_blank" rel="noopener">console.groq.com/keys</a>.
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

        const response = await fetch(GROQ_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + apiKey
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                    {
                        role: "user",
                        content: buildPrompt(major, interest)
                    }
                ]
            })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(
                (data.error && data.error.message) ||
                ("Server error: " + response.status)
            );
        }

        loading.style.display = "none";
        btn.disabled = false;

        const text =
            (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) ||
            "Tidak ada hasil.";

        typeWriter(text, result);

    } catch (error) {

        loading.style.display = "none";
        btn.disabled = false;

        result.innerHTML = `
            <div class="welcome-box">
                ❌ Gagal memuat hasil.<br>
                ${error.message || "Terjadi kesalahan."}
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
