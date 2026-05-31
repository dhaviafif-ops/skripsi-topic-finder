async function generateTopic() {

    const loading =
        document.getElementById("loading");

    const result =
        document.getElementById("result");

    loading.style.display = "block";

    result.innerHTML = "";

    const major =
        document.getElementById("jurusan").value;

    const interest =
        document.getElementById("minat").value;

    try {

        const response = await fetch(
            "https://skripsi-topic-finder-production.up.railway.app/generate",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    major,
                    interest
                })
            }
        );

        const data =
            await response.json();

        result.innerHTML = `
<pre>${data.result}</pre>
`;

    } catch (error) {

        result.innerHTML =
            "❌ Backend Railway error atau API tidak aktif.";

    }

    loading.style.display = "none";
}
function copyResult() {

    const text =
        document.getElementById("result").innerText;

    navigator.clipboard.writeText(text);

    alert("✅ Hasil berhasil disalin!");
}