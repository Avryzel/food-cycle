"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { masterIngredientsDatabase, MasterIngredient, VariantOption, SubVariant } from "@/lib/constants";

interface CartItem {
    id: string;
    ingredientName: string;
    image: string;
    variantId: number;
    variantLabel: string;
    quantity: number;
    defaultExpiryDays: number;
}

export default function AddIngredientPage() {
    const router = useRouter();
    const [selectedIngredient, setSelectedIngredient] = useState<MasterIngredient | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<VariantOption | null>(null);
    const [selectedSubVariant, setSelectedSubVariant] = useState<SubVariant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [successModal, setSuccessModal] = useState({ isOpen: false, count: 0 });

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

    const handleAddToBag = () => {
        if (!selectedIngredient || !selectedVariant) return;

        const finalUnitLabel = selectedSubVariant
            ? `${selectedVariant.label} (${selectedSubVariant.label})`
            : selectedVariant.label;

        const newItem: CartItem = {
            id: Date.now().toString(),
            ingredientName: selectedIngredient.name,
            image: selectedIngredient.image,
            variantId: parseInt(selectedVariant.id, 10),
            variantLabel: finalUnitLabel,
            quantity: quantity,
            defaultExpiryDays: selectedIngredient.defaultExpiryDays
        };

        setCart((prev) => [...prev, newItem]);
        setSelectedIngredient(null);
        setSelectedVariant(null);
        setSelectedSubVariant(null);
        setQuantity(1);
    };

    const handleRemoveFromBag = (id: string) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const handleBulkSaveToPantry = async () => {
        if (cart.length === 0) return;

        setLoading(true);

        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                alert("Sesi masuk telah kedaluwarsa. Silakan login kembali.");
                router.push("/login");
                return;
            }

            const realPayload = cart.map((item) => {
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + item.defaultExpiryDays);

                return {
                    user_id: user.id,
                    variant_id: item.variantId,
                    quantity: item.quantity,
                    unit: item.variantLabel,
                    expiry_date: expiryDate.toISOString(),
                    is_selected: false
                };
            });

            const { error } = await supabase
                .from("user_pantry")
                .insert(realPayload);

            if (error) {
                alert(`Gagal menyimpan ke kulkas: ${error.message}`);
            } else {
                setSuccessModal({ isOpen: true, count: cart.length });
                setCart([]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-10 animate-fade-in pb-10 px-4 sm:px-0 relative">

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

                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-zinc-800 tracking-tight ml-1">Daftar Bahan Makanan</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {masterIngredientsDatabase.map((item) => {
                                const isSelected = selectedIngredient?.id === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => handleSelectIngredient(item)}
                                        disabled={loading}
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

                    {cart.length > 0 && (
                        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 space-y-4 shadow-xl shadow-zinc-100/50">
                            <h4 className="text-base font-black text-zinc-900 tracking-tight flex items-center gap-2">
                                📦 Keranjang Bahan Sementara ({cart.length})
                            </h4>
                            <div className="divide-y divide-zinc-100 max-h-[240px] overflow-y-auto pr-2">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between py-3 text-sm animate-fade-in">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{item.image}</span>
                                            <div>
                                                <span className="font-bold text-zinc-800 block">{item.ingredientName}</span>
                                                <span className="text-zinc-400 text-xs font-semibold">Jumlah: {item.quantity} {item.variantLabel}</span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFromBag(item.id)}
                                            className="text-red-500 hover:text-red-700 font-bold text-xs px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={handleBulkSaveToPantry}
                                disabled={loading}
                                className="w-full bg-[#8EBA85] hover:bg-[#7da874] text-white font-black py-4 rounded-2xl shadow-md transition-all text-sm disabled:bg-zinc-400 cursor-pointer text-center"
                            >
                                {loading ? "Memasukkan ke Kulkas..." : "Konfirmasi Masuk Kulkas ➔"}
                            </button>
                        </div>
                    )}
                </div>

                {selectedIngredient && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/40 z-40 lg:hidden animate-fade-in"
                            onClick={() => !loading && setSelectedIngredient(null)}
                        />

                        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[2.5rem] p-6 border-t border-zinc-200 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto animate-slide-up lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:z-0 lg:bg-white lg:border lg:border-zinc-200/60 lg:rounded-3xl lg:shadow-xl lg:shadow-zinc-100 lg:max-h-none lg:overflow-visible lg:animate-scale-up">

                            <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto -mt-2 mb-4 lg:hidden" onClick={() => !loading && setSelectedIngredient(null)} />

                            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center text-3xl border border-zinc-100">
                                        {selectedIngredient.image}
                                    </div>
                                    <h4 className="text-xl font-black text-zinc-900">{selectedIngredient.name}</h4>
                                </div>
                                <button type="button" onClick={() => !loading && setSelectedIngredient(null)} disabled={loading} className="text-zinc-400 hover:text-zinc-600 font-bold p-2 lg:hidden">
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
                                                disabled={loading}
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
                                                    disabled={loading}
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
                                    <button type="button" onClick={() => !loading && setQuantity(Math.max(1, quantity - 1))} disabled={loading} className="px-5 py-3 text-xl font-black text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 select-none">-</button>
                                    <div className="w-full text-center text-xl font-black text-zinc-900">{quantity}</div>
                                    <button type="button" onClick={() => !loading && setQuantity(quantity + 1)} disabled={loading} className="px-5 py-3 text-xl font-black text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 select-none">+</button>
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
                                onClick={handleAddToBag}
                                disabled={loading}
                                className="w-full bg-[#8EBA85] hover:bg-[#7da874] text-white font-black py-4 rounded-2xl shadow-md transition-all active:scale-[0.995] text-sm disabled:bg-zinc-400"
                            >
                                Tambah ke Keranjang
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* MODAL SUKSES TAMBAH MASSAL */}
            {successModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white max-w-sm w-full rounded-3xl p-6 border border-zinc-100 shadow-2xl space-y-5 text-center animate-scale-up">
                        <div className="space-y-2">
                            <div className="w-16 h-16 bg-[#EAF5E9] text-[#5F8A57] rounded-full flex items-center justify-center text-2xl mx-auto font-bold shadow-inner">
                                ✓
                            </div>
                            <h3 className="text-xl font-black text-zinc-900 tracking-tight pt-2">Berhasil Masuk Kulkas!</h3>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                                Sukses memasukkan <span className="font-bold text-[#5F8A57]">{successModal.count} jenis</span> bahan makanan baru ke dalam sistem inventaris FoodCycle kamu.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setSuccessModal({ isOpen: false, count: 0 });
                                router.push("/inventory");
                            }}
                            className="w-full bg-[#8EBA85] hover:bg-[#7da874] text-white font-black py-3.5 rounded-xl transition-all shadow-md shadow-[#8EBA85]/20 text-sm cursor-pointer"
                        >
                            Selesai & Lihat Isi Kulkas
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}