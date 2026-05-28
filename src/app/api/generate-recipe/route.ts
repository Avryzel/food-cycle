import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { ingredients, preference } = await request.json();
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "API Key rahasia belum terdaftar di environment server." }, { status: 500 });
        }

        const promptMessage = `Kamu adalah seorang Chef Profesional Indonesia yang berfokus pada efisiensi bahan pangan untuk menekan angka food waste (SDG 12).
        
Rancanglah sebuah resep makanan kreatif berbasis kuliner Nusantara yang WAJIB memanfaatkan bahan-bahan utama ini: ${ingredients.join(", ")}.
Preferensi tambahan dari pengguna: "${preference || 'Rasa gurih standar'}".

BATASAN KETAT BAHAN:
HANYA gunakan bahan-bahan utama yang disediakan oleh pengguna di atas. Jangan menambahkan komponen bahan atau bumbu baru yang rumit di luar daftar tersebut. Anda hanya diizinkan menambahkan bumbu dasar mutlak yang sewajarnya pasti ada di setiap dapur, seperti air, minyak goreng, garam, dan gula untuk merakit resepnya.

Ketentuan Output:
1. Berikan Nama Menu Kreatif di baris pertama.
2. Tuliskan rincian takaran estimasi komposisi bahan.
3. Berikan langkah-langkah pembuatan secara terstruktur, ringkas, dan jelas.
4. Output harus berupa teks Markdown bersih tanpa membungkusnya menggunakan triple backticks (\`\`\`) atau kata "markdown".`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "FoodCycle MVP",
            },
            body: JSON.stringify({
                model: "google/gemini-2.5-flash",
                messages: [{ role: "user", content: promptMessage }],
                max_tokens: 2000
            })
        });

        const data = await response.json();

        let generatedRecipe =
            data.choices?.[0]?.message?.content ||
            data.choices?.[0]?.text ||
            (data.choices?.[0]?.message ? data.choices[0].message : null);

        if (typeof generatedRecipe === 'object' && generatedRecipe !== null) {
            generatedRecipe = JSON.stringify(generatedRecipe);
        }

        if (!generatedRecipe || generatedRecipe.trim() === "") {
            generatedRecipe = `### Hasil Olahan Resep FoodCycle AI 🍲

Rekomendasi Menu Kreatif: Tumis Nusantara Hemat Pangan

Komposisi Racikan Kulkas:
${ingredients.map((name: string) => `- ${name}`).join("\n")}

Langkah Memasak Terstruktur:
1. Bersihkan seluruh bahan utama yang telah Anda kumpulkan dari kulkas: ${ingredients.join(", ")}.
2. Iris tipis bumbu dasar, lalu sesuaikan cita rasa dengan preferensi tambahan Anda: "${preference || 'Rasa gurih standar'}".
3. Panaskan sedikit minyak goreng di atas wajan, tumis bumbu hingga aroma wangi keluar.
4. Masukkan komponen bahan secara bertahap, aduk merata hingga matang sempurna.
5. Koreksi rasa, angkat, dan hidangan siap disajikan hangat untuk meminimalisir potensi food waste kelompok!`;
        }

        return NextResponse.json({ recipe: generatedRecipe });
    } catch (error) {
        console.error("OpenRouter API Integration Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}