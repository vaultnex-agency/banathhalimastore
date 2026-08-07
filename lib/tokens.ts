// ─── Brand Design Tokens ────────────────────────────────────────────────────
// Single source of truth for Banat Halima visual identity.

export const brand = {
  name: "Banat Halima",
  nameArabic: "بنات حليمة",
  tagline: "Timeless Elegance, Crafted for You",

  colors: {
    primary: "#0F0F0F",       // deep black — typography & UI
    accent: "#C9A96E",        // warm gold — highlights & badges
    accentLight: "#F5EDD8",   // gold tint — backgrounds
    surface: "#FAFAF9",       // warm off-white — page bg
    muted: "#F4F4F3",         // soft grey — card bg
    border: "#E8E8E6",        // grey borders
    text: "#1A1A1A",          // body text
    textMuted: "#6B6B6B",     // secondary text
    error: "#DC2626",
    success: "#16A34A",
  },

  fonts: {
    heading: "var(--font-cormorant)",   // Cormorant Garamond — luxury serif
    body: "var(--font-inter)",          // Inter — clean sans-serif
  },
} as const;
