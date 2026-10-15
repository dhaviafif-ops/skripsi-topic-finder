/**
 * Cloudflare Worker - backend Skripsi Topic Finder.
 *
 * API key Groq disimpan sebagai Secret di Cloudflare (env.GROQ_API_KEY),
 * jadi key TIDAK pernah terlihat di halaman publik.
 *
 * Kalau model pertama tidak tersedia di Groq, otomatis dicoba model berikutnya.
 *
 * Deploy: npx wrangler deploy
 */

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Daftar model, dicoba berurutan sampai ada yang berhasil.
const MODELS = [
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3.8-27b",
    "allam-2-7b"
];

const CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
};

function json(body, status) {
    return new Response(JSON.stringify(body), {
        status: status,
        headers: Object.assign({ "Content-Type": "application/json" }, CORS)
    });
}

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

export default {
    async fetch(request, env) {

        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: CORS });
        }

        if (request.method !== "POST") {
            return json({ error: "Gunakan metode POST." }, 405);
        }

        let data = {};
        try {
            data = await request.json();
        } catch (e) {
            data = {};
        }

        const major = (data.major || "").trim();
        const interest = (data.interest || "").trim();

        if (!major || !interest) {
            return json({ error: "Jurusan dan minat penelitian wajib diisi." }, 400);
        }

        const apiKey = env.GROQ_API_KEY;

        if (!apiKey) {
            return json({ error: "GROQ_API_KEY belum di-set di server." }, 500);
        }

        let lastError = "Semua model tidak tersedia.";

        for (const model of MODELS) {

            try {

                const response = await fetch(GROQ_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + apiKey
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            {
                                role: "user",
                                content: buildPrompt(major, interest)
                            }
                        ]
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    lastError = (result.error && result.error.message) || ("Groq error: " + response.status);
                    continue;
                }

                return json({
                    result: result.choices[0].message.content,
                    model: model
                }, 200);

            } catch (error) {

                lastError = "Gagal memanggil Groq: " + error.message;
            }
        }

        return json({ error: lastError }, 502);
    }
};
