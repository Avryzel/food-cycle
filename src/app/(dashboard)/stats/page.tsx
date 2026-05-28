"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function StatisticsPage() {
    const [timeRange, setTimeRange] = useState<"minggu" | "bulan" | "tahun">("minggu");
    const [loading, setLoading] = useState<boolean>(true);
    const [isClient, setIsClient] = useState(false);

    const [metrics, setMetrics] = useState({
        itemsSaved: 0,
        weightSaved: 0,
        moneySaved: 0
    });

    const [chartData, setChartData] = useState<{ name: string; berat: number }[]>([]);

    useEffect(() => {
        setIsClient(true);
        fetchStatisticsData();
    }, [timeRange]);

    const fetchStatisticsData = async () => {
        try {
            setLoading(true);
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) return;

            let query = supabase
                .from("kitchen_logs")
                .select("created_at, calculated_weight_kg")
                .eq("user_id", user.id)
                .eq("action_type", "COOKING");

            const today = new Date();
            if (timeRange === "minggu") {
                const oneWeekAgo = new Date(today);
                oneWeekAgo.setDate(today.getDate() - 7);
                query = query.gte("created_at", oneWeekAgo.toISOString());
            } else if (timeRange === "bulan") {
                const oneMonthAgo = new Date(today);
                oneMonthAgo.setMonth(today.getMonth() - 1);
                query = query.gte("created_at", oneMonthAgo.toISOString());
            } else if (timeRange === "tahun") {
                const oneYearAgo = new Date(today);
                oneYearAgo.setFullYear(today.getFullYear() - 1);
                query = query.gte("created_at", oneYearAgo.toISOString());
            }

            const { data, error } = await query.order("created_at", { ascending: true });

            if (error) throw error;

            if (data) {
                const totalSesi = data.length;
                const totalBerat = data.reduce((acc, curr) => acc + (curr.calculated_weight_kg || 0), 0);
                const totalUang = (totalBerat / 0.25) * 20000;

                setMetrics({
                    itemsSaved: totalSesi,
                    weightSaved: Number(totalBerat.toFixed(2)),
                    moneySaved: totalUang
                });

                const groups = data.reduce((acc: any, curr) => {
                    const dateLabel = new Date(curr.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short"
                    });
                    acc[dateLabel] = (acc[dateLabel] || 0) + (curr.calculated_weight_kg || 0);
                    return acc;
                }, {});

                const formattedChartData = Object.keys(groups).map(date => ({
                    name: date,
                    berat: Number(groups[date].toFixed(2))
                }));

                if (formattedChartData.length === 0) {
                    setChartData([
                        { name: "Belum Ada Data", berat: 0 }
                    ]);
                } else {
                    setChartData(formattedChartData);
                }
            }
        } catch (err) {
            console.error("Gagal sinkronisasi data statistik:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isClient) {
        return <div className="p-8 text-zinc-400 font-semibold animate-pulse">Memuat Analisis Dasbor...</div>;
    }

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
                        <option value="minggu">7 Hari Terakhir</option>
                        <option value="bulan">30 Hari Terakhir</option>
                        <option value="tahun">1 Tahun Terakhir</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 pointer-events-none select-none">
                        ▼
                    </span>
                </div>
            </div>

            {loading ? (
                <div className="p-20 text-center text-zinc-400 font-bold text-sm animate-pulse">
                    Mengkalkulasi metrik penyelamatan pangan dapur...
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                            <h4 className="text-sm font-bold text-zinc-800 tracking-tight">Bahan Diselamatkan</h4>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-4xl font-black text-[#5F8A57] tracking-tight">{metrics.itemsSaved}</span>
                                <span className="text-zinc-500 font-extrabold text-sm">Sesi</span>
                            </div>
                        </div>

                        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                            <h4 className="text-sm font-bold text-zinc-800 tracking-tight">Berat Diselamatkan</h4>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-4xl font-black text-[#5F8A57] tracking-tight">{metrics.weightSaved}</span>
                                <span className="text-zinc-500 font-extrabold text-sm">Kg</span>
                            </div>
                        </div>

                        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                            <h4 className="text-sm font-bold text-zinc-800 tracking-tight">Uang Hemat</h4>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-4xl font-black text-[#5F8A57] tracking-tight">
                                    Rp {metrics.moneySaved.toLocaleString("id-ID")}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200/80 rounded-3xl p-5 shadow-sm space-y-4">
                        <div>
                            <h3 className="text-sm font-bold text-zinc-800 tracking-tight">Tren Bahan Diselamatkan</h3>
                            <span className="text-xs font-bold text-zinc-400">(Kg)</span>
                        </div>

                        <div className="w-full border border-zinc-100 rounded-2xl bg-zinc-50/20 p-4 h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorBerat" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8EBA85" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#8EBA85" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#a1a1aa"
                                        fontSize={11}
                                        fontWeight="bold"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#a1a1aa"
                                        fontSize={11}
                                        fontWeight="bold"
                                        tickLine={false}
                                        axisLine={false}
                                        allowDecimals={true}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#fff",
                                            borderRadius: "1rem",
                                            borderColor: "#e4e4e7",
                                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)"
                                        }}
                                        labelStyle={{ fontWeight: "bold", color: "#18181b" }}
                                        itemStyle={{ fontWeight: "bold", color: "#5F8A57" }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="berat"
                                        name="Berat (Kg)"
                                        stroke="#8EBA85"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorBerat)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-[#EAF5E9]/50 border border-[#8EBA85]/20 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                        <div className="space-y-1.5 text-center sm:text-left flex-1">
                            <h3 className="text-lg font-black text-zinc-900 tracking-tight">Dampak Positif</h3>
                            <p className="text-zinc-700 text-sm font-bold leading-relaxed max-w-xl">
                                Kamu sudah membantu mengurangi emisi CO₂ dengan menyelamatkan bahan makanan sisa kulkas. Capaianmu setara dengan menanam <span className="text-[#5F8A57] font-black underline underline-offset-4">{Math.max(1, Math.floor(metrics.weightSaved / 2))} pohon 🌳</span>
                            </p>
                        </div>

                        <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center bg-white rounded-2xl border border-[#8EBA85]/10 shadow-sm select-none text-5xl">
                            🌳
                        </div>
                    </div>
                </>
            )}

        </div>
    );
}