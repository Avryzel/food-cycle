"use client";

import { useState } from "react";

export default function StatisticsPage() {
    const [timeRange, setTimeRange] = useState<"minggu" | "bulan" | "tahun">("minggu");

    const summaryMetrics = {
        itemsSaved: 12,
        weightSaved: 2.4,
        moneySaved: 48000
    };

    const linePathPurple = "M 50,60 L 150,140 L 250,70 L 350,130 L 450,110 L 550,60 L 650,100 L 750,80 L 850,140 L 950,110";
    const linePathPink = "M 50,60 L 150,90 L 250,150 L 350,60 L 450,110 L 550,130 L 650,90 L 750,100 L 850,120 L 950,60";

    const dates = ["13 Mei", "14 Mei", "15 Mei", "16 Mei", "17 Mei", "18 Mei", "19 Mei", "20 Mei", "21 Mei", "22 Mei", "23 Mei"];

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in pb-10">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">Statistik Food Waste</h1>
                    <p className="text-zinc-400 text-sm font-semibold mt-0.5">Lihat dampak positif yang kamu berikan</p>
                </div>

                <div className="relative w-full sm:w-auto max-w-xs">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as any)}
                        className="w-full pl-4 pr-10 py-2.5 bg-white border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-700 shadow-sm hover:border-zinc-300 focus:outline-none cursor-pointer transition-all appearance-none"
                    >
                        <option value="minggu">Minggu Ini</option>
                        <option value="bulan">Bulan Ini</option>
                        <option value="tahun">Tahun Ini</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 pointer-events-none select-none">
                        ▼
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                    <h4 className="text-sm font-bold text-zinc-800 tracking-tight">Bahan Diselamatkan</h4>
                    <div className="space-baseline">
                        <span className="text-4xl font-black text-[#5F8A57] tracking-tight">{summaryMetrics.itemsSaved}</span>
                        <p className="text-zinc-500 font-extrabold text-lg mt-1">Item</p>
                    </div>
                </div>

                <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                    <h4 className="text-sm font-bold text-zinc-800 tracking-tight">Berat Diselamatkan</h4>
                    <div className="space-baseline">
                        <span className="text-4xl font-black text-[#5F8A57] tracking-tight">{summaryMetrics.weightSaved}</span>
                        <p className="text-zinc-500 font-extrabold text-lg mt-1">Kg</p>
                    </div>
                </div>

                <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                    <h4 className="text-sm font-bold text-zinc-800 tracking-tight">Uang Hemat</h4>
                    <div className="space-baseline">
                        <span className="text-4xl font-black text-[#5F8A57] tracking-tight">
                            Rp {summaryMetrics.moneySaved.toLocaleString("id-ID")}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-zinc-200/80 rounded-3xl p-5 shadow-sm space-y-4">
                <div>
                    <h3 className="text-sm font-bold text-zinc-800 tracking-tight">Tren Bahan Diselamatkan</h3>
                    <span className="text-xs font-bold text-zinc-400">(Kg)</span>
                </div>

                <div className="w-full overflow-x-auto border border-zinc-100 rounded-2xl bg-zinc-50/20 p-2">
                    <div className="min-w-[700px] h-48 relative">
                        <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
                            <line x1="0" y1="30" x2="1000" y2="30" stroke="#f4f4f5" strokeWidth="1" />
                            <line x1="0" y1="80" x2="1000" y2="80" stroke="#f4f4f5" strokeWidth="1" />
                            <line x1="0" y1="130" x2="1000" y2="130" stroke="#f4f4f5" strokeWidth="1" />
                            <line x1="0" y1="170" x2="1000" y2="170" stroke="#f4f4f5" strokeWidth="1.5" />

                            <text x="10" y="35" className="text-[10px] font-bold fill-zinc-400">3</text>
                            <text x="10" y="85" className="text-[10px] font-bold fill-zinc-400">2</text>
                            <text x="10" y="135" className="text-[10px] font-bold fill-zinc-400">1</text>
                            <text x="10" y="175" className="text-[10px] font-bold fill-zinc-400">0</text>

                            <path d={linePathPurple} fill="none" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d={linePathPink} fill="none" stroke="#F472B6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                            {[50, 150, 250, 350, 450, 550, 650, 750, 850, 950].map((cx, i) => (
                                <g key={i}>
                                    <circle cx={cx} cy={60 + (i % 3) * 30} r="3.5" className="fill-white stroke-[#A78BFA] stroke-2" />
                                    <circle cx={cx} cy={80 + (i % 2) * 40} r="3.5" className="fill-white stroke-[#F472B6] stroke-2" />
                                </g>
                            ))}
                        </svg>
                    </div>
                </div>

                <div className="grid grid-cols-11 text-center px-4 text-[10px] font-bold text-zinc-400 select-none">
                    {dates.map((date, idx) => (
                        <div key={idx}>{date}</div>
                    ))}
                </div>
            </div>

            <div className="bg-[#EAF5E9]/50 border border-[#8EBA85]/20 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="space-y-1.5 text-center sm:text-left flex-1">
                    <h3 className="text-lg font-black text-zinc-900 tracking-tight">Dampak Positif</h3>
                    <p className="text-zinc-700 text-sm font-bold leading-relaxed max-w-xl">
                        Kamu sudah membantu mengurangi CO₂ setara dengan menanam <span className="text-[#5F8A57] font-black underline underline-offset-4">1 pohon 🌳</span>
                    </p>
                </div>

                <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center bg-white rounded-2xl border border-[#8EBA85]/10 shadow-sm select-none text-5xl">
                    🌳
                </div>
            </div>

        </div>
    );
}