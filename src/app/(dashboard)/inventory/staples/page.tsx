"use client";

import { useState } from "react";
import Link from "next/link";

interface BumbuItem {
    id: string;
    name: string;
    image: string;
    selected: boolean;
}

export default function PantryStaplesPage() {
    const [staples, setStaples] = useState<BumbuItem[]>([
        { id: "kunyit", name: "Kunyit", image: "🍠", selected: false },
        { id: "serai", name: "Serai", image: "🌿", selected: false },
        { id: "jahe", name: "Jahe", image: "🫚", selected: false },
        { id: "garam", name: "Garam", image: "🧂", selected: false },
        { id: "bawang_putih", name: "Bawang Putih", image: "🧄", selected: false },
    ]);

    const handleToggleSelect = (id: string) => {
        setStaples(staples.map(item =>
            item.id === id ? { ...item, selected: !item.selected } : item
        ));
    };

    const selectedCount = staples.filter(item => item.selected).length;

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in pb-10">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
                <div className="space-y-0.5">
                    <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">Bumbu Dapur</h1>
                    <p className="text-zinc-400 text-sm font-semibold">Tambah bumbu standar dengan sekali klik</p>
                </div>

                <button
                    type="button"
                    disabled={selectedCount === 0}
                    onClick={() => alert(`🎉 Sukses! ${selectedCount} bumbu terpilih berhasil ditambahkan ke Kulkas.`)}
                    className={`px-5 py-3 rounded-2xl text-sm font-black tracking-tight transition-all flex items-center justify-center gap-2 ${selectedCount > 0
                            ? "bg-[#8EBA85] hover:bg-[#7da874] text-white shadow-md active:scale-[0.99]"
                            : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                        }`}
                >
                    Tambahkan ke Daftar Bahan
                    <span>➔</span>
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {staples.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => handleToggleSelect(item.id)}
                        className={`group relative border rounded-[2.5rem] p-6 flex flex-col items-center justify-between min-h-[220px] transition-all cursor-pointer select-none ${item.selected
                                ? "bg-[#EAF5E9] border-[#8EBA85] shadow-sm scale-[0.99]"
                                : "bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50"
                            }`}
                    >
                        <div className="w-28 h-28 bg-white border border-zinc-100 rounded-3xl shadow-inner flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">
                            {item.image}
                        </div>

                        <span className={`text-base font-black tracking-tight mt-4 ${item.selected ? "text-[#5F8A57]" : "text-zinc-500"
                            }`}>
                            {item.name}
                        </span>

                        {item.selected && (
                            <div className="absolute top-4 right-4 w-6 h-6 bg-[#8EBA85] text-white text-xs font-black rounded-full flex items-center justify-center shadow-sm animate-scale-up">
                                ✓
                            </div>
                        )}
                    </div>
                ))}

                <Link
                    href="/inventory"
                    className="border border-dashed border-zinc-300 rounded-[2.5rem] p-6 flex flex-col items-center justify-center min-h-[220px] bg-zinc-50/30 hover:bg-zinc-50 hover:border-zinc-400 transition-all group"
                >
                    <div className="w-16 h-16 bg-zinc-200/60 rounded-2xl flex items-center justify-center text-2xl font-bold text-zinc-400 group-hover:scale-110 transition-transform">
                        +
                    </div>
                    <span className="text-sm font-black text-zinc-400 tracking-tight text-center mt-4 max-w-[120px]">
                        Tambah Bahan Lainnya
                    </span>
                </Link>
            </div>

        </div>
    );
}