"use client";
import { useCallback } from "react";
import { X } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import PriceSlider from "./PriceSlider";
import {
  FilterState, ProductType,
  CLOTHING_SIZES, SHOE_SIZES, COLORS,
  PRICE_MIN, PRICE_MAX, getSubtypesForFilter,
} from "@/lib/products";

interface Props {
  filters: FilterState;
  onClose?: () => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pb-5 mb-5">
      <p className="font-dm text-[10px] uppercase tracking-widest text-amber-tan mb-3">{title}</p>
      {children}
    </div>
  );
}

export default function FilterSidebar({ filters, onClose }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const push = useCallback((updates: Partial<FilterState>) => {
    const params = new URLSearchParams(searchParams.toString());
    const next = { ...filters, ...updates, page: 1 };

    const set = (k: string, v: string) => v ? params.set(k, v) : params.delete(k);
    const setArr = (k: string, v: string[]) => v.length ? params.set(k, v.join(",")) : params.delete(k);

    set("gender", next.gender === "all" ? "" : next.gender);
    set("type", next.type === "all" ? "" : next.type);
    setArr("subtypes", next.subtypes);
    setArr("sizes", next.sizes);
    setArr("colors", next.colors);
    set("priceMin", next.priceMin === PRICE_MIN ? "" : String(next.priceMin));
    set("priceMax", next.priceMax === PRICE_MAX ? "" : String(next.priceMax));
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [filters, pathname, router, searchParams]);

  const toggle = (key: "subtypes" | "sizes" | "colors", val: string) => {
    const arr = filters[key];
    push({ [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] });
  };

  const activeCount = filters.subtypes.length + filters.sizes.length + filters.colors.length +
    (filters.priceMin > PRICE_MIN || filters.priceMax < PRICE_MAX ? 1 : 0) +
    (filters.gender !== "all" ? 1 : 0) + (filters.type !== "all" ? 1 : 0);

  const subtypes = getSubtypesForFilter(filters.gender, filters.type);
  const sizes = filters.type === "footwear" ? SHOE_SIZES : filters.type === "clothing" ? CLOTHING_SIZES : [...CLOTHING_SIZES, ...SHOE_SIZES];

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="font-dm text-sm font-medium text-linen-cream">Filters</span>
          {activeCount > 0 && (
            <span className="bg-amber-tan text-obsidian text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {activeCount > 0 && (
            <button
              onClick={() => push({ gender: "all", type: "all", subtypes: [], sizes: [], colors: [], priceMin: PRICE_MIN, priceMax: PRICE_MAX })}
              className="font-dm text-xs text-linen-cream hover:text-amber-tan transition-colors underline"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="lg:hidden">
              <X size={18} className="text-linen-cream/40" />
            </button>
          )}
        </div>
      </div>

      {/* Gender */}
      <Section title="Gender">
        <div className="flex flex-wrap gap-2">
          {(["all", "men", "women", "teens", "kids"] as const).map((g) => (
            <button key={g} onClick={() => push({ gender: g, subtypes: [], sizes: [] })}
              className={`font-dm text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                filters.gender === g
                  ? "bg-amber-tan border-amber-tan text-obsidian"
                  : "border-amber-tan/20 text-linen-cream hover:border-amber-tan hover:text-amber-tan"
              }`}>
              {g === "all" ? "All" : g}
            </button>
          ))}
        </div>
      </Section>

      {/* Category */}
      <Section title="Category">
        <div className="flex flex-wrap gap-2">
          {(["all", "clothing", "footwear"] as const).map((t) => (
            <button key={t} onClick={() => push({ type: t as ProductType | "all", subtypes: [], sizes: [] })}
              className={`font-dm text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                filters.type === t
                  ? "bg-amber-tan border-amber-tan text-obsidian"
                  : "border-amber-tan/20 text-linen-cream hover:border-amber-tan hover:text-amber-tan"
              }`}>
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>
      </Section>

      {/* Type */}
      {subtypes.length > 0 && (
        <Section title="Type">
          <div className="space-y-2">
            {subtypes.map((s) => (
              <label key={s} className="flex items-center gap-2.5 cursor-pointer group" onClick={() => toggle("subtypes", s)}>
                <span className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-colors ${
                  filters.subtypes.includes(s) ? "bg-amber-tan border-amber-tan" : "border-amber-tan/20 group-hover:border-amber-tan"
                }`}>
                  {filters.subtypes.includes(s) && <span className="w-2 h-2 bg-obsidian" />}
                </span>
                <span className={`font-dm text-sm transition-colors ${filters.subtypes.includes(s) ? "text-linen-cream font-medium" : "text-linen-cream/80 group-hover:text-linen-cream"}`}>
                  {s}
                </span>
              </label>
            ))}
          </div>
        </Section>
      )}

      {/* Size */}
      <Section title="Size">
        <div className="flex flex-wrap gap-1.5">
          {sizes.map((s) => (
            <button key={s} onClick={() => toggle("sizes", s)}
              className={`font-dm text-[11px] px-2.5 py-1 border transition-colors ${
                filters.sizes.includes(s)
                  ? "bg-amber-tan border-amber-tan text-obsidian font-semibold"
                  : "border-amber-tan/20 text-linen-cream hover:border-amber-tan hover:text-amber-tan"
              }`}>
              {s}
            </button>
          ))}
        </div>
      </Section>

      {/* Color */}
      <Section title="Color">
        <div className="flex flex-wrap gap-2">
          {COLORS.map(({ name, hex }) => (
            <button key={name} onClick={() => toggle("colors", name)} title={name}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                filters.colors.includes(name) ? "border-amber-tan scale-110 shadow-md" : "border-transparent hover:border-amber-tan/40"
              }`}
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
        {filters.colors.length > 0 && (
          <p className="font-dm text-xs text-linen-cream/30 mt-2">{filters.colors.join(", ")}</p>
        )}
      </Section>

      {/* Price */}
      <Section title="Price (NGN)">
        <PriceSlider
          min={filters.priceMin}
          max={filters.priceMax}
          onChange={(min, max) => push({ priceMin: min, priceMax: max })}
        />
      </Section>
    </aside>
  );
}
