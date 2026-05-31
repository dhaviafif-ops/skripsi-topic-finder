async function generateTopic() {

    const result = document.getElementById("result");
    const loading = document.getElementById("loading");
    const button = document.querySelector("button");

    const major = document.getElementById("jurusan").value.trim();
    const interest = document.getElementById("minat").value.trim();

    if (!major || !interest) {
        result.innerHTML = `
            <div class="error">
                ⚠️ Silakan isi Jurusan dan Minat Penelitian terlebih dahulu.
            </div>
        `;
        return;
    }

    loading.style.display = "block";
    button.disabled = true;
    button.innerHTML = "⏳ Generating...";

    result.innerHTML = "";

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

        result.innerHTML = `
            <div class="ai-result">
                <pre>${data.result}</pre>
            </div>
        `;

    } catch (error) {

        console.error(error);

        result.innerHTML = `
            <div class="error">
                ❌ Backend Railway sedang offline atau terjadi kesalahan koneksi.
            </div>
        `;

    } finally {

        loading.style.display = "none";

        button.disabled = false;
        button.innerHTML = "🚀 Generate Topic";
    }
}