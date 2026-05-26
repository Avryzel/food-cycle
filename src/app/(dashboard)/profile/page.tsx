"use client";

import { useState } from "react";

export default function ProfilePage() {
    const [userProfile, setUserProfile] = useState({
        name: "Huh Yunjin",
        email: "HuhYunjin@foodcycle.com",
        joinDate: "Mei 2026",
        rank: "Penyelamat Makanan Handal 🏅",
        stats: {
            recipesCooked: 34,
            savedWeightKg: 12.5,
            impactPercent: 92
        }
    });

    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(userProfile.name);
    const [tempEmail, setTempEmail] = useState(userProfile.email);

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        setUserProfile((prev) => ({
            ...prev,
            name: tempName,
            email: tempEmail
        }));
        setIsEditing(false);
    };

    const handleCancelChanges = () => {
        setTempName(userProfile.name);
        setTempEmail(userProfile.email);
        setIsEditing(false);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 md:space-y-10 animate-fade-in pb-10 px-4 sm:px-0">

            <div className="space-y-1">
                <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Profil Saya</h1>
                <p className="text-zinc-500 text-sm md:text-base font-semibold leading-relaxed">
                    Pantau statistik kontribusi dan pencapaian penyelamatan panganmu
                </p>
            </div>

            <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-zinc-100/40 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-[#8EBA85]" />

                {!isEditing ? (
                    <div className="flex flex-col items-center md:flex-row md:justify-between md:gap-8 text-center md:text-left">
                        <div className="flex flex-col items-center md:flex-row gap-6 md:gap-8">
                            <div className="w-28 h-28 rounded-full bg-[#EAF5E9] border border-[#8EBA85] flex items-center justify-center text-4xl font-bold text-[#5F8A57] shadow-inner select-none shrink-0">
                                {userProfile.name.charAt(0)}
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-0.5">
                                    <h2 className="text-3xl font-black text-zinc-900 tracking-tight">{userProfile.name}</h2>
                                    <p className="text-zinc-400 text-sm font-semibold">{userProfile.email}</p>
                                </div>
                                <div className="inline-flex items-center justify-center bg-zinc-50 border border-zinc-100 px-4 py-2 rounded-2xl text-xs font-black text-zinc-600 select-none">
                                    {userProfile.rank}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center md:items-end gap-3 mt-4 md:mt-0 md:self-start md:pt-2">
                            <span className="text-xs font-bold text-zinc-400">
                                Member sejak {userProfile.joinDate}
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-black rounded-xl shadow-sm transition-all active:scale-[0.98]"
                            >
                                Edit Akun ✏️
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSaveChanges} className="space-y-5 animate-scale-up">
                        <div className="border-b border-zinc-100 pb-3">
                            <h3 className="text-lg font-black text-zinc-900 tracking-tight">Perbarui Informasi Akun</h3>
                            <p className="text-zinc-400 text-xs font-semibold">Ubah identitas dasar profil kamu secara instan</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-500 ml-1">Nama Pengguna</label>
                                <input
                                    type="text"
                                    required
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-zinc-900 font-semibold text-sm focus:outline-none focus:border-[#8EBA85] focus:ring-2 focus:ring-[#8EBA85]/20 transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-500 ml-1">Alamat Email</label>
                                <input
                                    type="email"
                                    required
                                    value={tempEmail}
                                    onChange={(e) => setTempEmail(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-zinc-900 font-semibold text-sm focus:outline-none focus:border-[#8EBA85] focus:ring-2 focus:ring-[#8EBA85]/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                            <button
                                type="button"
                                onClick={handleCancelChanges}
                                className="px-4 py-2.5 text-xs font-bold text-zinc-500 hover:text-zinc-800 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-[#8EBA85] hover:bg-[#7da874] text-white text-xs font-black rounded-xl shadow-sm shadow-[#8EBA85]/10 transition-all active:scale-[0.98]"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className="space-y-4">
                <h3 className="text-base font-black text-zinc-800 tracking-tight ml-1">Pencapaian Dapur</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-white border border-zinc-50 rounded-[2rem] p-8 text-center shadow-lg shadow-zinc-100/60 flex flex-col justify-center min-h-[140px] space-y-1.5">
                        <span className="text-4xl font-black text-zinc-900 tracking-tight">{userProfile.stats.recipesCooked}</span>
                        <span className="text-zinc-400 text-xs font-black uppercase tracking-widest">Resep Dimasak</span>
                    </div>

                    <div className="bg-white border border-zinc-50 rounded-[2rem] p-8 text-center shadow-lg shadow-zinc-100/60 flex flex-col justify-center min-h-[140px] space-y-1.5">
                        <span className="text-4xl font-black text-[#5F8A57] tracking-tight">{userProfile.stats.savedWeightKg} kg</span>
                        <span className="text-zinc-400 text-xs font-black uppercase tracking-widest">Sampah Ditekan</span>
                    </div>

                    <div className="bg-white border border-zinc-50 rounded-[2rem] p-8 text-center shadow-lg shadow-zinc-100/60 flex flex-col justify-center min-h-[140px] space-y-1.5">
                        <span className="text-4xl font-black text-zinc-900 tracking-tight">+{userProfile.stats.impactPercent}%</span>
                        <span className="text-zinc-400 text-xs font-black uppercase tracking-widest">Efisiensi Stok</span>
                    </div>
                </div>
            </div>

        </div>
    );
}