"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        setLoading(false);
        if (error) {
            setErrorMsg(error.message);
        } else {
            setSuccessMsg("Pendaftaran berhasil! Mengalihkan ke halaman login...");
            setFullName("");
            setEmail("");
            setPassword("");

            setTimeout(() => {
                router.push("/login");
            }, 1500);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#EAF5E9] flex items-center justify-center p-0 sm:p-6 md:p-8 font-sans selection:bg-emerald-200">
            <main className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-screen sm:min-h-0">

                <div className="hidden lg:flex justify-center items-center relative w-full">
                    <img
                        src="/images/register.png"
                        alt="FoodCycle Register Ecology Illustration"
                        className="w-full h-auto object-contain max-w-md"
                    />
                </div>

                <div className="bg-[#C5E1A5]/60 sm:border sm:border-white/20 sm:shadow-xl rounded-none sm:rounded-[2.5rem] p-8 md:p-12 space-y-6 backdrop-blur-sm w-full min-h-screen sm:min-h-0 flex flex-col justify-center sm:justify-start">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
                            Buat Akun Baru 🌿
                        </h1>
                        <p className="text-zinc-700 text-sm mt-1.5 font-medium leading-relaxed">
                            Daftar untuk mengurangi food waste bersama foodcycle
                        </p>
                    </div>

                    {errorMsg && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold">
                            ⚠️ {errorMsg}
                        </div>
                    )}

                    {successMsg && (
                        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-semibold">
                            ✅ {successMsg}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-zinc-800 tracking-wide">Nama Lengkap</label>
                            <input
                                type="text"
                                required
                                placeholder="Masukkan Nama Lengkap"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                disabled={loading}
                                className="w-full px-5 py-3.5 bg-white text-zinc-900 placeholder-zinc-400 border border-zinc-200/50 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8EBA85]/50 focus:border-[#8EBA85] transition-all text-sm font-medium"
                            />
                        </div>

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

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-zinc-800 tracking-wide">Kata Sandi</label>
                            <div className="relative w-full flex items-center">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="Buat Kata Sandi"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    className="w-full px-5 py-3.5 bg-white text-zinc-900 placeholder-zinc-400 border border-zinc-200/50 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8EBA85]/50 focus:border-[#8EBA85] transition-all text-sm font-medium pr-14"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 p-1 text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none select-none text-lg"
                                    title={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        <div className="pt-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-[#98BA81] text-white font-bold text-base shadow-lg shadow-[#98BA81]/30 hover:bg-[#85ab6e] hover:scale-[1.01] active:scale-[0.99] disabled:bg-zinc-400 disabled:scale-100 transition-all duration-200"
                            >
                                {loading ? "Mendaftarkan..." : "Daftar"}
                            </button>
                        </div>
                    </form>

                    <div className="text-center text-sm font-bold text-zinc-800 pt-2">
                        Udah punya akun ?{" "}
                        <Link href="/login" className="text-[#436e35] hover:underline underline-offset-4">
                            Login disini
                        </Link>
                    </div>
                </div>

            </main>
        </div>
    );
}