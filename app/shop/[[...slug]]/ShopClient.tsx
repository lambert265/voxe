"use client";
import { useState, useMemo, Suspense, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import FilterSidebar from "@/components/shop/FilterSidebar";
import TopBar from "@/components/shop/TopBar";
import ProductCard from "@/components/shop/ProductCard";
import {
  FilterState, SortKey, filterProducts, slugToFilter,
  PRICE_MIN, PRICE_MAX, PAGE_SIZE,
} from "@/lib/products";
import { staggerContainer, scaleInVariant } from "@/lib/motion";

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] bg-charcoal/8 rounded-sm mb-3" />
          <div className="h-2.5 bg-charcoal/8 rounded w-1/3 mb-2" />
          <div className="h-3 bg-charcoal/10 rounded w-3/4 mb-1.5" />
          <div className="h-2.5 bg-charcoal/8 rounded w-1/4" />
        </div>
      ))}
    </div>
  );
}

function ShopInner({ slug }: { slug: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { gender: slugGender, type: slugType, label } = slugToFilter(slug);

  const filters: FilterState = useMemo(() => ({
    gender:   (searchParams.get("gender") as FilterState["gender"]) || slugGender,
    type:     (searchParams.get("type")   as FilterState["type"])   || slugType,
    subtypes: searchParams.get("subtypes")?.split(",").filter(Boolean) ?? [],
    sizes:    searchParams.get("sizes")?.split(",").filter(Boolean)    ?? [],
    colors:   searchParams.get("colors")?.split(",").filter(Boolean)   ?? [],
    priceMin: Number(searchParams.get("priceMin")) || PRICE_MIN,
    priceMax: Number(searchParams.get("priceMax")) || PRICE_MAX,
    sort:     (searchParams.get("sort") as SortKey) || "newest",
    page:     Number(searchParams.get("page")) || 1,
  }), [searchParams, slugGender, slugType]);

  const searchQuery = searchParams.get("q")?.toLowerCase() ?? "";

  const allFiltered = useMemo(() => {
    let results = filterProducts(filters);
    if (searchQuery) {
      results = results.filter((p) =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.subtype.toLowerCase().includes(searchQuery)
      );
    }
    return results;
  }, [filters, searchQuery]);
  const totalPages  = Math.ceil(allFiltered.length / PAGE_SIZE);
  const page        = Math.min(filters.page, totalPages || 1);
  const pageItems   = allFiltered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p === 1) params.delete("page"); else params.set("page", String(p));
    startTransition(() => router.push(`${pathname}?${params.toString()}`, { scroll: true }));
  };

  return (
    <div className="min-h-screen bg-off-white pt-[68px]">
      {/* Page header */}
      <div className="bg-obsidian py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-dm text-amber-tan text-[10px] tracking-[0.35em] uppercase mb-2">VOXE</p>
          <h1 className="font-dm text-4xl md:text-5xl text-linen-cream">{label}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex gap-10">
          {/* Sidebar desktop */}
          <div className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar filters={filters} />
            </div>
          </div>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-obsidian/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 260 }}
                className="absolute left-0 top-0 bottom-0 w-72 bg-off-white overflow-y-auto p-6 shadow-2xl"
              >
                <FilterSidebar filters={filters} onClose={() => setSidebarOpen(false)} />
              </motion.div>
            </div>
          )}

          {/* Main */}
          <div className="flex-1 min-w-0">
            <TopBar
              label={label}
              total={allFiltered.length}
              filters={filters}
              onFilterToggle={() => setSidebarOpen(true)}
            />

            {isPending ? (
              <SkeletonGrid />
            ) : pageItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <span className="font-dm text-7xl italic text-obsidian/8 mb-5">V</span>
                <p className="font-dm text-sm text-charcoal/40 mb-4">No products match your filters.</p>
                <button
                  onClick={() => router.push(pathname, { scroll: false })}
                  className="font-dm text-xs text-amber-tan border-b border-amber-tan pb-0.5 hover:text-charcoal hover:border-charcoal transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <motion.div
                  key={`${page}-${filters.sort}-${filters.subtypes.join()}`}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
                >
                  {pageItems.map((p) => (
                    <motion.div key={p.id} variants={scaleInVariant}>
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </motion.div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-16">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="w-9 h-9 border border-obsidian/20 flex items-center justify-center hover:border-amber-tan hover:text-amber-tan transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 border font-dm text-sm transition-colors ${
                          p === page
                            ? "bg-amber-tan border-amber-tan text-obsidian font-semibold"
                            : "border-obsidian/20 text-charcoal/60 hover:border-amber-tan hover:text-amber-tan"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      className="w-9 h-9 border border-obsidian/20 flex items-center justify-center hover:border-amber-tan hover:text-amber-tan transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopClient({ slug }: { slug: string[] }) {
  return (
    <Suspense>
      <ShopInner slug={slug} />
    </Suspense>
  );
}
