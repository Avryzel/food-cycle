"use client";

import { useState, useEffect } from "react";

export default function CookPage() {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [isClient, setIsClient] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
        "Telur", "Tomat", "Wortel", "Bawang Merah", "Bawang Putih"
    ]);

    const [preferenceText, setPreferenceText] = useState("");

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
    }, []);

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

    const lockedIngredients = [
        { name: "Bayam", category: "Sayuran", expiry: "22 Mei 2026", time: "1 hari lagi", icon: "🥦" },
        { name: "Daging Ayam", category: "Protein", expiry: "21 Mei 2026", time: "Hari ini", icon: "🍗" },
        { name: "Tahu", category: "Protein Nabati", expiry: "22 Mei 2026", time: "1 hari lagi", icon: "🍞" }
    ];

    const availableIngredients = [
        { name: "Telur", category: "Protein", icon: "🍳" },
        { name: "Tomat", category: "Sayuran", icon: "🍅" },
        { name: "Wortel", category: "Sayuran", icon: "🥕" },
        { name: "Cabai", category: "Bumbu", icon: "🌶️" },
        { name: "Keju", category: "Dairy", icon: "🧀" },
        { name: "Jagung", category: "Sayuran", icon: "🌽" },
        { name: "Daung Bawang", category: "Sayuran", icon: "🌱" },
        { name: "Jamur", category: "Sayuran", icon: "🍄" },
        { name: "Bawang Putih", category: "Bumbu", icon: "🧄" },
        { name: "Bawang Merah", category: "Bumbu", icon: "🧅" }
    ];

    const categories = ["Semua Kategori", "Sayuran", "Protein", "Bumbu", "Dairy"];

    const filteredIngredients = availableIngredients.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "Semua Kategori" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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
                        {lockedIngredients.map((item, idx) => (
                            <div key={idx} className="bg-white border border-zinc-100 rounded-3xl p-5 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-zinc-50 rounded-xl border flex items-center justify-center text-xl">{item.icon}</div>
                                    <div>
                                        <h3 className="font-bold text-zinc-900">{item.name}</h3>
                                        <p className="text-zinc-400 text-xs font-semibold">{item.category}</p>
                                    </div>
                                </div>
                                <div className="text-sm font-semibold text-zinc-500 hidden sm:block">{item.expiry}</div>
                                <div className="flex items-center gap-3">
                                    <span className="bg-red-50 text-red-600 border border-red-100 text-xs font-bold px-3 py-1.5 rounded-xl">{item.time}</span>
                                    <span className="text-zinc-400 bg-zinc-50 border p-2 rounded-xl">🔒</span>
                                </div>
                            </div>
                        ))}
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
                            {filteredIngredients.map((item, idx) => {
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
                                    </button>
                                );
                            })}
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
                                {lockedIngredients.map((i, idx) => (
                                    <span key={idx} className="bg-red-50 text-red-600 border border-red-200/60 px-3 py-1.5 rounded-xl text-xs font-bold">🔒 {i.name}</span>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2 pt-2">
                            <p className="text-xs font-bold text-zinc-500">Bahan Pendamping Pilihanmu:</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedIngredients.map((name, idx) => (
                                    <span key={idx} className="bg-[#CCDEC7]/50 text-[#5F8A57] border border-[#8EBA85]/20 px-3 py-1.5 rounded-xl text-xs font-bold">🥦 {name}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {currentStep === 4 && (
                <div className="w-full bg-white border border-zinc-100 rounded-3xl p-5 md:p-8 space-y-6 shadow-xl shadow-zinc-900/5 animate-fade-in">
                    <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="bg-[#EAF5E9] text-[#5F8A57] text-xs font-bold px-3 py-1 rounded-lg border border-[#8EBA85]/20">🍲 Rekomendasi Menu</span>
                            <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mt-1.5 tracking-tight">Sup Ayam Bayam Gurih</h2>
                        </div>
                        <button
                            type="button"
                            onClick={() => alert("Resep sukses disimpan ke daftar Resep Tersimpan! 🔖")}
                            className="w-full sm:w-auto px-5 py-3 border border-zinc-200 rounded-xl font-bold text-sm text-zinc-700 hover:bg-zinc-50 flex items-center justify-center gap-2 transition-all shadow-sm"
                        >
                            🔖 Simpan Resep
                        </button>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-zinc-800 uppercase tracking-wide">Langkah Memasak:</h3>
                        <ol className="list-decimal list-inside space-y-2.5 text-zinc-600 text-sm font-medium leading-relaxed">
                            <li>Rebus air di panci, lalu masukkan <span className="font-bold text-zinc-800">Daging Ayam</span> hingga matang dan kaldu keluar.</li>
                            <li>Tumis irisan <span className="font-bold text-zinc-800">Bawang Merah</span> dan <span className="font-bold text-zinc-800">Bawang Putih</span> hingga harum, lalu masukkan ke air rebusan.</li>
                            <li>Masukkan potongan <span className="font-bold text-zinc-800">Wortel</span> dan tunggu hingga teksturnya empuk.</li>
                            <li>Terakhir, masukkan <span className="font-bold text-zinc-800">Bayam</span> dan <span className="font-bold text-zinc-800">Tahu</span>, tambahkan garam serta merica secukupnya, lalu sajikan hangat.</li>
                        </ol>
                    </div>

                    <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 text-zinc-500 text-xs font-semibold leading-relaxed">
                        💡 Menekan tombol <span className="font-bold text-zinc-700">"Selesai Masak"</span> di bawah akan menyimpan aktivitas ini ke tab Riwayat dan memotong stok bahan makanan terkait dari kulkas.
                    </div>
                </div>
            )}

            <div className="fixed sm:static bottom-0 left-0 w-full sm:w-auto bg-white sm:bg-transparent p-4 sm:p-0 border-0 flex justify-end gap-3 z-40">
                {currentStep > 1 && (
                    <button
                        type="button"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="px-6 py-3.5 border border-zinc-200 rounded-xl font-bold text-sm text-zinc-600 hover:bg-zinc-50 bg-white transition-all flex items-center gap-2 shadow-sm"
                    >
                        ← Kembali
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => {
                        if (currentStep < 4) {
                            setCurrentStep(currentStep + 1);
                        } else {
                            alert("Sukses! Menu tercatat di Riwayat & Persediaan Bahan Kulkas Telah Diperbarui! 🎉");
                            sessionStorage.removeItem("foodcycle_cook_step");
                            sessionStorage.removeItem("foodcycle_selected_ingredients");
                            setCurrentStep(1);
                        }
                    }}
                    className="flex-1 sm:flex-none bg-[#8EBA85] text-white font-bold px-8 py-3.5 rounded-xl shadow-md shadow-[#8EBA85]/10 hover:bg-[#7da874] active:scale-[0.99] transition-all text-sm flex items-center justify-center gap-2"
                >
                    {currentStep === 1 && "Lanjut Pilih Bahan Lain →"}
                    {currentStep === 2 && "Kustomisasi Resep AI →"}
                    {currentStep === 3 && "Buat Resep →"}
                    {currentStep === 4 && "✓ Selesai Masak"}
                </button>
            </div>

        </div>
    );
}