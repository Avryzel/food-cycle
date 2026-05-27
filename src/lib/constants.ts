export interface SubVariant {
    id: string;
    label: string;
}

export interface VariantOption {
    id: string;
    label: string;
    subVariants?: SubVariant[];
}

export interface MasterIngredient {
    id: string;
    name: string;
    image: string;
    defaultExpiryDays: number;
    variants: VariantOption[];
}

export const masterIngredientsDatabase: MasterIngredient[] = [
    {
        id: "telur", name: "Telur", image: "🥚", defaultExpiryDays: 14,
        variants: [{ id: "1", label: "Butir" }, { id: "2", label: "Kilogram" }]
    },
    {
        id: "ayam", name: "Daging Ayam", image: "🍗", defaultExpiryDays: 3,
        variants: [
            {
                id: "3", label: "Kilogram",
                subVariants: [{ id: "dada", label: "Fillet Dada" }, { id: "paha", label: "Potongan Paha" }, { id: "utuh", label: "Ayam Utuh" }]
            },
            { id: "4", label: "Bungkus" }
        ]
    },
    { id: "bayam", name: "Bayam", image: "🥬", defaultExpiryDays: 2, variants: [{ id: "5", label: "Ikat" }] },
    { id: "beras", name: "Beras", image: "🌾", defaultExpiryDays: 90, variants: [{ id: "6", label: "Kilogram" }] },
    { id: "susu", name: "Susu UHT", image: "🥛", defaultExpiryDays: 7, variants: [{ id: "7", label: "Liter" }, { id: "8", label: "Kotak" }] },
];