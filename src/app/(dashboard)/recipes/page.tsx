"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Recipe {
    id: string;
    title: string;
    content: string;
    portion: number;
    created_at: string;
    image?: string;
    tags?: string[];
    date?: string;
}

interface HistoryItem {
    id: string;
    title: string;
    image: string;
    tags: string[];
    date: string;
    raw_date: string;
}

export default function RecipeDashboardPage() {
    const [activeTab, setActiveTab] = useState<"saved" | "history">("saved");
    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
    const [historyRecipes, setHistoryRecipes] = useState<HistoryItem[]>([]);
    const [loadingSaved, setLoadingSaved] = useState<boolean>(true);
    const [loadingHistory, setLoadingHistory] = useState<boolean>(true);

    const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
        show: false,
        message: "",
        type: "success"
    });

    const triggerToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
    };

    useEffect(() => {
        fetchSavedRecipes();
        fetchHistoryRecipes();
    }, []);

    useEffect(() => {
        if (activeTab === "saved") {
            fetchSavedRecipes();
        } else if (activeTab === "history") {
            fetchHistoryRecipes();
        }
    }, [activeTab]);

    const fetchSavedRecipes = async () => {
        try {
            setLoadingSaved(true);
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) return;

            const { data, error } = await supabase
                .from("saved_recipes")
                .select("id, title, content, portion, created_at")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            if (data) {
                setSavedRecipes(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingSaved(false);
        }
    };

    const fetchHistoryRecipes = async () => {
        try {
            setLoadingHistory(true);
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) return;

            const { data, error } = await supabase
                .from("kitchen_logs")
                .select("id, created_at, recipe_title")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            if (data) {
                const mappedHistory = data.map((item: any) => {
                    const cookDate = new Date(item.created_at);

                    const hours = cookDate.getHours();
                    let timeContext = "Malam";
                    if (hours >= 4 && hours < 11) timeContext = "Pagi";
                    else if (hours >= 11 && hours < 15) timeContext = "Siang";
                    else if (hours >= 15 && hours < 18) timeContext = "Sore";

                    const dateString = cookDate.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    });

                    return {
                        id: item.id,
                        title: item.recipe_title && item.recipe_title.trim() !== ""
                            ? item.recipe_title
                            : `Kreasi Kuliner ${timeContext} Hari`,
                        image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=400",
                        tags: [`Sesi ${timeContext}`, "FoodCycle AI"],
                        date: `Dimasak: ${dateString}`,
                        raw_date: item.created_at
                    };
                });
                setHistoryRecipes(mappedHistory);
            }
        } catch (err: any) {
            console.error("Supabase History Error:", err.message || err);
        } finally {
            setLoadingHistory(false);
        }
    };

    const removeIdFromSaved = async (id: string) => {
        try {
            const { error } = await supabase
                .from("saved_recipes")
                .delete()
                .eq("id", id);

            if (error) throw error;

            setSavedRecipes(savedRecipes.filter(recipe => recipe.id !== id));
            triggerToast("Resep berhasil dihapus dari daftar koleksi simpanan 🗑️", "success");
        } catch (err) {
            console.error(err);
            triggerToast("Terjadi kendala saat menghapus resep.", "error");
        }
    };

    const moveHistoryToSaved = async (recipe: HistoryItem) => {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) return;

            const isAlreadySaved = savedRecipes.some(r => r.title.trim().toLowerCase() === recipe.title.trim().toLowerCase());
            if (isAlreadySaved) {
                triggerToast("Resep dengan nama ini sudah ada di daftar simpanan! 🔖", "error");
                return;
            }

            const { error } = await supabase
                .from("saved_recipes")
                .insert({
                    user_id: user.id,
                    title: recipe.title,
                    content: `# ${recipe.title}\n\nResep hasil olahan terselamatkan melalui riwayat masak harian.`,
                    portion: 1
                });

            if (error) throw error;

            triggerToast("Resep dari riwayat sukses disalin ke tab Disimpan! ❤️", "success");
            fetchSavedRecipes();
        } catch (err) {
            console.error(err);
            triggerToast("Terjadi kendala saat menyalin resep.", "error");
        }
    };

    const handleRemoveFromSavedByTitle = async (title: string) => {
        try {
            const targetRecipe = savedRecipes.find(r => r.title.trim().toLowerCase() === title.trim().toLowerCase());
            if (!targetRecipe) return;

            const { error } = await supabase
                .from("saved_recipes")
                .delete()
                .eq("id", targetRecipe.id);

            if (error) throw error;

            setSavedRecipes(savedRecipes.filter(r => r.id !== targetRecipe.id));
            triggerToast("Resep dilepas dari daftar favorit 🤍", "success");
        } catch (err) {
            console.error(err);
            triggerToast("Terjadi kendala saat mengubah status favorit.", "error");
        }
    };

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in pb-10 relative">

            <div className="border-b border-zinc-100 pb-4">
                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">Resep Saya</h1>

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

            <div className="space-y-4">
                {activeTab === "saved" ? (
                    loadingSaved ? (
                        <div className="text-center py-20 text-sm font-bold text-zinc-400 animate-pulse">
                            Sinkronisasi resep dari cloud Supabase...
                        </div>
                    ) : savedRecipes.length > 0 ? (
                        savedRecipes.map((recipe) => (
                            <div
                                key={recipe.id}
                                className="bg-[#EAF5E9]/40 border border-[#8EBA85]/10 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md hover:border-[#8EBA85]/20 transition-all animate-fade-in"
                            >
                                <Link
                                    href={`/recipes/${recipe.id}`}
                                    className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto flex-1 cursor-pointer group"
                                >
                                    <div className="w-full sm:w-36 h-24 bg-zinc-100 rounded-2xl overflow-hidden flex-shrink-0 border border-zinc-200/40 group-hover:scale-[1.02] transition-transform">
                                        <img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=400" alt={recipe.title} className="w-full h-full object-cover select-none" />
                                    </div>
                                    <div className="text-center sm:text-left space-y-1.5">
                                        <h3 className="text-lg font-black text-zinc-900 tracking-tight group-hover:text-[#5F8A57] transition-colors">
                                            {recipe.title} <span className="text-xs font-normal text-zinc-400 hidden group-hover:inline">➔</span>
                                        </h3>

                                        <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-lg border bg-white text-zinc-500 border-zinc-200 shadow-sm">
                                                🍲 {recipe.portion || 1} Porsi
                                            </span>
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-lg border bg-white text-zinc-500 border-zinc-200 shadow-sm">
                                                🌿 FoodCycle AI
                                            </span>
                                        </div>
                                        <p className="text-zinc-400 text-xs font-bold tracking-wide mt-1">
                                            Dibuat: {new Date(recipe.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                        </p>
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
                    loadingHistory ? (
                        <div className="text-center py-20 text-sm font-bold text-zinc-400 animate-pulse">
                            Sinkronisasi riwayat dari cloud Supabase...
                        </div>
                    ) : historyRecipes.length > 0 ? (
                        historyRecipes.map((historyItem) => {
                            const isAlreadyFavorited = savedRecipes.some(
                                (saved) => saved.title.trim().toLowerCase() === historyItem.title.trim().toLowerCase()
                            );

                            return (
                                <div
                                    key={historyItem.id}
                                    className="bg-zinc-50 border border-zinc-200/60 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all animate-fade-in"
                                >
                                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto flex-1">
                                        <div className="w-full sm:w-36 h-24 bg-zinc-100 rounded-2xl overflow-hidden flex-shrink-0 border border-zinc-200/40">
                                            <img src={historyItem.image} alt={historyItem.title} className="w-full h-full object-cover select-none" />
                                        </div>
                                        <div className="text-center sm:text-left space-y-1.5">
                                            <h3 className="text-lg font-black text-zinc-900 tracking-tight">
                                                {historyItem.title}
                                            </h3>

                                            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                                                {historyItem.tags.map((tag, idx) => (
                                                    <span key={idx} className="text-xs font-bold px-2.5 py-1 rounded-lg border bg-white text-zinc-600 border-zinc-200 shadow-sm">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-zinc-400 text-xs font-bold tracking-wide mt-1">{historyItem.date}</p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            isAlreadyFavorited
                                                ? handleRemoveFromSavedByTitle(historyItem.title)
                                                : moveHistoryToSaved(historyItem)
                                        }
                                        className={`w-full sm:w-auto px-4 py-2.5 border rounded-2xl shadow-sm text-sm font-bold transition-all flex items-center justify-center gap-2 z-10 whitespace-nowrap
                                            ${isAlreadyFavorited
                                                ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100/60"
                                                : "bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200"
                                            }`}
                                    >
                                        {isAlreadyFavorited ? (
                                            <>
                                                <span className="text-red-500">❤️</span> Sudah Favorit (Hapus)
                                            </>
                                        ) : (
                                            <>
                                                <span>🤍</span> Suka resep ini
                                            </>
                                        )}
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-dashed text-sm font-bold text-zinc-400">
                            Belum ada riwayat memasak harian 🍳
                        </div>
                    )
                )}
            </div>

            {toast.show && (
                <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
                    <div className={`px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-black flex items-center gap-3 tracking-tight
                        ${toast.type === "success"
                            ? "bg-[#EAF5E9] text-[#5F8A57] border-[#8EBA85]/30 shadow-[#8EBA85]/10"
                            : "bg-red-50 text-red-600 border-red-200 shadow-red-200/10"
                        }`}
                    >
                        <span>{toast.type === "success" ? "🎉" : "⚠️"}</span>
                        {toast.message}
                    </div>
                </div>
            )}

        </div>
    );
}