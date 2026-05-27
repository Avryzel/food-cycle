"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface BumbuItem {
    id: string;
    name: string;
    image: string;
    selected: boolean;
    defaultUnit: string;
    defaultExpiryDays: number;
}

export default function PantryStaplesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [successModal, setSuccessModal] = useState({ isOpen: false, count: 0 });

    const [staples, setStaples] = useState<BumbuItem[]>([
        { id: "1", name: "Garam", image: "🧂", selected: false, defaultUnit: "Bungkus (Garam)", defaultExpiryDays: 365 },
        { id: "1", name: "Lada", image: "🌶️", selected: false, defaultUnit: "Bungkus (Lada)", defaultExpiryDays: 365 },
    ]);

    const handleToggleSelect = (id: string, name: string) => {
        if (loading) return;
        setStaples(staples.map(item =>
            item.name === name ? { ...item, selected: !item.selected } : item
        ));
    };

    const selectedCount = staples.filter(item => item.selected).length;

    const handleBulkSaveStaples = async () => {
        const selectedItems = staples.filter(item => item.selected);
        if (selectedItems.length === 0) return;

        setLoading(true);

        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                alert("Sesi masuk telah kedaluwarsa. Silakan login kembali.");
                router.push("/login");
                return;
            }

            const staplesPayload = selectedItems.map((item) => {
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + item.defaultExpiryDays);

                return {
                    user_id: user.id,
                    variant_id: parseInt(item.id, 10),
                    quantity: 1,
                    unit: item.defaultUnit,
                    expiry_date: expiryDate.toISOString(),
                    is_selected: false
                };
            });

            const { error } = await supabase
                .from("user_pantry")
                .insert(staplesPayload);

            if (error) {
                alert(`Gagal menyimpan bumbu dapur: ${error.message}`);
            } else {
                setSuccessModal({ isOpen: true, count: selectedItems.length });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
                <div className="space-y-0.5">
                    <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">Bumbu Dapur</h1>
                    <p className="text-zinc-400 text-sm font-semibold">Tambah bumbu standar dengan sekali klik</p>
                </div>

                <button
                    type="button"
                    disabled={selectedCount === 0 || loading}
                    onClick={handleBulkSaveStaples}
                    className={`px-5 py-3 rounded-2xl text-sm font-black tracking-tight transition-all flex items-center justify-center gap-2 ${selectedCount > 0 && !loading
                        ? "bg-[#8EBA85] hover:bg-[#7da874] text-white shadow-md active:scale-[0.99] cursor-pointer"
                        : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                        }`}
                >
                    {loading ? "Menyimpan..." : "Tambahkan ke Daftar Bahan"}
                    <span>➔</span>
                </button>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl flex items-start gap-4">
                <div className="text-2xl pt-0.5">ℹ️</div>
                <div className="space-y-1">
                    <p className="text-sm font-black text-emerald-900">Catatan Stok Tahan Lama:</p>
                    <p className="text-sm text-emerald-800 leading-relaxed">
                        Semua bumbu yang dipilih akan otomatis diatur dengan masa simpan <strong>±1 tahun (365 hari)</strong>.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {staples.map((item) => (
                    <div
                        key={item.name}
                        onClick={() => handleToggleSelect(item.id, item.name)}
                        className={`group relative border rounded-[2.5rem] p-6 flex flex-col items-center justify-between min-h-[220px] transition-all select-none ${item.selected
                            ? "bg-[#EAF5E9] border-[#8EBA85] shadow-sm scale-[0.99]"
                            : "bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50"
                            } ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                    >
                        <div className="w-28 h-28 bg-white border border-zinc-100 rounded-3xl shadow-inner flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">
                            {item.image}
                        </div>

                        <span className={`text-base font-black tracking-tight mt-4 ${item.selected ? "text-[#5F8A57]" : "text-zinc-500"}`}>
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
                        Kembali ke Kulkas
                    </span>
                </Link>
            </div>

            {successModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white max-w-sm w-full rounded-3xl p-6 border border-zinc-100 shadow-2xl space-y-5 text-center animate-scale-up">
                        <div className="space-y-2">
                            <div className="w-16 h-16 bg-[#EAF5E9] text-[#5F8A57] rounded-full flex items-center justify-center text-2xl mx-auto font-bold shadow-inner">
                                ✓
                            </div>
                            <h3 className="text-xl font-black text-zinc-900 tracking-tight pt-2">Bumbu Siap Dipakai!</h3>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                                Sukses memasukkan <span className="font-bold text-[#5F8A57]">{successModal.count} bumbu dapur</span> ke dalam Kulkas digitalmu.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                router.push("/inventory");
                                setSuccessModal({ isOpen: false, count: 0 });
                            }}
                            className="w-full bg-[#8EBA85] hover:bg-[#7da874] text-white font-black py-3.5 rounded-xl transition-all shadow-md shadow-[#8EBA85]/20 text-sm cursor-pointer"
                        >
                            Selesai & Cek Isi Kulkas
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}