"use client";

import { useState } from "react";

interface AllergyItem {
    id: string;
    label: string;
    icon: string;
}

export default function SettingsPage() {
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

    const allergyOptions: AllergyItem[] = [
        { id: "seafood", label: "Seafood", icon: "🦀" },
        { id: "kacang", label: "Kacang-kacangan", icon: "🥜" },
        { id: "susu", label: "Susu / Lactose", icon: "🥛" },
        { id: "telur", label: "Telur", icon: "🥚" },
        { id: "gandum", label: "Gandum / Gluten", icon: "🌾" },
    ];

    const handleToggleAllergy = (id: string) => {
        setSelectedAllergies((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 animate-fade-in pb-10 px-4 sm:px-0">

            <div>
                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">Pengaturan</h1>
                <p className="text-zinc-500 text-sm md:text-base font-semibold mt-1">
                    Atur preferensi sistem dan konfigurasi filter AI dapurmu
                </p>
            </div>

            <div className="space-y-6">

                <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-zinc-100/40 space-y-4">
                    <div>
                        <h3 className="text-lg font-black text-zinc-900 tracking-tight">Filter Alergi / Pantangan AI</h3>
                        <p className="text-zinc-400 text-xs md:text-sm font-semibold leading-relaxed mt-0.5">
                            Bahan yang kamu pilih di bawah ini secara otomatis akan dikecualikan oleh AI saat merumuskan rekomendasi resep makanan.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        {allergyOptions.map((item) => {
                            const isSelected = selectedAllergies.includes(item.id);
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleToggleAllergy(item.id)}
                                    className="px-6 py-4 rounded-2xl border border-zinc-200/80 bg-white text-left flex items-center justify-between transition-all hover:bg-zinc-50/50 select-none group active:scale-[0.995]"
                                >
                                    <div className="flex items-center gap-3.5">
                                        <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                                        <span className="text-sm font-bold text-zinc-700 tracking-tight">{item.label}</span>
                                    </div>

                                    <div className={`w-6 h-6 rounded-xl border-2 transition-colors flex items-center justify-center ${isSelected
                                            ? "bg-[#8EBA85] border-[#8EBA85]"
                                            : "border-zinc-200 bg-white group-hover:border-zinc-300"
                                        }`}>
                                        {isSelected && (
                                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-zinc-100/40 flex items-center justify-between gap-6">
                    <div className="space-y-0.5 flex-1">
                        <h3 className="text-lg font-black text-zinc-900 tracking-tight">Pengingat Kadaluarsa</h3>
                        <p className="text-zinc-400 text-xs md:text-sm font-semibold leading-relaxed">
                            Kirim peringatan harian jika ada bahan makanan di kulkas digital yang berstatus hampir kadaluarsa atau expired.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsNotificationEnabled(!isNotificationEnabled)}
                        className={`w-14 h-8 rounded-full transition-colors relative focus:outline-none p-1 shrink-0 ${isNotificationEnabled ? "bg-[#8EBA85]" : "bg-zinc-200"
                            }`}
                    >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${isNotificationEnabled ? "translate-x-6" : "translate-x-0"
                            }`} />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => alert(`Pengaturan disimpan! Filter aktif: ${selectedAllergies.join(", ") || "Tidak ada"}`)}
                    className="w-full bg-[#8EBA85] hover:bg-[#7da874] text-white font-black py-4 rounded-2xl shadow-md shadow-[#8EBA85]/10 transition-all active:scale-[0.99] text-sm text-center"
                >
                    Simpan Perubahan
                </button>

            </div>
        </div>
    );
}