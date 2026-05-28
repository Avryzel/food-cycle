"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface RecipeData {
    id: string;
    title: string;
    content: string;
    portion: number;
    created_at: string;
}

interface IngredientLine {
    name: string;
    amountStr: string;
}

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();

    const unwrappedParams = use(params);
    const recipeId = unwrappedParams.id;

    const [recipe, setRecipe] = useState<RecipeData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [servings, setServings] = useState<number>(1);
    const [baseServings, setBaseServings] = useState<number>(1);

    useEffect(() => {
        if (recipeId) {
            fetchRecipeDetail();
        }
    }, [recipeId]);

    const fetchRecipeDetail = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("saved_recipes")
                .select("id, title, content, portion, created_at")
                .eq("id", recipeId)
                .single();

            if (error) throw error;
            if (data) {
                setRecipe(data);
                setServings(data.portion || 1);
                setBaseServings(data.portion || 1);
            }
        } catch (err) {
            console.error("Gagal memuat detail resep:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatValue = (value: number): string => {
        if (value === 0.5) return "1/2";
        if (value === 0.25) return "1/4";
        if (value === 0.75) return "3/4";
        return value % 1 === 0 ? value.toString() : value.toFixed(1);
    };

    const adjustQuantities = (text: string, currentServings: number, originalServings: number): string => {
        if (!text) return "";
        if (currentServings === originalServings) return text;

        const multiplier = currentServings / originalServings;

        return text.split("\n").map(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
                return line.replace(/(\d+(\.\d+)?)/g, (match) => {
                    const parsed = parseFloat(match);
                    if (isNaN(parsed)) return match;
                    const computed = parsed * multiplier;
                    return formatValue(computed);
                });
            }
            return line;
        }).join("\n");
    };

    const parseIngredientsForTable = (content: string | undefined): IngredientLine[] => {
        if (!content) return [];
        const lines = content.split("\n");
        const listLines = lines.filter(line => line.trim().startsWith("-") || line.trim().startsWith("*"));

        return listLines.slice(0, 6).map(line => {
            const cleanLine = line.replace(/^[-\*\s]+/, "").trim();
            const parts = cleanLine.split(":");
            if (parts.length >= 2) {
                return { name: parts[0].trim(), amountStr: parts.slice(1).join(":").trim() };
            }
            return { name: cleanLine, amountStr: "Secukupnya" };
        });
    };

    const handleCookAgain = () => {
        sessionStorage.setItem("foodcycle_cook_step", "1");
        router.push("/cook");
    };

    if (loading) {
        return <div className="p-8 text-zinc-400 font-semibold animate-pulse">Memuat Detail Resep FoodCycle...</div>;
    }

    if (!recipe) {
        return (
            <div className="p-8 text-center space-y-4">
                <p className="text-zinc-500 font-bold">Resep tidak ditemukan atau telah dihapus.</p>
                <Link href="/recipes" className="text-[#5F8A57] font-bold underline">Kembali ke Koleksi</Link>
            </div>
        );
    }

    const ingredientManifest = parseIngredientsForTable(recipe.content);

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in pb-10">
            <div>
                <Link
                    href="/recipes"
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-zinc-200 rounded-xl text-sm font-bold text-zinc-600 bg-white hover:bg-zinc-50 transition-all shadow-sm"
                >
                    ← Kembali ke Resep Saya
                </Link>
            </div>

            <div className="border-b border-zinc-100 pb-4">
                <span className="bg-[#EAF5E9] text-[#5F8A57] text-xs font-bold px-3 py-1 rounded-lg border border-[#8EBA85]/20">
                    Kalkulator Takaran Otomatis
                </span>
                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight mt-2">{recipe.title}</h1>
                <p className="text-zinc-400 text-sm font-semibold mt-1">Dekomposisi porsi masakan secara otomatis dan presisi</p>
            </div>

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

            <div className="bg-white border border-zinc-100 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                    <h3 className="font-black text-zinc-900 tracking-tight">Kebutuhan Logistik Bahan Utama & Bumbu</h3>
                    <span className="text-[10px] sm:text-xs font-bold text-zinc-400 bg-white px-2.5 py-1 rounded-lg border border-zinc-200 uppercase tracking-wider">
                        Auto Scale
                    </span>
                </div>

                <div className="divide-y divide-zinc-100">
                    <div className="grid grid-cols-2 px-5 py-3 text-[11px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider bg-zinc-50/20">
                        <div>Komponen Komoditas</div>
                        <div className="text-right text-[#5F8A57]">Target Takaran ({servings} P)</div>
                    </div>

                    {ingredientManifest.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-2 px-5 py-4 text-sm font-bold text-zinc-700 items-center hover:bg-zinc-50/30 transition-colors">
                            <div className="text-zinc-900 tracking-tight">🍳 {item.name}</div>
                            <div className="text-right text-zinc-900 font-black tracking-wide text-xs sm:text-sm">
                                {adjustQuantities(item.amountStr, servings, baseServings)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-black text-zinc-900 tracking-tight border-b pb-3">📑 Panduan Olahan Kuliner</h3>
                <div className="text-zinc-600 text-sm font-medium leading-relaxed whitespace-pre-line font-sans">
                    {adjustQuantities(recipe.content, servings, baseServings)}
                </div>
            </div>

            <div className="pt-2">
                <button
                    type="button"
                    onClick={handleCookAgain}
                    className="w-full bg-[#8EBA85] hover:bg-[#7da874] text-white font-black py-4 rounded-2xl shadow-md shadow-[#8EBA85]/10 active:scale-[0.99] text-base transition-all flex items-center justify-center gap-2"
                >
                    Masak Ulang Menu Ini ➔
                </button>
            </div>
        </div>
    );
}