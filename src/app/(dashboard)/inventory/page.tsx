"use client";

import { useState } from "react";

export default function InventoryPage() {
    const [activeFilter, setActiveFilter] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");

    const inventoryData = [
        { id: 1, name: "Telur", quantity: "20 Butir", expiry: "25 Mei 2026", status: "Aman" },
        { id: 2, name: "Cabai Hijau", quantity: "1 Kilogram", expiry: "21 Mei 2026", status: "Expired" },
        { id: 3, name: "Cabai Merah", quantity: "1 Kilogram", expiry: "21 Mei 2026", status: "Expired" },
        { id: 4, name: "Tomat Cherry", quantity: "2 Kilogram", expiry: "28 Mei 2026", status: "Aman" },
        { id: 5, name: "Sayur Kangkung", quantity: "4 Ikat", expiry: "23 Mei 2026", status: "Hampir Expired" },
    ];

    const filters = ["Semua", "Aman", "Hampir Expired", "Expired"];

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

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">Iventory</h1>
                    <p className="text-zinc-500 text-sm md:text-base font-semibold mt-1">
                        Kelola bahan makanan di kulkasmu
                    </p>
                </div>
                <button
                    type="button"
                    className="inline-flex items-center justify-center bg-[#8EBA85] text-white text-sm font-bold px-5 py-3 rounded-xl shadow-md shadow-[#8EBA85]/20 hover:bg-[#7da874] hover:scale-[1.01] active:scale-[0.99] transition-all self-start sm:self-center"
                >
                    + Tambah Bahan
                </button>
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
                            {inventoryData.map((item) => (
                                <tr key={item.id} className="hover:bg-zinc-50/40 transition-colors">
                                    <td className="px-6 py-4.5 text-sm font-medium text-zinc-800">{item.name}</td>
                                    <td className="px-6 py-4.5 text-sm font-semibold text-zinc-600">{item.quantity}</td>
                                    <td className="px-6 py-4.5 text-sm font-semibold text-zinc-600">{item.expiry}</td>
                                    <td className="px-6 py-4.5 text-sm">
                                        <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-bold ${getStatusStyle(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4.5 text-sm text-center">
                                        <div className="inline-flex items-center justify-center gap-3">
                                            <button type="button" className="text-zinc-400 hover:text-zinc-800 transition-colors p-1" title="Ubah data">
                                                ✏️
                                            </button>
                                            <button type="button" className="text-zinc-400 hover:text-red-600 transition-colors p-1" title="Hapus data">
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}