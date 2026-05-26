async function generateTopic() {

    const result = document.getElementById("result");

    result.innerHTML = "⏳ Loading AI...";

    const major = document.getElementById("jurusan").value;
    const interest = document.getElementById("minat").value;

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
            <pre>${data.result}</pre>
        `;

    } catch (error) {

        console.error(error);

        result.innerHTML =
            "❌ Backend Railway error / API tidak aktif.";

    }
}