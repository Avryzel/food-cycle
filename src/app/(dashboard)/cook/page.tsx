"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { masterIngredientsDatabase } from "@/lib/constants";

interface PantryItem {
    id: string;
    variant_id: number;
    quantity: number;
    unit: string;
    expiry_date: string;
    status: string;
    name: string;
    expiry: string;
    icon: string;
    time: string;
    category: string;
}

const IMMUTABLE_STAPLES = ["garam", "gula", "air", "minyak goreng", "merica", "lada", "penyedap"];

export default function CookPage() {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [isClient, setIsClient] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    const [dbIngredients, setDbIngredients] = useState<PantryItem[]>([]);
    const [loadingDb, setLoadingDb] = useState(true);

    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const [preferenceText, setPreferenceText] = useState("");

    const [aiRecipe, setAiRecipe] = useState<string | null>(null);
    const [recipeTitle, setRecipeTitle] = useState<string>("Kreasi Kuliner Sisa Kulkas");
    const [isGenerating, setIsGenerating] = useState(false);
    const [portion, setPortion] = useState<number>(1);
    const [isSaved, setIsSaved] = useState<boolean>(false);

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
        setIsClient(true);

        const savedStep = sessionStorage.getItem("foodcycle_cook_step");
        if (savedStep) {
            setCurrentStep(parseInt(savedStep, 10));
        }

        const savedIngredients = sessionStorage.getItem("foodcycle_selected_ingredients");
        if (savedIngredients) {
            setSelectedIngredients(JSON.parse(savedIngredients));
        }

        fetchPantryData();
    }, []);

    const fetchPantryData = async () => {
        try {
            setLoadingDb(true);
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) return;

            const { data, error } = await supabase
                .from("user_pantry")
                .select("id, variant_id, quantity, unit, expiry_date")
                .eq("user_id", user.id)
                .order("expiry_date", { ascending: true });

            if (data) {
                const mappedData = data.map((item) => {
                    const expiry = new Date(item.expiry_date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const timeDiff = expiry.getTime() - today.getTime();
                    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

                    let currentStatus = "Aman";
                    let timeLabel = `${daysLeft} hari lagi`;
                    if (daysLeft <= 0) {
                        currentStatus = "Expired";
                        timeLabel = "Hari ini";
                    } else if (daysLeft <= 3) {
                        currentStatus = "Hampir Expired";
                        timeLabel = daysLeft === 1 ? "Esok hari" : `${daysLeft} hari lagi`;
                    }

                    let cleanName = `Bahan (#${item.variant_id})`;
                    let categoryLabel = "Sayuran";
                    let iconDisplay = "📦";

                    const unitStr = item.unit || "";

                    if (unitStr && unitStr.includes("(") && unitStr.includes(")")) {
                        const bumbuName = unitStr.substring(unitStr.indexOf("(") + 1, unitStr.indexOf(")"));
                        cleanName = bumbuName.trim().charAt(0).toUpperCase() + bumbuName.trim().slice(1);
                        categoryLabel = "Bumbu";
                        iconDisplay = "Bars";
                    } else {
                        const matchedIngredient = masterIngredientsDatabase.find((ing) =>
                            ing.variants.some((v) => parseInt(v.id, 10) === item.variant_id)
                        );
                        if (matchedIngredient) {
                            cleanName = matchedIngredient.name;
                        }
                    }

                    const nameLower = cleanName.toLowerCase();

                    if (nameLower.includes("bayam") || nameLower.includes("kangkung") || nameLower.includes("sawi") || nameLower.includes("daun")) {
                        categoryLabel = "Sayuran";
                        iconDisplay = "🥬";
                    }
                    else if (nameLower.includes("daging ayam") || nameLower.includes("paha") || nameLower.includes("dada") || nameLower.includes("sayap") || (nameLower.includes("ayam") && !nameLower.includes("bayam"))) {
                        categoryLabel = "Protein";
                        iconDisplay = "🍗";
                    }
                    else if (nameLower.includes("bawang merah")) {
                        categoryLabel = "Bumbu";
                        iconDisplay = "🧅";
                    } else if (nameLower.includes("bawang putih")) {
                        categoryLabel = "Bumbu";
                        iconDisplay = "🧄";
                    } else if (nameLower.includes("cabai") || nameLower.includes("cabe")) {
                        categoryLabel = "Bumbu";
                        iconDisplay = "🌶️";
                    } else if (nameLower.includes("garam") || nameLower.includes("gula") || nameLower.includes("merica") || nameLower.includes("penyedap")) {
                        categoryLabel = "Bumbu";
                        iconDisplay = "🧂";
                    } else if (nameLower.includes("daging") || nameLower.includes("sapi") || nameLower.includes("kambing")) {
                        categoryLabel = "Protein";
                        iconDisplay = "🥩";
                    } else if (nameLower.includes("telur")) {
                        categoryLabel = "Protein";
                        iconDisplay = "🍳";
                    } else if (nameLower.includes("tahu") || nameLower.includes("tempe")) {
                        categoryLabel = "Protein";
                        iconDisplay = "🍞";
                    } else if (nameLower.includes("susu") || nameLower.includes("uht") || nameLower.includes("keju") || nameLower.includes("yoghurt")) {
                        categoryLabel = "Dairy";
                        iconDisplay = nameLower.includes("keju") ? "🧀" : "🥛";
                    } else if (nameLower.includes("wortel")) {
                        categoryLabel = "Sayuran";
                        iconDisplay = "🥕";
                    } else if (nameLower.includes("tomat")) {
                        categoryLabel = "Sayuran";
                        iconDisplay = "🍅";
                    } else if (nameLower.includes("jagung")) {
                        categoryLabel = "Sayuran";
                        iconDisplay = "🌽";
                    } else if (nameLower.includes("jamur")) {
                        categoryLabel = "Sayuran";
                        iconDisplay = "🍄";
                    } else if (nameLower.includes("beras") || nameLower.includes("nasi") || nameLower.includes("mie")) {
                        categoryLabel = "Lainnya";
                        iconDisplay = nameLower.includes("beras") ? "🌾" : "🍜";
                    } else {
                        iconDisplay = "🥦";
                    }

                    return {
                        id: item.id,
                        variant_id: item.variant_id,
                        quantity: item.quantity,
                        unit: unitStr.includes("(") ? unitStr.substring(0, unitStr.indexOf("(")).trim() : unitStr,
                        expiry_date: item.expiry_date,
                        expiry: expiry.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
                        status: currentStatus,
                        name: cleanName,
                        category: categoryLabel,
                        icon: iconDisplay,
                        time: timeLabel
                    };
                });
                setDbIngredients(mappedData);
            }
        } catch (err) {
            console.error("Gagal sinkronisasi komponen dapur:", err);
        } finally {
            setLoadingDb(false);
        }
    };

    useEffect(() => {
        if (isClient) {
            sessionStorage.setItem("foodcycle_cook_step", currentStep.toString());
        }
    }, [currentStep, isClient]);

    useEffect(() => {
        if (isClient) {
            sessionStorage.setItem("foodcycle_selected_ingredients", JSON.stringify(selectedIngredients));
        }
    }, [selectedIngredients, isClient]);

    const lockedIngredients = dbIngredients.filter(
        (item) => item.status === "Expired" || item.status === "Hampir Expired"
    );

    const availableIngredients = dbIngredients.filter((item) => item.status === "Aman");
    const categories = ["Semua Kategori", "Sayuran", "Protein", "Bumbu", "Dairy"];

    const filteredIngredients = availableIngredients.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "Semua Kategori" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleGenerateRecipe = async () => {
        const totalIngredients = [
            ...lockedIngredients.map(i => i.name),
            ...selectedIngredients
        ];

        if (totalIngredients.length === 0) {
            triggerToast("Pilih minimal satu bahan makanan untuk mulai memasak!", "error");
            return;
        }

        setIsGenerating(true);
        setIsSaved(false);
        setCurrentStep(4);

        try {
            const response = await fetch("/api/generate-recipe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ingredients: totalIngredients,
                    preference: preferenceText
                })
            });

            if (!response.ok) throw new Error("Gagal memuat resep dari server");
            const data = await response.json();

            if (data.recipe) {
                setAiRecipe(data.recipe);
                setRecipeTitle(data.title || "Rekomendasi Menu Kreatif");
            } else {
                throw new Error("Format respons bermasalah");
            }
        } catch (error) {
            console.error("Error meracik resep AI:", error);
            triggerToast("Terjadi kendala jaringan saat meracik resep digital.", "error");
            setCurrentStep(3);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveRecipeToLocal = async () => {
        if (!aiRecipe || isSaved) return;
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                triggerToast("Sesi Anda berakhir. Silakan login kembali.", "error");
                return;
            }

            const { error } = await supabase
                .from("saved_recipes")
                .insert({
                    user_id: user.id,
                    title: recipeTitle,
                    content: aiRecipe,
                    portion: portion
                });

            if (error) throw error;

            setIsSaved(true);
            triggerToast("Resep sukses diamankan ke cloud Supabase! 🔖", "success");
        } catch (err) {
            console.error("Gagal mengamankan resep ke database:", err);
            triggerToast("Sistem gagal mengamankan resep.", "error");
        }
    };

    const handleCompleteCooking = async () => {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) return;

            const rawIngredientsToClear = [
                ...lockedIngredients,
                ...dbIngredients.filter(i => selectedIngredients.includes(i.name))
            ];

            const verifiedIngredientsToClear = rawIngredientsToClear.filter(item => {
                return !IMMUTABLE_STAPLES.includes(item.name.toLowerCase());
            });

            const usedIngredientIds = verifiedIngredientsToClear.map(i => i.id);

            const { error: logError } = await supabase
                .from("kitchen_logs")
                .insert({
                    user_id: user.id,
                    action_type: "COOKING",
                    recipe_title: recipeTitle,
                    calculated_weight_kg: 0.25
                });

            if (logError) throw logError;

            if (usedIngredientIds.length > 0) {
                const { error } = await supabase
                    .from("user_pantry")
                    .delete()
                    .in("id", usedIngredientIds);

                if (error) throw error;
            }

            triggerToast("Sukses! Menu tercatat di Riwayat & Persediaan Bahan Kulkas Telah Diperbarui! 🎉", "success");

            setTimeout(() => {
                sessionStorage.removeItem("foodcycle_cook_step");
                sessionStorage.removeItem("foodcycle_selected_ingredients");
                setAiRecipe(null);
                setRecipeTitle("Kreasi Kuliner Sisa Kulkas");
                setSelectedIngredients([]);
                setPreferenceText("");
                setPortion(1);
                setCurrentStep(1);
                fetchPantryData();
            }, 1800);
        } catch (err) {
            console.error("Gagal memproses konsumsi stok pangan:", err);
            triggerToast("Sistem gagal memproses riwayat memasak.", "error");
        }
    };

    if (!isClient) {
        return <div className="p-8 text-zinc-400 font-semibold animate-pulse">Memuat Dapur FoodCycle...</div>;
    }

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in pb-32 sm:pb-10 relative">

            <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">Masak</h1>
                    <p className="text-zinc-500 text-sm font-semibold mt-1">
                        {currentStep === 1 && "Prioritas Otomatis oleh FoodCycle AI"}
                        {currentStep === 2 && "Pilih Bahan Pendamping"}
                        {currentStep === 3 && "Resep AI Untukmu"}
                        {currentStep === 4 && "Hasil Olahan Resep FoodCycle AI"}
                    </p>
                </div>
                <div className="text-sm font-bold text-[#8EBA85] bg-[#EAF5E9] px-4 py-2 rounded-xl flex-shrink-0">
                    {currentStep} / 4
                </div>
            </div>

            {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-[#EAF5E9]/60 border border-[#8EBA85]/20 rounded-3xl p-5 flex items-center justify-between shadow-sm">
                        <p className="text-zinc-600 text-sm font-medium max-w-xl leading-relaxed">
                            AI telah memilih bahan yang harus diolah terlebih dahulu berdasarkan tanggal kadaluarsa paling mepet untuk menekan angka food waste.
                        </p>
                        <span className="text-3xl bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm select-none">🥦</span>
                    </div>

                    <div className="space-y-3.5">
                        {loadingDb ? (
                            <div className="p-10 text-center text-sm font-bold text-zinc-400 animate-pulse">Menganalisis masa simpan persediaan...</div>
                        ) : lockedIngredients.length === 0 ? (
                            <div className="bg-white border border-dashed border-zinc-200 rounded-3xl p-10 text-center text-zinc-400 font-bold text-sm">
                                🎉 Stok aman! Tidak ada komoditas kritis atau hampir kadaluarsa dalam kulkasmu hari ini.
                            </div>
                        ) : (
                            lockedIngredients.map((item, idx) => (
                                <div key={idx} className="bg-white border border-zinc-100 rounded-3xl p-5 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-zinc-50 rounded-xl border flex items-center justify-center text-xl">{item.icon}</div>
                                        <div>
                                            <h3 className="font-bold text-zinc-900">{item.name}</h3>
                                            <p className="text-zinc-400 text-xs font-semibold">{item.category} ({item.quantity} {item.unit})</p>
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold text-zinc-500 hidden sm:block">{item.expiry}</div>
                                    <div className="flex items-center gap-3">
                                        <span className="bg-red-50 text-red-600 border border-red-100 text-xs font-bold px-3 py-1.5 rounded-xl">{item.time}</span>
                                        <span className="text-zinc-400 bg-zinc-50 border p-2 rounded-xl">🔒</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {currentStep === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in relative">
                    <div className="lg:col-span-8 space-y-4">
                        <div className="flex gap-3 relative z-30">
                            <div className="relative flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                    className="h-full px-4 bg-white border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 flex items-center gap-2 transition-all"
                                >
                                    <span className="lg:inline hidden">{selectedCategory}</span>
                                    <span className="text-xs text-zinc-400">▼</span>
                                </button>

                                {isCategoryOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsCategoryOpen(false)} />
                                        <div className="absolute left-0 mt-2 w-48 bg-white border border-zinc-200 rounded-2xl shadow-xl py-2 z-50 animate-fade-in divide-y divide-zinc-50">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedCategory(cat);
                                                        setIsCategoryOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${selectedCategory === cat
                                                        ? "bg-[#EAF5E9] text-[#5F8A57]"
                                                        : "text-zinc-600 hover:bg-zinc-50 bg-white"
                                                        }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            <input
                                type="text"
                                placeholder="Cari Bahan Pendamping..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 px-5 py-3.5 bg-white border border-zinc-200 rounded-2xl text-sm font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#8EBA85]/20 focus:border-[#8EBA85] shadow-sm transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1 pb-10 sm:pb-0">
                            {loadingDb ? (
                                <div className="col-span-2 p-10 text-center text-sm font-bold text-zinc-400">Memuat opsi pendamping...</div>
                            ) : filteredIngredients.length === 0 ? (
                                <div className="col-span-2 p-10 text-center text-sm font-bold text-zinc-400">Tidak ada bahan pendamping yang cocok.</div>
                            ) : (
                                filteredIngredients.map((item, idx) => {
                                    const isSelected = selectedIngredients.includes(item.name);
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => {
                                                if (isSelected) setSelectedIngredients(selectedIngredients.filter(i => i !== item.name))
                                                else setSelectedIngredients([...selectedIngredients, item.name])
                                            }}
                                            className={`p-4 rounded-2xl text-sm font-bold border transition-all text-center shadow-sm flex flex-col items-center justify-center gap-2.5 ${isSelected
                                                ? "bg-[#CCDEC7] border-[#8EBA85] text-[#5F8A57]"
                                                : "bg-white border-zinc-100 text-zinc-700 hover:border-zinc-200"
                                                }`}
                                        >
                                            <span className="text-3xl select-none">{item.icon}</span>
                                            <span className="tracking-wide">{item.name}</span>
                                            <span className="text-zinc-400 text-xs font-semibold">{item.quantity} {item.unit}</span>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="hidden lg:block lg:col-span-4 bg-white border border-zinc-100 rounded-3xl p-5 shadow-sm h-fit space-y-4">
                        <h3 className="font-black text-zinc-900">Ringkasan Pilihan</h3>
                        <p className="text-zinc-400 text-xs font-bold tracking-wide uppercase">{selectedIngredients.length} bahan dipilih</p>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                            {selectedIngredients.map((name, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-xl text-sm font-bold text-zinc-800 border border-zinc-100">
                                    <span>🍳 {name}</span>
                                    <button type="button" onClick={() => setSelectedIngredients(selectedIngredients.filter(i => i !== name))} className="text-zinc-400 hover:text-red-500 font-black text-base px-2">×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {currentStep === 3 && (
                <div className="w-full bg-white border border-zinc-100 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl shadow-zinc-900/5 animate-fade-in">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-800">Jenis makan / preferensi masakan</label>
                        <textarea
                            value={preferenceText}
                            onChange={(e) => setPreferenceText(e.target.value)}
                            placeholder="Contoh: Berkuah, pedas, cocok untuk makan siang..."
                            className="w-full p-4 bg-zinc-50/50 border border-zinc-200 rounded-2xl text-sm font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#8EBA85]/20 focus:border-[#8EBA85] min-h-[120px] transition-all"
                        />
                    </div>

                    <div className="space-y-4 border-t border-zinc-100 pt-4">
                        <h4 className="text-sm font-bold text-zinc-800 uppercase tracking-wide">Bahan yang akan dikirim ke AI</h4>
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-red-500">Prioritas (Wajib Diolah):</p>
                            <div className="flex flex-wrap gap-2">
                                {lockedIngredients.length === 0 ? (
                                    <span className="text-zinc-400 text-xs font-bold">Tidak ada</span>
                                ) : (
                                    lockedIngredients.map((i, idx) => (
                                        <span key={idx} className="bg-red-50 text-red-600 border border-red-200/60 px-3 py-1.5 rounded-xl text-xs font-bold">🔒 {i.name}</span>
                                    ))
                                )}
                            </div>
                        </div>
                        <div className="space-y-2 pt-2">
                            <p className="text-xs font-bold text-zinc-500">Bahan Pendamping Pilihanmu:</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedIngredients.length === 0 ? (
                                    <span className="text-zinc-400 text-xs font-bold">Tidak ada bahan yang dipilih.</span>
                                ) : (
                                    selectedIngredients.map((name, idx) => (
                                        <span key={idx} className="bg-[#CCDEC7]/50 text-[#5F8A57] border border-[#8EBA85]/20 px-3 py-1.5 rounded-xl text-xs font-bold">🥦 {name}</span>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {currentStep === 4 && (
                <div className="w-full bg-white border border-zinc-100 rounded-3xl p-5 md:p-8 space-y-6 shadow-xl shadow-zinc-900/5 animate-fade-in">
                    {isGenerating ? (
                        <div className="flex flex-col items-center justify-center py-16 space-y-5 text-center min-h-[300px] animate-pulse">
                            <div className="w-12 h-12 border-4 border-[#8EBA85] border-t-transparent rounded-full animate-spin"></div>
                            <div className="space-y-1.5">
                                <h3 className="text-lg font-black text-zinc-900 tracking-tight">
                                    FoodCycle AI Sedang Meracik Resep...
                                </h3>
                                <p className="text-sm text-zinc-500 font-medium max-w-xs mx-auto leading-relaxed">
                                    Menganalisis sisa bumbu dan bahan pangan kulkas Anda untuk menekan angka food waste.
                                </p>
                            </div>
                        </div>
                    ) : aiRecipe ? (
                        <>
                            <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <span className="bg-[#EAF5E9] text-[#5F8A57] text-xs font-bold px-3 py-1 rounded-lg border border-[#8EBA85]/20">🍲 Rekomendasi Menu</span>
                                    <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mt-1.5 tracking-tight">{recipeTitle}</h2>
                                </div>
                                <button
                                    type="button"
                                    disabled={isSaved}
                                    onClick={handleSaveRecipeToLocal}
                                    className={`w-full sm:w-auto px-5 py-3 border rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${isSaved
                                        ? "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed"
                                        : "border-zinc-200 text-zinc-700 hover:bg-zinc-50 bg-white"
                                        }`}
                                >
                                    {isSaved ? "✓ Tersimpan di Cloud" : "🔖 Simpan Resep"}
                                </button>
                            </div>

                            <div className="flex items-center gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-100 w-fit">
                                <span className="text-sm font-bold text-zinc-700">🔢 Porsi Sajian:</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPortion(Math.max(1, portion - 1))}
                                        className="w-8 h-8 bg-white border border-zinc-200 rounded-lg text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="text-sm font-black text-zinc-800 w-6 text-center">{portion}</span>
                                    <button
                                        type="button"
                                        onClick={() => setPortion(portion + 1)}
                                        className="w-8 h-8 bg-white border border-zinc-200 rounded-lg text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                {portion > 1 && (
                                    <span className="text-xs font-semibold text-[#5F8A57] bg-[#EAF5E9] px-2 py-1 rounded-md border border-[#8EBA85]/10 animate-fade-in">
                                        Takaran otomatis dikalikan {portion}x
                                    </span>
                                )}
                            </div>

                            <div className="text-zinc-600 text-sm font-medium leading-relaxed whitespace-pre-line bg-zinc-50/50 p-5 rounded-2xl border border-zinc-100 font-sans">
                                {aiRecipe}
                            </div>

                            <div className="bg-zinc-50 p-4 border border-zinc-100 text-zinc-500 text-xs font-semibold leading-relaxed rounded-2xl">
                                💡 Menekan tombol <span className="font-bold text-zinc-700">"Selesai Masak"</span> di bawah akan menyimpan aktivitas ini ke tab Riwayat dan memotong stok bahan makanan terkait dari kulkas.
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-10 text-zinc-400 font-bold text-sm">
                            Gagal memuat resep dari memori penyimpanan. Silakan kembali ke langkah sebelumnya.
                        </div>
                    )}
                </div>
            )}

            <div className="fixed sm:static bottom-0 left-0 w-full sm:w-auto bg-white sm:bg-transparent p-4 sm:p-0 border-0 flex justify-end gap-3 z-40">
                {currentStep > 1 && (
                    <button
                        type="button"
                        disabled={isGenerating}
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="px-6 py-3.5 border border-zinc-200 rounded-xl font-bold text-sm text-zinc-600 hover:bg-zinc-50 bg-white transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                        ← Kembali
                    </button>
                )}
                <button
                    type="button"
                    disabled={isGenerating}
                    onClick={() => {
                        if (currentStep === 3) {
                            handleGenerateRecipe();
                        } else if (currentStep < 4) {
                            setCurrentStep(currentStep + 1);
                        } else {
                            handleCompleteCooking();
                        }
                    }}
                    className="flex-1 sm:flex-none bg-[#8EBA85] text-white font-bold px-8 py-3.5 rounded-xl shadow-md shadow-[#8EBA85]/10 hover:bg-[#7da874] active:scale-[0.99] transition-all text-sm flex items-center justify-center gap-2 disabled:bg-zinc-200 disabled:text-zinc-400"
                >
                    {currentStep === 1 && "Lanjut Pilih Bahan Lain →"}
                    {currentStep === 2 && "Kustomisasi Resep AI →"}
                    {currentStep === 3 && (isGenerating ? "AI Sedang Meracik Resep..." : "Buat Resep →")}
                    {currentStep === 4 && "✓ Selesai Masak"}
                </button>
            </div>

            {toast.show && (
                <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
                    <div className={`px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-black flex items-center gap-3 tracking-tight transition-all duration-300
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