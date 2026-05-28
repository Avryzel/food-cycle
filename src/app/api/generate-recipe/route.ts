import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { ingredients, preference } = await request.json();
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "API Key rahasia belum terdaftar di environment server." }, { status: 500 });
        }

        const promptMessage = `Anda adalah sistem AI Koki Profesional dari aplikasi FoodCycle. Fokus utama Anda adalah gerakan Zero Food Waste (SDG 12), yaitu meracik resep hidangan pintar dengan memanfaatkan sisa bahan makanan yang ada di kulkas pengguna secara maksimal.

BAHAN YANG TERSEDIA DI KULKAS USER (BATASAN MUTLAK):
${ingredients.join(", ")}

CATATAN PREFERENSI KHUSUS DARI USER (WAJIB DIPATUHI):
"${preference || 'Tidak ada catatan khusus, buatkan menu terbaik dari bahan yang ada.'}"

ATURAN ARSITEKTUR KONTRAK GENERASI RESEP (BATASAN KETAT):
1. **Dilarang Keras Berhalusinasi / Menambah Bahan Baru:** Anda HANYA BOLEH menggunakan bahan utama yang tertulis pada daftar di atas. Jangan pernah berasumsi menambahkan protein, sayur, atau karbohidrat lain yang tidak diinput oleh user (misalnya: JANGAN menambahkan Ayam, Wortel, Kentang, atau Santan jika tidak tertera di daftar di atas).
2. **Pengecualian Bumbu Dasar:** Anda hanya diizinkan menggunakan bumbu pelengkap standar yang sewajarnya selalu ada di setiap dapur, yaitu: air, minyak goreng, garam, gula, dan merica/lada bubuk. 
3. **Fleksibilitas Jenis Hidangan:** Jangan memaksakan diri membuat hidangan berat yang rumit (seperti kari atau soto) jika bahan yang diinput user sangat minim (misal: hanya susu UHT, atau hanya telur). Putar otak secara kreatif! Jika bahan minim, buatlah olahan alternatif yang logis dan bisa dimakan/diminum, seperti camilan sederhana, minuman kreasi harian, dessert ringkas, kuah bening minimalis, atau telur dadar modifikasi.
4. **Integrasi Catatan User:** Perhatikan baik-baik catatan preferensi dari user di atas. Jika user meminta "pedas", "berkuah", "cocok untuk sarapan", atau "tekstur garing", sesuaikan metode memasak Anda dengan catatan tersebut menggunakan bumbu dasar yang diizinkan.

Ketentuan Format Output:
1. Baris pertama WAJIB langsung berisi Judul Menu Kreatif (Contoh: # Nama Menu). JANGAN ada baris kosong atau kalimat pengantar di atas judul.
2. Tuliskan rincian takaran estimasi komposisi bahan yang realistis.
3. Berikan langkah-langkah pembuatan secara terstruktur, ringkas, dan jelas.
4. Output harus berupa teks Markdown bersih tanpa membungkusnya menggunakan triple backticks (\`\`\`) atau kata "markdown" dan *.`;

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
            generatedRecipe = `# Rekomendasi Menu Kreatif FoodCycle AI 🍲

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