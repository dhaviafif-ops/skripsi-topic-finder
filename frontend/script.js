async function generateTopic() {

    const loading =
        document.getElementById("loading");

    const result =
        document.getElementById("result");

    loading.style.display = "block";

    result.innerHTML = "";

    const major =
        document.getElementById("major").value;

    const interest =
        document.getElementById("interest").value;

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

        result.innerHTML = `
            <h2>📘 Hasil AI</h2>
            <pre>${data.result}</pre>
        `;

    } catch (error) {

        result.innerHTML =
            "❌ Terjadi error saat mengambil data AI.";

    }

    loading.style.display = "none";
}

function copyResult() {

    const text =
        document.getElementById("result").innerText;

    navigator.clipboard.writeText(text);

    alert("Hasil berhasil dicopy!");
}