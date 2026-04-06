export type Gender = "men" | "women" | "teens" | "kids";
export type ProductType = "clothing" | "footwear";

export interface Product {
  id: number;
  name: string;
  gender: Gender;
  type: ProductType;
  subtype: string;
  price: number;
  colors: string[];
  sizes: string[];
  tag?: string;
  bg: string;
  bg2: string;
}

// ─── Filter config ─────────────────────────────────────────────────────────────

export const SUBTYPES: Record<string, string[]> = {
  "men-clothing":   ["T-Shirts", "Shirts", "Hoodies", "Trousers", "Jackets"],
  "men-footwear":   ["Sneakers", "Boots", "Loafers", "Sandals", "Formal"],
  "women-clothing": ["Tops", "Dresses", "Co-ords", "Trousers", "Blazers"],
  "women-footwear": ["Heels", "Sneakers", "Boots", "Flats", "Mules"],
  "teens-clothing": ["T-Shirts", "Hoodies", "Joggers", "Dresses", "Jackets"],
  "teens-footwear": ["Sneakers", "Boots", "Sandals", "Slides"],
  "kids-clothing":  ["T-Shirts", "Sets", "Hoodies", "Shorts", "Dresses"],
  "kids-footwear":  ["Sneakers", "Sandals", "Boots", "Slippers"],
  "all-clothing":   ["T-Shirts", "Shirts", "Hoodies", "Trousers", "Jackets", "Tops", "Dresses", "Co-ords", "Blazers", "Joggers", "Sets", "Shorts", "Slides"],
  "all-footwear":   ["Sneakers", "Boots", "Loafers", "Sandals", "Formal", "Heels", "Flats", "Mules", "Slides", "Slippers"],
};

export const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
export const TEEN_CLOTHING_SIZES = ["8Y", "10Y", "12Y", "14Y", "16Y"];
export const KIDS_CLOTHING_SIZES = ["2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y"];
export const SHOE_SIZES     = ["EU 35","EU 36","EU 37","EU 38","EU 39","EU 40","EU 41","EU 42","EU 43","EU 44","EU 45","EU 46","EU 47"];
export const TEEN_SHOE_SIZES = ["EU 35","EU 36","EU 37","EU 38","EU 39","EU 40"];
export const KIDS_SHOE_SIZES = ["EU 24","EU 25","EU 26","EU 27","EU 28","EU 29","EU 30","EU 31","EU 32"];

export const COLORS: { name: string; hex: string }[] = [
  { name: "Black",  hex: "#1a1a1a" },
  { name: "White",  hex: "#f5f5f5" },
  { name: "Tan",    hex: "#B5906A" },
  { name: "Cream",  hex: "#F0E6D3" },
  { name: "Navy",   hex: "#1B2A4A" },
  { name: "Olive",  hex: "#6B6B3A" },
  { name: "Rust",   hex: "#A0522D" },
  { name: "Grey",   hex: "#9E9E9E" },
  { name: "Pink",   hex: "#F4A7B9" },
  { name: "Yellow", hex: "#F5D76E" },
  { name: "Red",    hex: "#C0392B" },
  { name: "Blue",   hex: "#3B82F6" },
];

export const PRICE_MIN = 5000;
export const PRICE_MAX = 250000;

// ─── Product catalogue ─────────────────────────────────────────────────────────

export const ALL_PRODUCTS: Product[] = [
  // ── Men Clothing ──────────────────────────────────────────────────────────────
  { id: 1,  name: "Obsidian Trench Coat",      gender: "men",   type: "clothing", subtype: "Jackets",   price: 89500,  colors: ["Black","Navy"],          sizes: ["S","M","L","XL"],              tag: "New",       bg: "bg-zinc-200",  bg2: "bg-zinc-300"  },
  { id: 2,  name: "Linen Relaxed Shirt",        gender: "men",   type: "clothing", subtype: "Shirts",    price: 32000,  colors: ["White","Cream","Olive"],  sizes: ["S","M","L","XL","2XL"],        tag: "Bestseller",bg: "bg-stone-200", bg2: "bg-stone-300" },
  { id: 3,  name: "Heavyweight Hoodie",         gender: "men",   type: "clothing", subtype: "Hoodies",   price: 47500,  colors: ["Black","Grey"],           sizes: ["S","M","L","XL","2XL","3XL"], tag: "New",       bg: "bg-slate-200", bg2: "bg-slate-300" },
  { id: 4,  name: "Wide-Leg Cargo Trousers",    gender: "men",   type: "clothing", subtype: "Trousers",  price: 41000,  colors: ["Olive","Black"],          sizes: ["S","M","L","XL"],              tag: "New",       bg: "bg-stone-300", bg2: "bg-stone-400" },
  { id: 5,  name: "Washed Graphic Tee",         gender: "men",   type: "clothing", subtype: "T-Shirts",  price: 18500,  colors: ["White","Black","Grey"],   sizes: ["XS","S","M","L","XL"],         tag: undefined,   bg: "bg-amber-100", bg2: "bg-amber-200" },
  { id: 6,  name: "Structured Blazer",          gender: "men",   type: "clothing", subtype: "Jackets",   price: 76000,  colors: ["Navy","Black"],           sizes: ["S","M","L","XL"],              tag: "Limited",   bg: "bg-zinc-300",  bg2: "bg-zinc-400"  },
  { id: 7,  name: "Slim Chino Trousers",        gender: "men",   type: "clothing", subtype: "Trousers",  price: 29500,  colors: ["Tan","Cream","Navy"],     sizes: ["S","M","L","XL","2XL"],        tag: undefined,   bg: "bg-amber-50",  bg2: "bg-amber-100" },
  { id: 8,  name: "Ribbed Knit Polo",           gender: "men",   type: "clothing", subtype: "T-Shirts",  price: 24000,  colors: ["White","Rust"],           sizes: ["S","M","L","XL"],              tag: "New",       bg: "bg-stone-100", bg2: "bg-stone-200" },

  // ── Men Footwear ──────────────────────────────────────────────────────────────
  { id: 9,  name: "Suede Chelsea Boots",        gender: "men",   type: "footwear", subtype: "Boots",     price: 68000,  colors: ["Tan","Black"],            sizes: ["EU 40","EU 41","EU 42","EU 43","EU 44"],              tag: "Bestseller",bg: "bg-amber-200", bg2: "bg-amber-300" },
  { id: 10, name: "Low-Top Canvas Sneakers",    gender: "men",   type: "footwear", subtype: "Sneakers",  price: 29500,  colors: ["White","Black"],          sizes: ["EU 39","EU 40","EU 41","EU 42","EU 43","EU 44"],       tag: "New",       bg: "bg-stone-100", bg2: "bg-stone-200" },
  { id: 11, name: "Leather Derby Shoes",        gender: "men",   type: "footwear", subtype: "Formal",    price: 54000,  colors: ["Black","Tan"],            sizes: ["EU 40","EU 41","EU 42","EU 43","EU 44","EU 45"],       tag: undefined,   bg: "bg-zinc-200",  bg2: "bg-zinc-300"  },
  { id: 12, name: "Slip-On Loafers",            gender: "men",   type: "footwear", subtype: "Loafers",   price: 38500,  colors: ["Tan","Navy"],             sizes: ["EU 39","EU 40","EU 41","EU 42","EU 43"],              tag: "New",       bg: "bg-amber-100", bg2: "bg-amber-200" },
  { id: 13, name: "Chunky Sole Boots",          gender: "men",   type: "footwear", subtype: "Boots",     price: 79000,  colors: ["Black"],                  sizes: ["EU 40","EU 41","EU 42","EU 43","EU 44","EU 45"],       tag: "Limited",   bg: "bg-slate-300", bg2: "bg-slate-400" },
  { id: 14, name: "Leather Sandals",            gender: "men",   type: "footwear", subtype: "Sandals",   price: 22000,  colors: ["Tan","Black"],            sizes: ["EU 39","EU 40","EU 41","EU 42","EU 43","EU 44"],       tag: undefined,   bg: "bg-stone-200", bg2: "bg-stone-300" },

  // ── Women Clothing ────────────────────────────────────────────────────────────
  { id: 15, name: "Silk Wrap Dress",            gender: "women", type: "clothing", subtype: "Dresses",   price: 61500,  colors: ["Cream","Rust","Black"],   sizes: ["XS","S","M","L","XL"],         tag: "New",       bg: "bg-rose-100",  bg2: "bg-rose-200"  },
  { id: 16, name: "Linen Co-ord Set",           gender: "women", type: "clothing", subtype: "Co-ords",   price: 55000,  colors: ["Cream","Olive"],          sizes: ["XS","S","M","L"],              tag: "Bestseller",bg: "bg-amber-100", bg2: "bg-amber-200" },
  { id: 17, name: "Oversized Blazer",           gender: "women", type: "clothing", subtype: "Blazers",   price: 72000,  colors: ["Black","Cream"],          sizes: ["XS","S","M","L","XL"],         tag: "New",       bg: "bg-zinc-200",  bg2: "bg-zinc-300"  },
  { id: 18, name: "Ribbed Crop Top",            gender: "women", type: "clothing", subtype: "Tops",      price: 15500,  colors: ["White","Black","Rust"],   sizes: ["XS","S","M","L"],              tag: undefined,   bg: "bg-stone-100", bg2: "bg-stone-200" },
  { id: 19, name: "Wide-Leg Linen Trousers",    gender: "women", type: "clothing", subtype: "Trousers",  price: 39500,  colors: ["Cream","Olive","Navy"],   sizes: ["XS","S","M","L","XL"],         tag: "New",       bg: "bg-amber-50",  bg2: "bg-amber-100" },
  { id: 20, name: "Satin Slip Dress",           gender: "women", type: "clothing", subtype: "Dresses",   price: 48000,  colors: ["Black","Cream"],          sizes: ["XS","S","M","L"],              tag: "Limited",   bg: "bg-slate-200", bg2: "bg-slate-300" },
  { id: 21, name: "Knit Cardigan",              gender: "women", type: "clothing", subtype: "Tops",      price: 34000,  colors: ["Cream","Grey","Rust"],    sizes: ["XS","S","M","L","XL"],         tag: "New",       bg: "bg-stone-200", bg2: "bg-stone-300" },
  { id: 22, name: "Tailored Shorts Co-ord",     gender: "women", type: "clothing", subtype: "Co-ords",   price: 44500,  colors: ["Black","Tan"],            sizes: ["XS","S","M","L"],              tag: undefined,   bg: "bg-zinc-100",  bg2: "bg-zinc-200"  },

  // ── Women Footwear ────────────────────────────────────────────────────────────
  { id: 23, name: "Strappy Heeled Mules",       gender: "women", type: "footwear", subtype: "Mules",     price: 51500,  colors: ["Tan","Black"],            sizes: ["EU 35","EU 36","EU 37","EU 38","EU 39","EU 40"],       tag: "New",       bg: "bg-amber-200", bg2: "bg-amber-300" },
  { id: 24, name: "Cream Leather Sneakers",     gender: "women", type: "footwear", subtype: "Sneakers",  price: 54000,  colors: ["White","Cream"],          sizes: ["EU 35","EU 36","EU 37","EU 38","EU 39","EU 40","EU 41"],tag: "Bestseller",bg: "bg-stone-100", bg2: "bg-stone-200" },
  { id: 25, name: "Block Heel Boots",           gender: "women", type: "footwear", subtype: "Boots",     price: 67500,  colors: ["Black","Tan"],            sizes: ["EU 35","EU 36","EU 37","EU 38","EU 39","EU 40"],       tag: "New",       bg: "bg-zinc-200",  bg2: "bg-zinc-300"  },
  { id: 26, name: "Pointed Toe Flats",          gender: "women", type: "footwear", subtype: "Flats",     price: 28000,  colors: ["Black","Cream","Tan"],    sizes: ["EU 35","EU 36","EU 37","EU 38","EU 39","EU 40","EU 41"],tag: undefined,   bg: "bg-amber-50",  bg2: "bg-amber-100" },
  { id: 27, name: "Kitten Heel Mules",          gender: "women", type: "footwear", subtype: "Mules",     price: 43000,  colors: ["Cream","Rust"],           sizes: ["EU 35","EU 36","EU 37","EU 38","EU 39","EU 40"],       tag: "New",       bg: "bg-rose-100",  bg2: "bg-rose-200"  },
  { id: 28, name: "Ankle Strap Heels",          gender: "women", type: "footwear", subtype: "Heels",     price: 58000,  colors: ["Black","Tan"],            sizes: ["EU 35","EU 36","EU 37","EU 38","EU 39","EU 40"],       tag: "Limited",   bg: "bg-slate-200", bg2: "bg-slate-300" },

  // ── Teens Clothing ────────────────────────────────────────────────────────────
  { id: 29, name: "Oversized Logo Hoodie",      gender: "teens", type: "clothing", subtype: "Hoodies",   price: 28500,  colors: ["Black","Grey","Navy"],    sizes: ["10Y","12Y","14Y","16Y"],        tag: "New",       bg: "bg-slate-200", bg2: "bg-slate-300" },
  { id: 30, name: "Graphic Print Tee",          gender: "teens", type: "clothing", subtype: "T-Shirts",  price: 12500,  colors: ["White","Black","Rust"],   sizes: ["8Y","10Y","12Y","14Y","16Y"],   tag: undefined,   bg: "bg-amber-100", bg2: "bg-amber-200" },
  { id: 31, name: "Slim Jogger Pants",          gender: "teens", type: "clothing", subtype: "Joggers",   price: 19500,  colors: ["Black","Grey","Olive"],   sizes: ["10Y","12Y","14Y","16Y"],        tag: "Bestseller",bg: "bg-stone-200", bg2: "bg-stone-300" },
  { id: 32, name: "Denim Jacket",               gender: "teens", type: "clothing", subtype: "Jackets",   price: 35000,  colors: ["Navy","Black"],           sizes: ["10Y","12Y","14Y","16Y"],        tag: "New",       bg: "bg-zinc-200",  bg2: "bg-zinc-300"  },
  { id: 33, name: "Floral Mini Dress",          gender: "teens", type: "clothing", subtype: "Dresses",   price: 22000,  colors: ["Cream","Pink","Rust"],    sizes: ["8Y","10Y","12Y","14Y","16Y"],   tag: "New",       bg: "bg-rose-100",  bg2: "bg-rose-200"  },
  { id: 34, name: "Cargo Jogger Set",           gender: "teens", type: "clothing", subtype: "Joggers",   price: 31000,  colors: ["Olive","Black"],          sizes: ["10Y","12Y","14Y","16Y"],        tag: "Limited",   bg: "bg-stone-300", bg2: "bg-stone-400" },

  // ── Teens Footwear ────────────────────────────────────────────────────────────
  { id: 35, name: "High-Top Canvas Sneakers",   gender: "teens", type: "footwear", subtype: "Sneakers",  price: 21500,  colors: ["White","Black","Navy"],   sizes: ["EU 35","EU 36","EU 37","EU 38","EU 39","EU 40"],       tag: "New",       bg: "bg-stone-100", bg2: "bg-stone-200" },
  { id: 36, name: "Chunky Platform Boots",      gender: "teens", type: "footwear", subtype: "Boots",     price: 34000,  colors: ["Black","Tan"],            sizes: ["EU 35","EU 36","EU 37","EU 38","EU 39"],               tag: "Bestseller",bg: "bg-zinc-200",  bg2: "bg-zinc-300"  },
  { id: 37, name: "Sporty Slide Sandals",       gender: "teens", type: "footwear", subtype: "Slides",    price: 11000,  colors: ["Black","White","Navy"],   sizes: ["EU 35","EU 36","EU 37","EU 38","EU 39","EU 40"],       tag: undefined,   bg: "bg-amber-100", bg2: "bg-amber-200" },
  { id: 38, name: "Lace-Up Ankle Boots",        gender: "teens", type: "footwear", subtype: "Boots",     price: 29500,  colors: ["Black","Tan"],            sizes: ["EU 35","EU 36","EU 37","EU 38","EU 39","EU 40"],       tag: "New",       bg: "bg-slate-200", bg2: "bg-slate-300" },

  // ── Kids Clothing ─────────────────────────────────────────────────────────────
  { id: 39, name: "Rainbow Stripe Tee",         gender: "kids",  type: "clothing", subtype: "T-Shirts",  price: 8500,   colors: ["White","Yellow","Pink"],  sizes: ["2Y","3Y","4Y","5Y","6Y","7Y","8Y"],                   tag: "New",       bg: "bg-yellow-100",bg2: "bg-yellow-200"},
  { id: 40, name: "Cosy Zip Hoodie",            gender: "kids",  type: "clothing", subtype: "Hoodies",   price: 14500,  colors: ["Navy","Grey","Pink"],     sizes: ["2Y","3Y","4Y","5Y","6Y","7Y","8Y"],                   tag: "Bestseller",bg: "bg-blue-100",  bg2: "bg-blue-200"  },
  { id: 41, name: "Play Shorts Set",            gender: "kids",  type: "clothing", subtype: "Sets",      price: 16000,  colors: ["Yellow","Blue","Red"],    sizes: ["2Y","3Y","4Y","5Y","6Y","7Y"],                        tag: undefined,   bg: "bg-amber-100", bg2: "bg-amber-200" },
  { id: 42, name: "Denim Dungarees",            gender: "kids",  type: "clothing", subtype: "Sets",      price: 19500,  colors: ["Navy","Black"],           sizes: ["2Y","3Y","4Y","5Y","6Y","7Y","8Y"],                   tag: "New",       bg: "bg-zinc-100",  bg2: "bg-zinc-200"  },
  { id: 43, name: "Floral Smock Dress",         gender: "kids",  type: "clothing", subtype: "Dresses",   price: 17000,  colors: ["Pink","Cream","Yellow"],  sizes: ["2Y","3Y","4Y","5Y","6Y","7Y","8Y"],                   tag: "New",       bg: "bg-rose-100",  bg2: "bg-rose-200"  },
  { id: 44, name: "Jogger & Tee Set",           gender: "kids",  type: "clothing", subtype: "Sets",      price: 15000,  colors: ["Grey","Navy","Red"],      sizes: ["2Y","3Y","4Y","5Y","6Y","7Y","8Y"],                   tag: undefined,   bg: "bg-slate-100", bg2: "bg-slate-200" },

  // ── Kids Footwear ─────────────────────────────────────────────────────────────
  { id: 45, name: "Velcro Strap Sneakers",      gender: "kids",  type: "footwear", subtype: "Sneakers",  price: 13500,  colors: ["White","Navy","Pink"],    sizes: ["EU 24","EU 25","EU 26","EU 27","EU 28","EU 29","EU 30"],tag: "New",       bg: "bg-stone-100", bg2: "bg-stone-200" },
  { id: 46, name: "Rubber Rain Boots",          gender: "kids",  type: "footwear", subtype: "Boots",     price: 16000,  colors: ["Yellow","Red","Navy"],    sizes: ["EU 24","EU 25","EU 26","EU 27","EU 28","EU 29","EU 30"],tag: "Bestseller",bg: "bg-yellow-100",bg2: "bg-yellow-200"},
  { id: 47, name: "Jelly Sandals",              gender: "kids",  type: "footwear", subtype: "Sandals",   price: 9000,   colors: ["Pink","Blue","Yellow"],   sizes: ["EU 24","EU 25","EU 26","EU 27","EU 28","EU 29","EU 30","EU 31","EU 32"], tag: undefined, bg: "bg-pink-100", bg2: "bg-pink-200" },
  { id: 48, name: "Cosy Slip-On Slippers",      gender: "kids",  type: "footwear", subtype: "Slippers",  price: 7500,   colors: ["Grey","Pink","Navy"],     sizes: ["EU 24","EU 25","EU 26","EU 27","EU 28","EU 29","EU 30"],tag: undefined,   bg: "bg-slate-100", bg2: "bg-slate-200" },
];

// ─── Filter + sort helpers ─────────────────────────────────────────────────────

export type SortKey = "newest" | "popular" | "price-asc" | "price-desc";

export interface FilterState {
  gender: Gender | "all";
  type: ProductType | "all";
  subtypes: string[];
  sizes: string[];
  colors: string[];
  priceMin: number;
  priceMax: number;
  sort: SortKey;
  page: number;
}

export const PAGE_SIZE = 9;

export function filterProducts(filters: FilterState): Product[] {
  let list = ALL_PRODUCTS.filter((p) => {
    if (filters.gender !== "all" && p.gender !== filters.gender) return false;
    if (filters.type   !== "all" && p.type   !== filters.type)   return false;
    if (filters.subtypes.length && !filters.subtypes.includes(p.subtype)) return false;
    if (filters.sizes.length   && !filters.sizes.some((s) => p.sizes.includes(s))) return false;
    if (filters.colors.length  && !filters.colors.some((c) => p.colors.includes(c))) return false;
    if (p.price < filters.priceMin || p.price > filters.priceMax) return false;
    return true;
  });
  if (filters.sort === "price-asc")  list = [...list].sort((a, b) => a.price - b.price);
  if (filters.sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  return list;
}

export function getSubtypesForFilter(gender: Gender | "all", type: ProductType | "all"): string[] {
  const key = `${gender}-${type}`;
  return SUBTYPES[key] ?? Array.from(new Set(Object.values(SUBTYPES).flat()));
}

export function formatNGN(amount: number): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
}

// ─── Slug → gender/type mapping ───────────────────────────────────────────────

export function slugToFilter(slug: string[]): { gender: Gender | "all"; type: ProductType | "all"; label: string } {
  const path = slug.join("/").toLowerCase();
  if (path === "men/clothing")    return { gender: "men",   type: "clothing", label: "Men's Clothing"   };
  if (path === "men/footwear")    return { gender: "men",   type: "footwear", label: "Men's Shoes"      };
  if (path === "women/clothing")  return { gender: "women", type: "clothing", label: "Women's Clothing" };
  if (path === "women/footwear")  return { gender: "women", type: "footwear", label: "Women's Shoes"    };
  if (path === "teens/clothing")  return { gender: "teens", type: "clothing", label: "Teens' Clothing"  };
  if (path === "teens/footwear")  return { gender: "teens", type: "footwear", label: "Teens' Shoes"     };
  if (path === "kids/clothing")   return { gender: "kids",  type: "clothing", label: "Kids' Clothing"   };
  if (path === "kids/footwear")   return { gender: "kids",  type: "footwear", label: "Kids' Shoes"      };
  if (path === "men")    return { gender: "men",   type: "all", label: "Men"   };
  if (path === "women")  return { gender: "women", type: "all", label: "Women" };
  if (path === "teens")  return { gender: "teens", type: "all", label: "Teens" };
  if (path === "kids")   return { gender: "kids",  type: "all", label: "Kids"  };
  return { gender: "all", type: "all", label: "Shop All" };
}
