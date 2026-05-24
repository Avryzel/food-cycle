"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
        } else {
            router.push("/inventory");
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#EAF5E9] flex items-center justify-center p-0 sm:p-6 md:p-8 font-sans selection:bg-emerald-200">
            <main className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-screen sm:min-h-0">

                <div className="hidden lg:flex justify-center items-center relative w-full">
                    <img
                        src="/images/login.png"
                        alt="FoodCycle Robot Chef Illustration"
                        className="w-full h-auto object-contain max-w-md"
                    />
                </div>

                <div className="bg-[#C5E1A5]/60 sm:border sm:border-white/20 sm:shadow-xl rounded-none sm:rounded-[2.5rem] p-8 md:p-12 space-y-6 backdrop-blur-sm w-full min-h-screen sm:min-h-0 flex flex-col justify-center sm:justify-start">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-3xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
                            Selamat Datang Kembali 👋
                        </h1>
                        <p className="text-zinc-700 text-sm md:text-base font-medium leading-relaxed">
                            Login untuk melanjutkan ke akun foodcycle kamu
                        </p>
                    </div>

                    {errorMsg && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold animate-fade-in">
                            ⚠️ {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-zinc-800 tracking-wide">Email</label>
                            <input
                                type="email"
                                required
                                placeholder="Masukkan Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                className="w-full px-5 py-3.5 bg-white text-zinc-900 placeholder-zinc-400 border border-zinc-200/50 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8EBA85]/50 focus:border-[#8EBA85] transition-all text-sm font-medium"
                            />
                        </div>

                        <div className="space-y-1.5 relative">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-zinc-800 tracking-wide">Kata Sandi</label>
                                <Link href="#" className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors">
                                    Lupa Kata Sandi ?
                                </Link>
                            </div>
                            <input
                                type="password"
                                required
                                placeholder="Masukkan Kata Sandi"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                className="w-full px-5 py-3.5 bg-white text-zinc-900 placeholder-zinc-400 border border-zinc-200/50 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8EBA85]/50 focus:border-[#8EBA85] transition-all text-sm font-medium"
                            />
                        </div>

                        <div className="pt-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-[#98BA81] text-white font-bold text-base shadow-lg shadow-[#98BA81]/30 hover:bg-[#85ab6e] hover:scale-[1.01] active:scale-[0.99] disabled:bg-zinc-400 disabled:scale-100 transition-all duration-200"
                            >
                                {loading ? "Memproses..." : "Login"}
                            </button>
                        </div>
                    </form>

                    <div className="text-center text-sm font-bold text-zinc-800 pt-2">
                        Belum punya akun ?{" "}
                        <Link href="/register" className="text-[#436e35] hover:underline underline-offset-4">
                            Daftar disini
                        </Link>
                    </div>
                </div>

            </main>
        </div>
    );
}