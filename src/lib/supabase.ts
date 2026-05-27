import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: {
            getItem: (key) => {
                if (typeof window === "undefined") return null;
                const value = document.cookie.split("; ").find((row) => row.startsWith(`${key}=`))?.split("=")[1];
                return value ? decodeURIComponent(value) : window.localStorage.getItem(key);
            },
            setItem: (key, value) => {
                if (typeof window === "undefined") return;
                document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
                window.localStorage.setItem(key, value);
            },
            removeItem: (key) => {
                if (typeof window === "undefined") return;
                document.cookie = `${key}=; path=/; max-age=0`;
                window.localStorage.removeItem(key);
            },
        },
    },
})