import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian:     "#0A0A0A",
        "obsidian-2": "#111008",
        "amber-tan":  "#C9A84C",
        "amber-light":"#D4B460",
        "amber-dark": "#B8943A",
        "linen-cream":"#F0E6D3",
        "off-white":  "#F0E6D3",
        charcoal:     "#1A1810",
        "charcoal-2": "#141208",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        dm:       ["var(--font-dm)", "sans-serif"],
      },
      backgroundImage: {
        "amber-gradient": "linear-gradient(135deg, #D4B460 0%, #C9A84C 50%, #B8943A 100%)",
        "dark-gradient":  "linear-gradient(145deg, #141208 0%, #0A0A0A 100%)",
        "glass-shine":    "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
      },
      boxShadow: {
        "amber-glow":    "0 4px 24px rgba(201,168,76,0.4)",
        "amber-glow-lg": "0 8px 40px rgba(201,168,76,0.5)",
        "glass":         "inset 0 1px 0 rgba(201,168,76,0.08), 0 8px 32px rgba(0,0,0,0.6)",
        "glass-sm":      "inset 0 1px 0 rgba(201,168,76,0.06), 0 4px 16px rgba(0,0,0,0.4)",
      },
      keyframes: {
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0"  },
        },
        "float-up": {
          "0%, 100%": { transform: "translateY(0)"   },
          "50%":      { transform: "translateY(-6px)" },
        },
        "pulse-amber": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201,168,76,0.4)"  },
          "50%":      { boxShadow: "0 0 0 8px rgba(201,168,76,0)"  },
        },
      },
      animation: {
        shimmer:       "shimmer 2.5s infinite linear",
        "float-up":    "float-up 3s ease-in-out infinite",
        "pulse-amber": "pulse-amber 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
