"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ALL_PRODUCTS, formatNGN } from "@/lib/products";
import { createClient } from "@/lib/supabase/client";

const IMAGES: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=120&q=70",
  2: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=120&q=70",
  3: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=120&q=70",
  4: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=120&q=70",
  5: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=120&q=70",
  6: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=120&q=70",
  7: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=120&q=70",
  8: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=120&q=70",
  9: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=120&q=70",
  10: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=120&q=70",
  11: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=120&q=70",
  12: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=120&q=70",
  13: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=120&q=70",
  14: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=120&q=70",
  15: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=120&q=70",
  16: "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=120&q=70",
  17: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=120&q=70",
  18: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=120&q=70",
  19: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=120&q=70",
  20: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=120&q=70",
  21: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=120&q=70",
  22: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&q=70",
  23: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=120&q=70",
  24: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&q=70",
  25: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=120&q=70",
  26: "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=120&q=70",
  27: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=120&q=70",
  28: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=120&q=70",
};

type Result = {
  id: number;
  name: string;
  gender: string;
  subtype: string;
  price: number;
  image?: string;
};

interface Props { open: boolean; onClose: () => void; }

export default function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const search = useCallback(async (q: string) => {
    const trimmed = q.trim().toLowerCase();
    if (trimmed.length < 2) { setResults([]); setSearched(false); return; }

    setSearching(true);
    setSearched(false);

    // 1. Search local catalogue first (instant)
    const local = ALL_PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(trimmed) ||
      p.subtype.toLowerCase().includes(trimmed) ||
      p.gender.toLowerCase().includes(trimmed) ||
      p.type.toLowerCase().includes(trimmed)
    ).slice(0, 6).map((p) => ({
      id: p.id,
      name: p.name,
      gender: p.gender,
      subtype: p.subtype,
      price: p.price,
      image: IMAGES[p.id],
    }));

    // 2. Also check Supabase products table if it exists
    try {
      const { data } = await supabase
        .from("products")
        .select("id, name, gender, subtype, price, image_url")
        .or(`name.ilike.%${trimmed}%,subtype.ilike.%${trimmed}%`)
        .limit(6);

      if (data && data.length > 0) {
        // Merge — avoid duplicates by id
        const localIds = new Set(local.map((p) => p.id));
        const remote = data
          .filter((p: { id: number }) => !localIds.has(p.id))
          .map((p: { id: number; name: string; gender: string; subtype: string; price: number; image_url?: string }) => ({
            id: p.id,
            name: p.name,
            gender: p.gender,
            subtype: p.subtype,
            price: p.price,
            image: p.image_url,
          }));
        setResults([...local, ...remote].slice(0, 6));
      } else {
        setResults(local);
      }
    } catch {
      // Supabase products table may not exist — use local only
      setResults(local);
    }

    setSearching(false);
    setSearched(true);
  }, []);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => search(query), 280);
    return () => clearTimeout(t);
  }, [query, search]);

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 80); setQuery(""); setResults([]); setSearched(false); }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
  }

  const showEmpty = searched && !searching && results.length === 0 && query.trim().length >= 2;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-obsidian/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.22 }}
            className="fixed top-[68px] left-0 right-0 z-[151] bg-white shadow-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="max-w-2xl mx-auto px-6 py-5">
              {/* Input */}
              <form onSubmit={handleSearch} className="flex items-center gap-3 border-b border-charcoal/12 pb-4">
                {searching
                  ? <Loader2 size={18} className="text-amber-tan shrink-0 animate-spin" />
                  : <Search size={18} className="text-charcoal/35 shrink-0" />
                }
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, styles, categories..."
                  className="flex-1 font-dm text-base text-charcoal placeholder:text-charcoal/30 focus:outline-none bg-transparent"
                />
                {query && (
                  <button type="button" onClick={() => { setQuery(""); setResults([]); setSearched(false); }}
                    className="text-charcoal/30 hover:text-charcoal transition-colors">
                    <X size={16} />
                  </button>
                )}
              </form>

              {/* Results */}
              {results.length > 0 && (
                <ul className="py-3 space-y-1">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link href={`/product/${p.id}`} onClick={onClose}
                        className="flex items-center gap-4 px-2 py-2.5 rounded-sm hover:bg-off-white transition-colors group">
                        <div className="w-12 h-14 shrink-0 overflow-hidden bg-stone-100 rounded-sm">
                          {p.image ? (
                            <Image src={p.image} alt={p.name} width={48} height={56}
                              className="w-full h-full object-cover object-center" />
                          ) : (
                            <div className="w-full h-full bg-stone-200" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-dm text-sm font-medium text-charcoal group-hover:text-amber-tan transition-colors truncate">{p.name}</p>
                          <p className="font-dm text-xs text-charcoal/40 mt-0.5 capitalize">{p.gender} · {p.subtype}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-dm text-sm text-charcoal">{formatNGN(p.price)}</p>
                          <ArrowRight size={13} className="text-amber-tan ml-auto mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                    </li>
                  ))}
                  {/* View all results */}
                  <li className="pt-2 border-t border-charcoal/8">
                    <button onClick={() => { onClose(); router.push(`/shop?q=${encodeURIComponent(query.trim())}`); }}
                      className="w-full flex items-center justify-between px-2 py-2 font-dm text-xs text-amber-tan hover:text-charcoal transition-colors">
                      <span>View all results for &ldquo;{query}&rdquo;</span>
                      <ArrowRight size={13} />
                    </button>
                  </li>
                </ul>
              )}

              {/* Not found */}
              {showEmpty && (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-charcoal/5 flex items-center justify-center mx-auto mb-4">
                    <Search size={20} className="text-charcoal/20" />
                  </div>
                  <p className="font-dm text-xl text-charcoal mb-1">No products found</p>
                  <p className="font-dm text-sm text-charcoal/40 mb-5">
                    We couldn&apos;t find anything matching &ldquo;{query}&rdquo;
                  </p>
                  <Link href="/shop" onClick={onClose}
                    className="inline-flex items-center gap-2 font-dm text-xs text-amber-tan border border-amber-tan px-5 py-2.5 hover:bg-amber-tan hover:text-obsidian transition-colors">
                    Browse All Products <ArrowRight size={12} />
                  </Link>
                </div>
              )}

              {/* Default state — popular searches */}
              {!query && (
                <div className="py-6">
                  <p className="font-dm text-[10px] text-charcoal/35 uppercase tracking-widest mb-3">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {["Trench Coat", "Sneakers", "Dresses", "Boots", "Hoodies", "Co-ords"].map((s) => (
                      <button key={s} onClick={() => setQuery(s)}
                        className="font-dm text-xs text-charcoal/60 border border-charcoal/15 px-3 py-1.5 rounded-full hover:border-amber-tan hover:text-amber-tan transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
