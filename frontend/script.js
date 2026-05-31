async function generateTopic() {

    const result =
        document.getElementById("result");

    const loading =
        document.getElementById("loading");

    const major =
        document.getElementById("jurusan").value;

    const interest =
        document.getElementById("minat").value;

    if (!major || !interest) {

        alert("Isi jurusan dan minat penelitian terlebih dahulu.");

        return;
    }

    loading.style.display = "block";

    result.innerHTML = `
        <div class="welcome-card">
            🤖 AI sedang menganalisis data...
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

        const data =
            await response.json();

        loading.style.display = "none";

        typeWriter(
            data.result,
            result
        );

    } catch (error) {

        loading.style.display = "none";

        result.innerHTML = `
            <div class="welcome-card">
                ❌ Backend Railway tidak aktif.
            </div>
        `;
    }
}

function typeWriter(text, element) {

    element.innerHTML = `
        <div class="ai-message">
            <div id="typing"></div>
        </div>
    `;

    const target =
        document.getElementById("typing");

    let i = 0;

    const speed = 15;

    function typing() {

        if (i < text.length) {

            target.innerHTML +=
                text.charAt(i);

            i++;

            setTimeout(
                typing,
                speed
            );
        }
    }

    typing();
}