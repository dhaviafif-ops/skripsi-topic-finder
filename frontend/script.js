async function generateTopic() {

    const result = document.getElementById("result");
    const loading = document.getElementById("loading");

    const major = document.getElementById("jurusan").value.trim();
    const interest = document.getElementById("minat").value.trim();

    if (!major || !interest) {

        result.innerHTML = `
            <div class="welcome-card">
                <h2>⚠️ Input Belum Lengkap</h2>
                <p>
                    Silakan isi jurusan dan minat penelitian terlebih dahulu.
                </p>
            </div>
        `;

        return;
    }

    loading.style.display = "block";

    result.innerHTML = `
        <div class="welcome-card">
            <h2>🤖 AI Sedang Berpikir...</h2>
            <p>
                Menganalisis jurusan <b>${major}</b> dan minat penelitian
                <b>${interest}</b>.
                Mohon tunggu sebentar...
            </p>
        </div>
    `;

    try {

        const response = await fetch(
            "https://skripsi-topic-finder-production.up.railway.app/generate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    major: major,
                    interest: interest
                })
            }
        );

        if (!response.ok) {
            throw new Error("Server Error");
        }

        const data = await response.json();

        loading.style.display = "none";

        result.innerHTML = `
            <div class="ai-message">
                <div class="message-header">
                    ✨ Hasil Rekomendasi AI
                </div>

                <div class="message-content">
                    ${formatResult(data.result)}
                </div>
            </div>
        `;

    } catch (error) {

        console.error(error);

        loading.style.display = "none";

        result.innerHTML = `
            <div class="welcome-card">
                <h2>❌ Terjadi Kesalahan</h2>
                <p>
                    Backend Railway tidak aktif atau terjadi masalah koneksi.
                </p>
            </div>
        `;
    }
}

/* ==========================================
   FORMAT HASIL AGAR LEBIH RAPI
========================================== */

function formatResult(text) {

    return text
        .replace(/\n/g, "<br>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}