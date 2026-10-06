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
            throw new Error("Server error: " + response.status);
        }

        const data = await response.json();

        loading.style.display = "none";
        btn.disabled = false;

        typeWriter(data.result, result);

    } catch (error) {

        loading.style.display = "none";
        btn.disabled = false;

        result.innerHTML = `
            <div class="welcome-box">
                ❌ Server tidak aktif / error koneksi.<br>
                Pastikan backend Railway sedang berjalan.
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
