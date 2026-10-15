/**
 * Cloudflare Worker - backend Skripsi Topic Finder.
 *
 * API key Groq disimpan sebagai Secret di Cloudflare (env.GROQ_API_KEY),
 * jadi key TIDAK pernah terlihat di halaman publik.
 *
 * Cara deploy: lihat README bagian "Backend Serverless (Cloudflare Worker)".
 */

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b";

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

        try {

            const response = await fetch(GROQ_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + apiKey
                },
                body: JSON.stringify({
                    model: MODEL,
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
                return json({
                    error: (result.error && result.error.message) || ("Groq error: " + response.status)
                }, 502);
            }

            return json({
                result: result.choices[0].message.content
            }, 200);

        } catch (error) {

            return json({ error: "Gagal memanggil Groq: " + error.message }, 502);
        }
    }
};
