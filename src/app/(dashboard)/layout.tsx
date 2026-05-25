"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    const menuItems = [
        { name: "Inventory", href: "/inventory", icon: "📦" },
        { name: "Masak", href: "/cook", icon: "🍳" },
        { name: "Resep", href: "/recipes", icon: "📖" },
        { name: "Statistik", href: "/stats", icon: "📊" },
        { name: "Pengaturan", href: "/settings", icon: "⚙️" },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full justify-between p-6 text-white">
            <div className="space-y-8">
                <div className="text-2xl font-extrabold tracking-wider flex items-center gap-2 px-3">
                    FoodCycle ♻️
                </div>

                <nav className="space-y-1.5">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold tracking-wide transition-all duration-200 ${isActive
                                    ? "bg-white text-[#8EBA85] shadow-md shadow-emerald-900/10"
                                    : "text-white/80 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                <span className="text-base">{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-[2rem] p-4 flex items-center gap-3 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden flex-shrink-0 border-2 border-white/20">
                    <img
                        src="/images/avatar.png"
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80";
                        }}
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold truncate">Huh Yunjin</p>
                    <Link href="/profile" className="text-[11px] font-medium text-white/60 hover:text-white transition-colors block mt-0.5">
                        Lihat Profile →
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-[#F4F9F4] flex relative font-sans antialiased">
            <aside className="hidden lg:block w-64 bg-[#8EBA85] fixed h-screen top-0 left-0 border-r border-emerald-100/10 shadow-xl shadow-emerald-900/5">
                <SidebarContent />
            </aside>

            <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
                <aside className={`absolute top-0 left-0 w-64 bg-[#8EBA85] h-full shadow-2xl transition-transform duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <SidebarContent />
                </aside>
            </div>

            <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
                <header className="w-full bg-[#8EBA85] border-b border-emerald-600/10 px-6 py-4 flex items-center justify-between lg:hidden sticky top-0 z-40 shadow-md shadow-emerald-900/5">
                    <div className="text-lg font-black text-white tracking-wide">FoodCycle ♻️</div>
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -mr-2 text-white/90 hover:text-white focus:outline-none text-xl transition-colors"
                        title="Buka Menu Navigasi"
                    >
                        🍔
                    </button>
                </header>

                <div className="p-4 sm:p-8 lg:p-10 flex-1 w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}