"use client";

import { useState } from "react";
import Link from "next/link";

interface SubVariant {
    id: string;
    label: string;
}

interface VariantOption {
    id: string;
    label: string;
    subVariants?: SubVariant[];
}

interface MasterIngredient {
    id: string;
    name: string;
    image: string;
    defaultExpiryDays: number;
    variants: VariantOption[];
}

const masterIngredientsDatabase: MasterIngredient[] = [
    {
        id: "telur", name: "Telur", image: "🥚", defaultExpiryDays: 14,
        variants: [{ id: "egg_pcs", label: "Butir" }, { id: "egg_kg", label: "Kilogram" }]
    },
    {
        id: "ayam", name: "Daging Ayam", image: "🍗", defaultExpiryDays: 3,
        variants: [
            {
                id: "chicken_kg", label: "Kilogram",
                subVariants: [{ id: "dada", label: "Fillet Dada" }, { id: "paha", label: "Potongan Paha" }, { id: "utuh", label: "Ayam Utuh" }]
            },
            { id: "chicken_pack", label: "Bungkus" }
        ]
    },
    { id: "bayam", name: "Bayam", image: "🥬", defaultExpiryDays: 2, variants: [{ id: "spinach_ikat", label: "Ikat" }] },
    { id: "beras", name: "Beras", image: "🌾", defaultExpiryDays: 90, variants: [{ id: "rice_kg", label: "Kilogram" }] },
    { id: "susu", name: "Susu UHT", image: "🥛", defaultExpiryDays: 7, variants: [{ id: "milk_liter", label: "Liter" }, { id: "milk_box", label: "Kotak" }] },
];

export default function AddIngredientPage() {
    const [selectedIngredient, setSelectedIngredient] = useState<MasterIngredient | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<VariantOption | null>(null);
    const [selectedSubVariant, setSelectedSubVariant] = useState<SubVariant | null>(null);
    const [quantity, setQuantity] = useState(1);

    const handleSelectIngredient = (ingredient: MasterIngredient) => {
        setSelectedIngredient(ingredient);
        const firstVariant = ingredient.variants[0] || null;
        setSelectedVariant(firstVariant);
        setSelectedSubVariant(firstVariant?.subVariants ? firstVariant.subVariants[0] : null);
        setQuantity(1);
    };

    const handleSelectVariant = (variant: VariantOption) => {
        setSelectedVariant(variant);
        setSelectedSubVariant(variant.subVariants ? variant.subVariants[0] : null);
    };

    const getCalculatedExpiryDate = () => {
        if (!selectedIngredient) return "";
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + selectedIngredient.defaultExpiryDays);
        return targetDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-10 animate-fade-in pb-10 px-4 sm:px-0">

            <div className="flex items-center gap-4 border-b border-zinc-100 pb-5">
                <Link href="/inventory" className="p-3 flex items-center justify-center rounded-2xl bg-white border border-zinc-200/80 shadow-sm hover:border-zinc-300 hover:bg-zinc-50 transition-all active:scale-95">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0 l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Pilih Bahan Masuk</h1>
                    <p className="text-zinc-400 text-sm font-semibold">Tunjuk bahan dan tentukan varian takarannya dengan cepat</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">

                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-black text-zinc-800 tracking-tight ml-1">Daftar Bahan Makanan</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {masterIngredientsDatabase.map((item) => {
                            const isSelected = selectedIngredient?.id === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleSelectIngredient(item)}
                                    className={`group relative border rounded-[2.5rem] p-6 flex flex-col items-center justify-center min-h-[160px] md:min-h-[180px] transition-all select-none ${isSelected
                                        ? "bg-[#EAF5E9] border-[#8EBA85] shadow-sm scale-[0.99]"
                                        : "bg-white border-zinc-200/60 hover:border-zinc-300 hover:bg-zinc-50/30"
                                        }`}
                                >
                                    <div className="w-20 h-20 bg-white border border-zinc-100 rounded-3xl shadow-inner flex items-center justify-center text-3xl transition-transform group-hover:scale-105">
                                        {item.image}
                                    </div>
                                    <span className={`text-sm font-black tracking-tight mt-3 ${isSelected ? "text-[#5F8A57]" : "text-zinc-600"}`}>
                                        {item.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {selectedIngredient && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/40 z-40 lg:hidden animate-fade-in"
                            onClick={() => setSelectedIngredient(null)}
                        />

                        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[2.5rem] p-6 border-t border-zinc-200 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto animate-slide-up lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:z-0 lg:bg-white lg:border lg:border-zinc-200/60 lg:rounded-3xl lg:shadow-xl lg:shadow-zinc-100 lg:max-h-none lg:overflow-visible lg:animate-scale-up">

                            <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto -mt-2 mb-4 lg:hidden" onClick={() => setSelectedIngredient(null)} />

                            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center text-3xl border border-zinc-100">
                                        {selectedIngredient.image}
                                    </div>
                                    <h4 className="text-xl font-black text-zinc-900">{selectedIngredient.name}</h4>
                                </div>
                                <button type="button" onClick={() => setSelectedIngredient(null)} className="text-zinc-400 hover:text-zinc-600 font-bold p-2 lg:hidden">
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-400">Varian Takaran:</label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedIngredient.variants.map((v) => {
                                        const isVariantSelected = selectedVariant?.id === v.id;
                                        return (
                                            <button
                                                key={v.id}
                                                type="button"
                                                onClick={() => handleSelectVariant(v)}
                                                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${isVariantSelected ? "bg-[#EAF5E9] border-[#8EBA85] text-[#5F8A57] font-black" : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"}`}
                                            >
                                                {v.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {selectedVariant?.subVariants && (
                                <div className="space-y-2 pt-1 border-t border-dashed border-zinc-100">
                                    <label className="text-xs font-bold text-zinc-400">Jenis Potongan / Bagian:</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {selectedVariant.subVariants.map((sub) => {
                                            const isSubSelected = selectedSubVariant?.id === sub.id;
                                            return (
                                                <button
                                                    key={sub.id}
                                                    type="button"
                                                    onClick={() => setSelectedSubVariant(sub)}
                                                    className={`px-3 py-2 rounded-lg text-xs font-semibold border text-center transition-all ${isSubSelected ? "bg-zinc-900 border-zinc-900 text-white shadow-sm" : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"}`}
                                                >
                                                    {sub.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 pt-1">
                                <label className="text-xs font-bold text-zinc-400">Jumlah / Banyaknya:</label>
                                <div className="flex items-center border border-zinc-200 rounded-2xl bg-zinc-50/50 overflow-hidden shadow-inner">
                                    <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 py-3 text-xl font-black text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 select-none">-</button>
                                    <div className="w-full text-center text-xl font-black text-zinc-900">{quantity}</div>
                                    <button type="button" onClick={() => setQuantity(quantity + 1)} className="px-5 py-3 text-xl font-black text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 select-none">+</button>
                                </div>
                                <p className="text-center text-xs font-bold text-zinc-400 mt-1">
                                    Total: {quantity} {selectedVariant?.label} {selectedSubVariant ? `(${selectedSubVariant.label})` : ""}
                                </p>
                            </div>

                            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 space-y-1">
                                <label className="text-[11px] font-bold text-zinc-400 block uppercase tracking-wider">Estimasi Kadaluarsa:</label>
                                <p className="text-sm font-black text-zinc-700">Otomatis dihitung <span className="text-red-500">{selectedIngredient.defaultExpiryDays} Hari</span> lagi</p>
                                <p className="text-xs font-bold text-zinc-400">({getCalculatedExpiryDate()})</p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    alert(`Sukses menambahkan ${quantity} ${selectedVariant?.label} ${selectedIngredient.name}`);
                                    setSelectedIngredient(null);
                                }}
                                className="w-full bg-[#8EBA85] hover:bg-[#7da874] text-white font-black py-4 rounded-2xl shadow-md transition-all active:scale-[0.995] text-sm"
                            >
                                Simpan ke Kulkas
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}