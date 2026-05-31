async function generateTopic() {

    const result = document.getElementById("result");
    const loading = document.getElementById("loading");

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

    // show loading
    loading.style.display = "block";

    result.innerHTML = `
        <div class="welcome-box">
            🤖 AI sedang menganalisis topik...
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

        const data = await response.json();

        loading.style.display = "none";

        // typing effect result
        typeWriter(data.result, result);

    } catch (error) {

        loading.style.display = "none";

        result.innerHTML = `
            <div class="welcome-box">
                ❌ Server Railway tidak aktif / error koneksi
            </div>
        `;
    }
}


/* =========================
   TYPEWRITER EFFECT (CHATGPT STYLE)
========================= */

function typeWriter(text, element) {

    element.innerHTML = `<div class="typing-box"></div>`;

    const target = element.querySelector(".typing-box");

    let i = 0;
    const speed = 12;

    function typing() {

        if (i < text.length) {

            target.innerHTML += text.charAt(i);

            i++;

            setTimeout(typing, speed);
        }
    }

    typing();
}