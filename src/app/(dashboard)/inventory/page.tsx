"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
}

export default function InventoryPage() {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");
    const [inventoryData, setInventoryData] = useState<PantryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; itemId: string | null }>({
        isOpen: false,
        itemId: null
    });

    const filters = ["Semua", "Aman", "Hampir Expired", "Expired"];

    useEffect(() => {
        fetchPantryData();
    }, []);

    const fetchPantryData = async () => {
        try {
            setLoading(true);
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                router.push("/login");
                return;
            }

            const { data, error } = await supabase
                .from("user_pantry")
                .select("id, variant_id, quantity, unit, expiry_date")
                .eq("user_id", user.id)
                .order("expiry_date", { ascending: true });

            if (error) {
                console.error("Gagal mengambil data pantry:", error.message);
            } else if (data) {
                const mappedData = data.map((item) => {
                    const expiry = new Date(item.expiry_date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const timeDiff = expiry.getTime() - today.getTime();
                    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

                    let currentStatus = "Aman";
                    if (daysLeft <= 0) {
                        currentStatus = "Expired";
                    } else if (daysLeft <= 3) {
                        currentStatus = "Hampir Expired";
                    }

                    return {
                        id: item.id,
                        variant_id: item.variant_id,
                        name: formatIngredientName(item.variant_id, item.unit),
                        quantity: item.quantity,
                        unit: cleanUnitDisplay(item.unit),
                        expiry_date: item.expiry_date,
                        expiry: expiry.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
                        status: currentStatus,
                    };
                });

                setInventoryData(mappedData);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatIngredientName = (variantId: number, unitStr: string) => {
        if (unitStr && unitStr.includes("(") && unitStr.includes(")")) {
            const bumbuName = unitStr.substring(unitStr.indexOf("(") + 1, unitStr.indexOf(")"));
            return bumbuName.trim().charAt(0).toUpperCase() + bumbuName.trim().slice(1);
        }

        const matchedIngredient = masterIngredientsDatabase.find((ingredient) =>
            ingredient.variants.some((variant) => parseInt(variant.id, 10) === variantId)
        );

        return matchedIngredient ? matchedIngredient.name : `Bahan Makanan (#${variantId})`;
    };

    const cleanUnitDisplay = (unitStr: string) => {
        if (unitStr && unitStr.includes("(")) {
            return unitStr.substring(0, unitStr.indexOf("(")).trim();
        }
        return unitStr;
    };

    const openDeleteModal = (id: string) => {
        setDeleteModal({ isOpen: true, itemId: id });
    };

    const handleConfirmDelete = async () => {
        if (!deleteModal.itemId) return;

        const { error } = await supabase.from("user_pantry").delete().eq("id", deleteModal.itemId);
        if (error) {
            alert("Gagal menghapus bahan.");
        } else {
            setInventoryData((prev) => prev.filter((item) => item.id !== deleteModal.itemId));
        }
        setDeleteModal({ isOpen: false, itemId: null });
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Aman":
                return "bg-[#8EBA85]/30 text-[#5F8A57]";
            case "Hampir Expired":
                return "bg-[#E5A93C]/20 text-[#C48419]";
            case "Expired":
                return "bg-[#E57373]/20 text-[#D32F2F]";
            default:
                return "bg-zinc-100 text-zinc-600";
        }
    };

    const filteredInventory = inventoryData.filter((item) => {
        const matchesFilter = activeFilter === "Semua" || item.status === activeFilter;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">Inventory</h1>
                    <p className="text-zinc-500 text-sm md:text-base font-semibold mt-1">
                        Kelola bahan makanan di kulkasmu
                    </p>
                </div>
                <Link
                    href="/inventory/add"
                    className="inline-flex items-center justify-center bg-[#8EBA85] text-white text-sm font-bold px-5 py-3 rounded-xl shadow-md shadow-[#8EBA85]/20 hover:bg-[#7da874] hover:scale-[1.01] active:scale-[0.99] transition-all self-start sm:self-center select-none text-center"
                >
                    + Tambah Bahan
                </Link>
            </div>

            <div className="bg-[#EAF5E9]/60 border border-[#8EBA85]/20 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-0.5">
                    <h4 className="text-base font-black text-zinc-900 tracking-tight">Punya Bumbu Dapur Standar?</h4>
                    <p className="text-zinc-400 text-xs md:text-sm font-semibold">Isi cepat garam, bawang, jahe, dll tanpa harus input manual satu-satu</p>
                </div>
                <Link
                    href="/inventory/staples"
                    className="bg-[#8EBA85] hover:bg-[#7da874] text-white text-xs md:text-sm font-black px-5 py-3 rounded-2xl shadow-md shadow-[#8EBA85]/10 transition-all active:scale-[0.98] whitespace-nowrap self-stretch sm:self-auto text-center"
                >
                    Pumbu Utama ➔
                </Link>
            </div>

            <div className="space-y-4">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Cari Bahan Makanan"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-5 pr-12 py-3.5 bg-white border border-zinc-200 rounded-2xl text-zinc-900 placeholder-zinc-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#8EBA85]/30 focus:border-[#8EBA85] transition-all shadow-sm"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 select-none text-base">
                        🔍
                    </span>
                </div>

                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            type="button"
                            onClick={() => setActiveFilter(filter)}
                            className={`px-5 py-2 rounded-xl text-xs md:text-sm font-bold tracking-wide border transition-all shrink-0 ${activeFilter === filter
                                ? "bg-[#8EBA85] border-[#8EBA85] text-white shadow-sm shadow-[#8EBA85]/30"
                                : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-zinc-100 shadow-xl shadow-zinc-900/5 overflow-hidden">
                <div className="overflow-x-auto w-full">
                    {loading ? (
                        <div className="p-10 text-center text-sm font-bold text-zinc-400">
                            Memuat isi kulkas...
                        </div>
                    ) : filteredInventory.length === 0 ? (
                        <div className="p-10 text-center text-sm font-bold text-zinc-400">
                            Tidak ada bahan makanan ditemukan.
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                    <th className="px-6 py-4.5 text-sm font-bold text-zinc-800 tracking-wide">Bahan</th>
                                    <th className="px-6 py-4.5 text-sm font-bold text-zinc-800 tracking-wide">Jumlah</th>
                                    <th className="px-6 py-4.5 text-sm font-bold text-zinc-800 tracking-wide">Kadaluarsa</th>
                                    <th className="px-6 py-4.5 text-sm font-bold text-zinc-800 tracking-wide">Status</th>
                                    <th className="px-6 py-4.5 text-sm font-bold text-zinc-800 tracking-wide text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {filteredInventory.map((item) => (
                                    <tr key={item.id} className="hover:bg-zinc-50/40 transition-colors">
                                        <td className="px-6 py-4.5 text-sm font-medium text-zinc-800">{item.name}</td>
                                        <td className="px-6 py-4.5 text-sm font-semibold text-zinc-600">
                                            {item.quantity} {item.unit}
                                        </td>
                                        <td className="px-6 py-4.5 text-sm font-semibold text-zinc-600">{item.expiry}</td>
                                        <td className="px-6 py-4.5 text-sm">
                                            <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-bold ${getStatusStyle(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4.5 text-sm text-center">
                                            <div className="inline-flex items-center justify-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => openDeleteModal(item.id)}
                                                    className="text-zinc-400 hover:text-red-600 transition-colors p-1"
                                                    title="Hapus data"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white max-w-sm w-full rounded-3xl p-6 border border-zinc-100 shadow-2xl space-y-5 animate-scale-up">
                        <div className="space-y-2 text-center">
                            <div className="text-3xl">🗑️</div>
                            <h3 className="text-lg font-black text-zinc-900 tracking-tight">Hapus Bahan Makanan?</h3>
                            <p className="text-zinc-500 text-sm font-medium">Tindakan ini akan mengeluarkan bahan pilihanmu dari kulkas secara permanen.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteModal({ isOpen: false, itemId: null })}
                                className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold py-3 rounded-xl transition-all text-sm cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-red-500/10 text-sm cursor-pointer"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}