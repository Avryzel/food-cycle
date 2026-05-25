"use client";

import { useState } from "react";
import Link from "next/link";

interface Recipe {
    id: string;
    title: string;
    image: string;
    tags: string[];
    date: string;
}

export default function RecipeDashboardPage() {
    const [activeTab, setActiveTab] = useState<"saved" | "history">("saved");

    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([
        {
            id: "1",
            title: "Sop Bayam Pedas",
            image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=400",
            tags: ["Berkuah", "Pedas"],
            date: "Dibuat: 21 Mei 2026"
        },
        {
            id: "2",
            title: "Tumis Ayam Sayur",
            image: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&q=80&w=400",
            tags: ["Kering", "Sedang"],
            date: "Dibuat: 19 Mei 2026"
        },
        {
            id: "3",
            title: "Omelet Sayur Keju",
            image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400",
            tags: ["Kering", "Tidak Pedas"],
            date: "Dibuat: 10 Mei 2026"
        }
    ]);

    const [historyRecipes, setHistoryRecipes] = useState<Recipe[]>([
        {
            id: "h1",
            title: "Sup Ayam Bayam Gurih",
            image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=400",
            tags: ["Berkuah", "Gurih"],
            date: "Dimasak: 25 Mei 2026"
        }
    ]);

    const removeIdFromSaved = (id: string) => {
        setSavedRecipes(savedRecipes.filter(recipe => recipe.id !== id));
        alert("Resep berhasil dihapus dari daftar koleksi simpanan 🗑️");
    };

    const moveHistoryToSaved = (recipe: Recipe) => {
        const isAlreadySaved = savedRecipes.some(r => r.title === recipe.title);
        if (isAlreadySaved) {
            alert("Resep ini sudah ada di dalam daftar simpanan kamu! 🔖");
            return;
        }

        const newSavedRecipe: Recipe = {
            id: Date.now().toString(),
            title: recipe.title,
            image: recipe.image,
            tags: [...recipe.tags],
            date: `Disimpan: 25 Mei 2026`
        };

        setSavedRecipes([newSavedRecipe, ...savedRecipes]);
        alert("Resep dari riwayat sukses disalin ke tab Disimpan! ❤️");
    };

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in pb-10">

            {/* HEADER HALAMAN */}
            <div className="border-b border-zinc-100 pb-4">
                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">Resep Saya</h1>

                {/* SUB-TAB NAVIGASI */}
                <div className="flex gap-6 mt-4 text-base font-bold">
                    <button
                        type="button"
                        onClick={() => setActiveTab("saved")}
                        className={`pb-2 transition-all relative ${activeTab === "saved"
                                ? "text-zinc-900 border-b-2 border-[#5F8A57]"
                                : "text-zinc-400 hover:text-zinc-600"
                            }`}
                    >
                        Disimpan
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("history")}
                        className={`pb-2 transition-all relative ${activeTab === "history"
                                ? "text-zinc-900 border-b-2 border-[#5F8A57]"
                                : "text-zinc-400 hover:text-zinc-600"
                            }`}
                    >
                        Riwayat
                    </button>
                </div>
            </div>

            {/* LIST KARTU RESEP */}
            <div className="space-y-4">
                {activeTab === "saved" ? (
                    savedRecipes.length > 0 ? (
                        savedRecipes.map((recipe) => (
                            <div
                                key={recipe.id}
                                className="bg-[#EAF5E9]/40 border border-[#8EBA85]/10 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md hover:border-[#8EBA85]/20 transition-all animate-fade-in"
                            >
                                {/* 🚀 SEKARANG AREA INI BISA DIKLIK UNTUK MASUK KE HALAMAN DETAIL PORSI */}
                                <Link
                                    href={`/recipes/${recipe.id}`}
                                    className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto flex-1 cursor-pointer group"
                                >
                                    <div className="w-full sm:w-36 h-24 bg-zinc-100 rounded-2xl overflow-hidden flex-shrink-0 border border-zinc-200/40 group-hover:scale-[1.02] transition-transform">
                                        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover select-none" />
                                    </div>
                                    <div className="text-center sm:text-left space-y-1.5">
                                        <h3 className="text-lg font-black text-zinc-900 tracking-tight group-hover:text-[#5F8A57] transition-colors">
                                            {recipe.title} <span className="text-xs font-normal text-zinc-400 hidden group-hover:inline">➔</span>
                                        </h3>

                                        <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                                            {recipe.tags.map((tag, idx) => (
                                                <span key={idx} className="text-xs font-bold px-2.5 py-1 rounded-lg border bg-white text-zinc-500 border-zinc-200 shadow-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-zinc-400 text-xs font-bold tracking-wide mt-1">{recipe.date}</p>
                                    </div>
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => removeIdFromSaved(recipe.id)}
                                    className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-red-50 text-zinc-400 hover:text-red-500 border border-zinc-200 hover:border-red-200 rounded-2xl shadow-sm text-sm font-bold transition-all flex items-center justify-center gap-2 z-10"
                                >
                                    <span>🗑️</span> Hapus
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-dashed text-sm font-bold text-zinc-400">
                            Belum ada resep yang disimpan 🍳
                        </div>
                    )
                ) : (
                    historyRecipes.length > 0 ? (
                        historyRecipes.map((recipe) => (
                            <div
                                key={recipe.id}
                                className="bg-zinc-50 border border-zinc-200/60 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all animate-fade-in"
                            >
                                {/* 🚀 LINK UNTUK KARTU DI TAB RIWAYAT */}
                                <Link
                                    href={`/recipes/${recipe.id}`}
                                    className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto flex-1 cursor-pointer group"
                                >
                                    <div className="w-full sm:w-36 h-24 bg-zinc-100 rounded-2xl overflow-hidden flex-shrink-0 border border-zinc-200/40 group-hover:scale-[1.02] transition-transform">
                                        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover select-none" />
                                    </div>
                                    <div className="text-center sm:text-left space-y-1.5">
                                        <h3 className="text-lg font-black text-zinc-900 tracking-tight group-hover:text-[#5F8A57] transition-colors">
                                            {recipe.title} <span className="text-xs font-normal text-zinc-400 hidden group-hover:inline">➔</span>
                                        </h3>

                                        <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                                            {recipe.tags.map((tag, idx) => (
                                                <span key={idx} className="text-xs font-bold px-2.5 py-1 rounded-lg border bg-white text-zinc-600 border-zinc-200 shadow-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-zinc-400 text-xs font-bold tracking-wide mt-1">{recipe.date}</p>
                                    </div>
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => moveHistoryToSaved(recipe)}
                                    className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-2xl shadow-sm text-sm font-bold transition-all flex items-center justify-center gap-2 z-10"
                                >
                                    <span>🤍</span> Suka resep ini
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-dashed text-sm font-bold text-zinc-400">
                            Belum ada riwayat memasak harian 🍳
                        </div>
                    )
                )}
            </div>

        </div>
    );
}