"use client";

import { useState } from "react";
import Link from "next/link";

interface IngredientBase {
    name: string;
    baseAmount: number; // Nilai dasar untuk kalkulasi matematika linear
    unit: string;
}

export default function RecipeDetailPage() {
    // State pengatur porsi dinamis (Default awal diatur ke 4 porsi sesuai rancangan)
    const [servings, setServings] = useState<number>(4);

    // Acuan porsi dasar dari generator AI (Takaran bumbu di bawah adalah takaran untuk 2 porsi)
    const baseServings = 2;

    // Kumpulan data bumbu berdasarkan visualisasi tabel rancangan tim kalian
    const [ingredients] = useState<IngredientBase[]>([
        { name: "Garam", baseAmount: 1, unit: "sdt" },
        { name: "Gula", baseAmount: 0.5, unit: "sdt" },
        { name: "Merica", baseAmount: 0.25, unit: "sdt" },
        { name: "Minyak", baseAmount: 1, unit: "sdm" },
        { name: "Air", baseAmount: 500, unit: "ml" }
    ]);

    // Logika pengali bumbu otomatis: (Porsi Baru / Porsi Acuan) * Takaran Asli
    const calculateAmount = (baseAmount: number) => {
        const multiplied = (servings / baseServings) * baseAmount;
        // Konversi desimal umum menjadi pecahan cantik agar mudah dibaca ibu-ibu saat masak
        return multiplied % 1 === 0
            ? multiplied
            : multiplied.toFixed(2).replace(".50", " 1/2").replace(".25", " 1/4").replace(".75", " 3/4");
    };

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in pb-10">

            {/* TOMBOL NAVIGASI KEMBALI */}
            <div>
                <Link
                    href="/recipes"
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-zinc-200 rounded-xl text-sm font-bold text-zinc-600 bg-white hover:bg-zinc-50 transition-all shadow-sm"
                >
                    ← Kembali ke Resep Saya
                </Link>
            </div>

            {/* BARIS HEADER INFORMASI MENU */}
            <div className="border-b border-zinc-100 pb-4">
                <span className="bg-[#EAF5E9] text-[#5F8A57] text-xs font-bold px-3 py-1 rounded-lg border border-[#8EBA85]/20">
                    Kalkulator Takaran Bumbu
                </span>
                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight mt-2">Sup Bayam Pedas</h1>
                <p className="text-zinc-400 text-sm font-semibold mt-1">Dekomposisi porsi masakan secara otomatis dan presisi</p>
            </div>

            {/* KARTU KONTROL PENGATUR PORSI (INTERAKTIF) */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-zinc-800">Atur Jumlah Porsi Target:</h3>
                <div className="flex items-center justify-between border border-[#8EBA85]/20 rounded-2xl p-2 bg-zinc-50/50">
                    <button
                        type="button"
                        onClick={() => servings > 1 && setServings(servings - 1)}
                        className="w-12 h-12 bg-[#CCDEC7] hover:bg-[#b9d3b3] text-[#5F8A57] font-black text-2xl rounded-xl flex items-center justify-center transition-all shadow-sm select-none active:scale-95"
                    >
                        -
                    </button>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-zinc-900 tracking-tight">{servings}</span>
                        <span className="text-zinc-400 text-sm font-bold">Porsi</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setServings(servings + 1)}
                        className="w-12 h-12 bg-[#CCDEC7] hover:bg-[#b9d3b3] text-[#5F8A57] font-black text-2xl rounded-xl flex items-center justify-center transition-all shadow-sm select-none active:scale-95"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* TABEL RESPONSIVITAS STRUKTUR BUMBU */}
            <div className="bg-white border border-zinc-100 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                    <h3 className="font-black text-zinc-900 tracking-tight">Kebutuhan Logistik Bumbu</h3>
                    <span className="text-[10px] sm:text-xs font-bold text-zinc-400 bg-white px-2.5 py-1 rounded-lg border border-zinc-200 uppercase tracking-wider">
                        Auto Scale
                    </span>
                </div>

                <div className="divide-y divide-zinc-100">
                    {/* Baris Judul Kolom */}
                    <div className="grid grid-cols-3 px-5 py-3 text-[11px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider bg-zinc-50/20">
                        <div>Komponen</div>
                        <div className="text-center">Acuan Dasar ({baseServings} P)</div>
                        <div className="text-right text-[#5F8A57]">Target Masak ({servings} P)</div>
                    </div>

                    {/* Render Baris Bumbu Menggunakan Perhitungan Aljabar Real-time */}
                    {ingredients.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-3 px-5 py-4 text-sm font-bold text-zinc-700 items-center hover:bg-zinc-50/30 transition-colors">
                            <div className="text-zinc-900 tracking-tight">{item.name}</div>
                            <div className="text-center text-zinc-400 font-semibold text-xs sm:text-sm">
                                {item.baseAmount === 0.5 ? "1/2" : item.baseAmount === 0.25 ? "1/4" : item.baseAmount} {item.unit}
                            </div>
                            <div className="text-right text-zinc-900 font-black tracking-wide text-xs sm:text-sm">
                                {calculateAmount(item.baseAmount)} {item.unit}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* PANEL TOMBOL JALUR AKSI AKHIR */}
            <div className="pt-2">
                <button
                    type="button"
                    onClick={() => alert(`Instruksi Memasak Terbuka! Selamat mengeksekusi menu Sup Bayam Pedas untuk ${servings} porsi. 🍳`)}
                    className="w-full bg-[#8EBA85] hover:bg-[#7da874] text-white font-black py-4 rounded-2xl shadow-md shadow-[#8EBA85]/10 active:scale-[0.99] text-base transition-all flex items-center justify-center gap-2"
                >
                    Mulai Masak Sekarang ➔
                </button>
            </div>

        </div>
    );
}