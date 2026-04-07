"use client";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { SortKey, FilterState } from "@/lib/products";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest",     label: "Newest" },
  { value: "popular",    label: "Most Popular" },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

interface Props {
  label: string;
  total: number;
  filters: FilterState;
  onFilterToggle: () => void;
}

export default function TopBar({ label, total, filters, onFilterToggle }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setSort = (sort: SortKey) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    ...(label !== "Shop All" ? [{ label, href: "#" }] : []),
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-5">
      <div>
        <nav className="flex items-center gap-1.5 mb-1">
          {crumbs.map((c, i) => (
            <span key={c.label} className="flex items-center gap-1.5">
              {i < crumbs.length - 1 ? (
                <>
                  <Link href={c.href} className="font-dm text-xs text-linen-cream/60 hover:text-amber-tan transition-colors">
                    {c.label}
                  </Link>
                  <span className="text-linen-cream/40 text-xs">/</span>
                </>
              ) : (
                <span className="font-dm text-xs text-linen-cream font-medium">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <p className="font-dm text-xs text-linen-cream/60">
          {total} {total === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onFilterToggle}
          className="lg:hidden flex items-center gap-2 font-dm text-xs border border-amber-tan/20 text-linen-cream/50 px-3 py-2 hover:border-amber-tan hover:text-amber-tan transition-colors rounded-sm">
          <SlidersHorizontal size={13} /> Filters
        </button>

        <div className="relative">
          <select value={filters.sort} onChange={(e) => setSort(e.target.value as SortKey)}
            className="appearance-none font-dm text-xs border border-amber-tan/20 bg-obsidian text-linen-cream px-4 py-2 pr-8 focus:outline-none focus:border-amber-tan cursor-pointer hover:border-amber-tan transition-colors rounded-sm">
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-linen-cream/30" />
        </div>
      </div>
    </div>
  );
}
