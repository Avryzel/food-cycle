"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LandingPage() {
    const router = useRouter();

    const handleStartJourney = async () => {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            router.push("/inventory");
        } else {
            router.push("/login");
        }
    };

    return (
        <div
            className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col justify-between transition-all duration-300 relative"
            style={{ backgroundImage: "var(--bg-image)" }}
        >
            <style dangerouslySetInnerHTML={{
                __html: `
        div { 
          --bg-image: url('/images/landing_page_mobile.jpeg'); 
        }
        @media (min-width: 768px) {
          div { 
            --bg-image: url('/images/landing_page_desktop.jpeg'); 
          }
        }
      `}} />

            <div className="h-8 md:h-12 w-full" />

            <main className="max-w-7xl w-full mx-auto px-4 sm:px-12 lg:px-24 flex-1 flex items-center justify-center md:justify-start relative z-10">

                <div className="p-6 sm:p-8 md:p-0 rounded-3xl bg-white/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border border-white/20 md:border-none shadow-xl shadow-zinc-900/5 md:shadow-none max-w-xl text-center md:text-left flex flex-col items-center md:items-start mx-4 sm:mx-0">

                    <div className="text-lg md:text-xl font-extrabold text-[#719E65] md:text-[#8EBA85] tracking-wider uppercase flex items-center justify-center md:justify-start gap-2">
                        FoodCycle ♻️
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#41613A] md:text-[#8EBA85] leading-[1.15] mt-2">
                        Kurangin Food Waste menggunakan AI
                    </h1>

                    <p className="text-zinc-700 md:text-zinc-600 text-sm sm:text-lg leading-relaxed max-w-md mt-4 font-medium">
                        Masukan bahan makanan dirumahmu dan dapatkan resep otomatis dari AI
                    </p>

                    <div className="pt-6 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={handleStartJourney}
                            className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#8EBA85] text-white font-semibold text-base shadow-lg shadow-[#8EBA85]/30 hover:bg-[#7da874] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                        >
                            Mulai Sekarang →
                        </button>
                    </div>
                </div>
            </main>

            <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-zinc-500 font-semibold relative z-10">
                © 2026 FoodCycle Team. All rights reserved.
            </footer>
        </div>
    );
}